"use client"

import { useEffect, useState, useRef } from "react"
import { getUserNotifications, subscribeToNotifications, markNotificationAsRead } from "@/lib/supabase/client"
import { useAuth } from "./use-auth"
import type { Database } from "@/lib/supabase/database.types"
import type { RealtimeChannel } from "@supabase/supabase-js"

type Notification = Database["public"]["Tables"]["notifications"]["Row"]

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const subscriptionRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    loadNotifications()

    // Clean up existing subscription before creating new one
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }

    // Subscribe to real-time notifications
    try {
      subscriptionRef.current = subscribeToNotifications(user.id, (payload) => {
        if (payload?.eventType === "INSERT" && payload?.new) {
          setNotifications((prev) => [payload.new, ...prev])
          setUnreadCount((prev) => prev + 1)
        }
      })
    } catch (error) {
      console.error("Error setting up notifications subscription:", error)
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, [user]) // Updated to depend on user object instead of user.id

  const loadNotifications = async () => {
    if (!user) return

    try {
      const { data, error } = await getUserNotifications(user.id)
      if (error) throw error

      setNotifications(data || [])
      setUnreadCount(data?.filter((n) => !n.read).length || 0)
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await markNotificationAsRead(notificationId)
      if (error) throw error

      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    refresh: loadNotifications,
  }
}
