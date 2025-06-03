import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/io/mod.ts" // Declare Deno variable

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { address, txHash, planId } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    // Verify transaction on Starknet
    const isValidPayment = await verifyStarknetTransaction(address, txHash, planId)

    if (!isValidPayment) {
      return new Response(JSON.stringify({ error: "Invalid payment transaction" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Get user by wallet address
    const { data: wallet } = await supabaseClient.from("wallets").select("user_id").eq("address", address).single()

    if (!wallet) {
      return new Response(JSON.stringify({ error: "Wallet not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Get plan details
    const { data: plan } = await supabaseClient.from("subscription_plans").select("*").eq("id", planId).single()

    if (!plan) {
      return new Response(JSON.stringify({ error: "Plan not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Create subscription
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // 1 month subscription

    const { data: subscription, error } = await supabaseClient
      .from("user_subscriptions")
      .insert({
        user_id: wallet.user_id,
        plan_id: planId,
        end_date: endDate.toISOString(),
        payment_tx_hash: txHash,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Create notification
    await supabaseClient.from("notifications").insert({
      user_id: wallet.user_id,
      type: "payment_received",
      title: "Payment Confirmed",
      message: `Your ${plan.name} subscription has been activated!`,
      metadata: { txHash, planId },
    })

    return new Response(JSON.stringify({ subscription }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

async function verifyStarknetTransaction(address: string, txHash: string, planId: string): Promise<boolean> {
  try {
    // Mock verification - replace with actual Starknet RPC call
    // In production, you would:
    // 1. Call Starknet RPC to get transaction details
    // 2. Verify the transaction is confirmed
    // 3. Check the amount matches the plan price
    // 4. Verify the recipient address is correct

    const starknetRpcUrl = Deno.env.get("STARKNET_RPC_URL")

    const response = await fetch(starknetRpcUrl!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "starknet_getTransactionByHash",
        params: [txHash],
        id: 1,
      }),
    })

    const data = await response.json()

    // Verify transaction exists and is successful
    if (!data.result || data.result.status !== "ACCEPTED_ON_L2") {
      return false
    }

    // Additional verification logic would go here
    // For now, we'll return true for demo purposes
    return true
  } catch (error) {
    console.error("Error verifying Starknet transaction:", error)
    return false
  }
}
