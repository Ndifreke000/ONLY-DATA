import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Auth helpers
export const signInWithWallet = async (address: string, signature: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${address}@wallet.local`,
    password: signature,
  })
  return { data, error }
}

export const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

export const signInWithTwitter = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitter",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// User profile helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()
  return { data, error }
}

export const createUserProfile = async (userId: string, profile: any) => {
  const { data, error } = await supabase
    .from("users")
    .insert({ id: userId, ...profile })
    .select()
    .single()
  return { data, error }
}

// Wallet helpers
export const getUserWallets = async (userId: string) => {
  const { data, error } = await supabase.from("wallets").select("*").eq("user_id", userId)
  return { data, error }
}

export const addWallet = async (userId: string, address: string, provider: string) => {
  const { data, error } = await supabase
    .from("wallets")
    .insert({
      user_id: userId,
      address,
      provider,
      is_primary: false,
    })
    .select()
    .single()
  return { data, error }
}

export const getWalletBalance = async (address: string) => {
  const { data, error } = await supabase.from("wallet_balances").select("*").eq("address", address).single()
  return { data, error }
}

// Query helpers
export const getPublicQueries = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from("queries")
    .select(`
      *,
      users:user_id (username, full_name, avatar_url)
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  return { data, error }
}

export const getUserQueries = async (userId: string) => {
  const { data, error } = await supabase
    .from("queries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  return { data, error }
}

export const createQuery = async (query: any) => {
  const { data, error } = await supabase.from("queries").insert(query).select().single()
  return { data, error }
}

export const updateQuery = async (queryId: string, updates: any) => {
  const { data, error } = await supabase.from("queries").update(updates).eq("id", queryId).select().single()
  return { data, error }
}

export const forkQuery = async (originalQueryId: string, userId: string, title: string) => {
  // Get original query
  const { data: originalQuery, error: fetchError } = await supabase
    .from("queries")
    .select("*")
    .eq("id", originalQueryId)
    .single()

  if (fetchError) return { data: null, error: fetchError }

  // Create forked query
  const { data, error } = await supabase
    .from("queries")
    .insert({
      user_id: userId,
      title,
      description: `Forked from: ${originalQuery.title}`,
      sql_content: originalQuery.sql_content,
      forked_from: originalQueryId,
      tags: originalQuery.tags,
      visibility: "private",
    })
    .select()
    .single()

  // Update fork count
  if (!error) {
    await supabase.rpc("increment_fork_count", { query_id: originalQueryId })
  }

  return { data, error }
}

// Notebook helpers
export const getPublicNotebooks = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from("notebooks")
    .select(`
      *,
      users:user_id (username, full_name, avatar_url)
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  return { data, error }
}

export const getUserNotebooks = async (userId: string) => {
  const { data, error } = await supabase
    .from("notebooks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  return { data, error }
}

export const createNotebook = async (notebook: any) => {
  const { data, error } = await supabase.from("notebooks").insert(notebook).select().single()
  return { data, error }
}

// Hackathon helpers
export const getActiveHackathons = async () => {
  const { data, error } = await supabase
    .from("hackathons")
    .select("*")
    .eq("status", "active")
    .order("start_date", { ascending: true })
  return { data, error }
}

export const getUpcomingHackathons = async () => {
  const { data, error } = await supabase
    .from("hackathons")
    .select("*")
    .eq("status", "upcoming")
    .order("start_date", { ascending: true })
  return { data, error }
}

export const joinHackathon = async (hackathonId: string, userId: string, entry: any) => {
  const { data, error } = await supabase
    .from("hackathon_entries")
    .insert({
      hackathon_id: hackathonId,
      user_id: userId,
      ...entry,
    })
    .select()
    .single()
  return { data, error }
}

// Marketplace helpers
export const getAnalystProfiles = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from("analyst_profiles")
    .select(`
      *,
      users:user_id (username, full_name, avatar_url, location)
    `)
    .order("rating", { ascending: false })
    .range(offset, offset + limit - 1)
  return { data, error }
}

export const createAnalystProfile = async (userId: string, profile: any) => {
  const { data, error } = await supabase
    .from("analyst_profiles")
    .insert({
      user_id: userId,
      ...profile,
    })
    .select()
    .single()
  return { data, error }
}

export const getOpenProjects = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      users:client_id (username, full_name, avatar_url)
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  return { data, error }
}

export const createProject = async (project: any) => {
  const { data, error } = await supabase.from("projects").insert(project).select().single()
  return { data, error }
}

export const applyToProject = async (projectId: string, analystId: string, application: any) => {
  const { data, error } = await supabase
    .from("project_applications")
    .insert({
      project_id: projectId,
      analyst_id: analystId,
      ...application,
    })
    .select()
    .single()
  return { data, error }
}

// Notification helpers
export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  return { data, error }
}

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)
  return { data, error }
}

export const createNotification = async (notification: any) => {
  const { data, error } = await supabase.from("notifications").insert(notification).select().single()
  return { data, error }
}

// Contract extraction helpers
export const createContractExtraction = async (userId: string, extraction: any) => {
  const { data, error } = await supabase
    .from("contract_extractions")
    .insert({
      user_id: userId,
      ...extraction,
    })
    .select()
    .single()
  return { data, error }
}

export const getContractExtractions = async (userId: string) => {
  const { data, error } = await supabase
    .from("contract_extractions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  return { data, error }
}

export const updateContractExtraction = async (extractionId: string, updates: any) => {
  const { data, error } = await supabase
    .from("contract_extractions")
    .update(updates)
    .eq("id", extractionId)
    .select()
    .single()
  return { data, error }
}

// Real-time subscriptions
export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe()
}

export const subscribeToQueryUpdates = (callback: (payload: any) => void) => {
  return supabase
    .channel("queries")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "queries",
        filter: "visibility=eq.public",
      },
      callback,
    )
    .subscribe()
}

export const subscribeToHackathonUpdates = (callback: (payload: any) => void) => {
  return supabase
    .channel("hackathons")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "hackathons",
      },
      callback,
    )
    .subscribe()
}
