"use client"

import { useEffect, useState, useRef } from "react"
import { getActiveHackathons, getUpcomingHackathons, subscribeToHackathonUpdates } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"
import type { RealtimeChannel } from "@supabase/supabase-js"

type Hackathon = Database["public"]["Tables"]["hackathons"]["Row"]

export function useHackathons() {
  const [activeHackathons, setActiveHackathons] = useState<Hackathon[]>([])
  const [upcomingHackathons, setUpcomingHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const subscriptionRef = useRef<RealtimeChannel | null>(null)
  const isSubscribed = useRef(false)

  useEffect(() => {
    loadHackathons()

    // Only create subscription if not already subscribed
    if (!isSubscribed.current) {
      try {
        // Clean up existing subscription if it exists
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe()
          subscriptionRef.current = null
        }

        // Create a new subscription with a unique ID to prevent conflicts
        const uniqueId = `hackathons-${Math.random().toString(36).substring(2, 9)}`
        const subscription = subscribeToHackathonUpdates(uniqueId, (payload) => {
          if (!payload || typeof payload !== "object") return

          if (payload.eventType === "INSERT" && payload.new) {
            const newHackathon = payload.new as Hackathon
            if (newHackathon.status === "active") {
              setActiveHackathons((prev) => [...prev, newHackathon])
            } else if (newHackathon.status === "upcoming") {
              setUpcomingHackathons((prev) => [...prev, newHackathon])
            }
          } else if (payload.eventType === "UPDATE" && payload.new) {
            const updatedHackathon = payload.new as Hackathon

            // Update in appropriate list based on status
            setActiveHackathons((prev) =>
              updatedHackathon.status === "active"
                ? prev.map((h) => (h.id === updatedHackathon.id ? updatedHackathon : h))
                : prev.filter((h) => h.id !== updatedHackathon.id),
            )

            setUpcomingHackathons((prev) =>
              updatedHackathon.status === "upcoming"
                ? prev.map((h) => (h.id === updatedHackathon.id ? updatedHackathon : h))
                : prev.filter((h) => h.id !== updatedHackathon.id),
            )
          }
        })

        subscriptionRef.current = subscription
        isSubscribed.current = true
      } catch (error) {
        console.error("Error setting up hackathon subscription:", error)
      }
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
        isSubscribed.current = false
      }
    }
  }, []) // Empty dependency array to run only once

  const loadHackathons = async () => {
    try {
      const [activeResult, upcomingResult] = await Promise.all([getActiveHackathons(), getUpcomingHackathons()])

      if (activeResult.error) throw activeResult.error
      if (upcomingResult.error) throw upcomingResult.error

      setActiveHackathons(activeResult.data || [])
      setUpcomingHackathons(upcomingResult.data || [])
    } catch (error) {
      console.error("Error loading hackathons:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasActiveHackathon = activeHackathons.length > 0

  return {
    activeHackathons,
    upcomingHackathons,
    hasActiveHackathon,
    loading,
    refresh: loadHackathons,
  }
}
