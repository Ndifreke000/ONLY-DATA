"use client"

import { useEffect, useState } from "react"
import { getActiveHackathons, getUpcomingHackathons, subscribeToHackathonUpdates } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

type Hackathon = Database["public"]["Tables"]["hackathons"]["Row"]

export function useHackathons() {
  const [activeHackathons, setActiveHackathons] = useState<Hackathon[]>([])
  const [upcomingHackathons, setUpcomingHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHackathons()

    // Subscribe to real-time hackathon updates
    const subscription = subscribeToHackathonUpdates((payload) => {
      if (payload.eventType === "INSERT") {
        const newHackathon = payload.new as Hackathon
        if (newHackathon.status === "active") {
          setActiveHackathons((prev) => [...prev, newHackathon])
        } else if (newHackathon.status === "upcoming") {
          setUpcomingHackathons((prev) => [...prev, newHackathon])
        }
      } else if (payload.eventType === "UPDATE") {
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

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
