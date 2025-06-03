"use client"

import { useEffect, useState } from "react"
import { getUserNotifications, subscribeToNotifications, markNotificationAsRead } from "@/lib/supabase/client"
import { useAuth } from "./use-auth"
import type { Database } from "@/lib/supabase/database.types"

type Notification = Database["public"]["Tables"]["notifications"]["Row"]

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    loadNotifications()

    // Subscribe to real-time notifications
    const subscription = subscribeToNotifications(user.id, (payload) => {
      if (payload.eventType === "INSERT") {
        setNotifications((prev) => [payload.new, ...prev])
        setUnreadCount((prev) => prev + 1)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

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
