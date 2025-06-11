"use client"

import { Bell, Moon, Sun, Search, Command, Upload, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useNotifications } from "@/hooks/use-notifications"
import { useEffect, useState } from "react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const [sidebarPadding, setSidebarPadding] = useState("pl-0")

  // Enhanced padding logic based on sidebar state
  useEffect(() => {
    if (state === "collapsed") {
      setSidebarPadding("pl-20") // Account for collapsed sidebar width + extra spacing
    } else {
      setSidebarPadding("pl-6") // Standard padding when sidebar is expanded
    }
  }, [state])

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex h-16 items-center justify-between px-6 ${sidebarPadding} transition-all duration-300 ease-in-out border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger className="transition-all duration-200 hover:bg-accent/80 rounded-lg hover:scale-105 active:scale-95" />
        <div className="relative max-w-md flex-1 ml-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search queries, contracts, users..."
            className="pl-10 pr-12 w-full md:w-[300px] lg:w-[400px] xl:w-[500px] h-10 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-md border border-border/50 bg-muted/50 px-2 font-mono text-xs font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-10 w-10 rounded-xl hover:bg-accent/80"
            asChild
          >
            <a href="/contract-extractor">
              <Upload className="h-4 w-4" />
              <span className="sr-only">Upload Contract</span>
            </a>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 rounded-xl hover:bg-accent/80 transition-all duration-200"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </motion.div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl hover:bg-accent/80 transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs p-0 flex items-center justify-center animate-pulse shadow-lg">
                      {unreadCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 p-4 rounded-xl border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <h4 className="font-semibold">Notifications</h4>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-accent/50 cursor-pointer border ${
                      notification.read ? "bg-accent/20 border-transparent" : "bg-accent/40 border-orange-500/20"
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div
                      className={`h-2 w-2 rounded-full mt-2 ${
                        notification.read ? "bg-muted-foreground" : "bg-orange-500 animate-pulse"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No notifications yet</p>
                  <p className="text-xs">We'll notify you when something happens</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <WalletConnectButton />
      </div>
    </motion.header>
  )
}
