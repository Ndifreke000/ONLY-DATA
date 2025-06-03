"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, getUserProfile, createUserProfile } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

type UserProfile = Database["public"]["Tables"]["users"]["Row"]

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await getUserProfile(userId)

      if (error && error.code === "PGRST116") {
        // Profile doesn't exist, create one
        const { data: newProfile } = await createUserProfile(userId, {
          username: null,
          full_name: null,
          bio: null,
          avatar_url: null,
          location: null,
          website: null,
          role: "user",
          is_verified: false,
        })
        setProfile(newProfile)
      } else if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") }

    try {
      const { data, error } = await supabase.from("users").update(updates).eq("id", user.id).select().single()

      if (error) throw error

      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    user,
    profile,
    loading,
    updateProfile,
    signOut: () => supabase.auth.signOut(),
  }
}
