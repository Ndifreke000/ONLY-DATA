import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { env } from "https://deno.land/std@0.168.0/dotenv/mod.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { query, userId } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(env.get("SUPABASE_URL") ?? "", env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "")

    // Validate user authentication
    const authHeader = req.headers.get("Authorization")!
    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
    } = await supabaseClient.auth.getUser(token)

    if (!user || user.id !== userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Sanitize and validate SQL query
    const sanitizedQuery = sanitizeSQL(query)
    if (!sanitizedQuery) {
      return new Response(JSON.stringify({ error: "Invalid SQL query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Execute query with timeout
    const startTime = Date.now()
    let result, error

    try {
      // In a real implementation, you would connect to your data warehouse
      // For now, we'll simulate query execution
      result = await executeStarknetQuery(sanitizedQuery)
    } catch (e) {
      error = e.message
    }

    const executionTime = Date.now() - startTime

    // Log query execution
    await supabaseClient.from("query_runs").insert({
      query_id: query.id,
      user_id: userId,
      execution_time_ms: executionTime,
      status: error ? "error" : "success",
      error_message: error,
      result_hash: result ? generateHash(JSON.stringify(result)) : null,
    })

    return new Response(
      JSON.stringify({
        result: error ? null : result,
        error,
        executionTime,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

function sanitizeSQL(query: string): string | null {
  // Basic SQL sanitization - in production, use a proper SQL parser
  const forbidden = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "CREATE", "TRUNCATE"]
  const upperQuery = query.toUpperCase()

  for (const keyword of forbidden) {
    if (upperQuery.includes(keyword)) {
      return null
    }
  }

  return query
}

async function executeStarknetQuery(query: string) {
  // Mock implementation - replace with actual Starknet data query
  // This would typically connect to your indexed Starknet data
  return {
    columns: ["block_number", "transaction_count", "timestamp"],
    rows: [
      [123456, 45, "2024-01-15T10:30:00Z"],
      [123457, 52, "2024-01-15T10:31:00Z"],
      [123458, 38, "2024-01-15T10:32:00Z"],
    ],
  }
}

function generateHash(data: string): string {
  // Simple hash function - use crypto.subtle in production
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(16)
}
