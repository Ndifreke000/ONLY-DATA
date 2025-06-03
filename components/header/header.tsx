"use client"

import { Bell, Moon, Sun, Search, Command, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useNotifications } from "@/hooks/use-notifications"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()
  const { notifications, unreadCount, markAsRead } = useNotifications()

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
        state === "collapsed" ? "pl-16" : "pl-4"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="transition-all duration-200 hover:bg-accent" />
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search queries, contracts, users..."
              className="pl-10 pr-12 w-full md:w-[300px] lg:w-[400px] transition-all duration-200 focus:ring-2 focus:ring-[#5C6AC4]/20"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
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
              className="transition-all duration-200"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative transition-all duration-200">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 w-5 rounded-full bg-[#5C6AC4] text-white text-xs p-0 flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <h4 className="font-medium mb-4">Notifications</h4>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-accent cursor-pointer ${
                          notification.read ? "bg-accent/30" : "bg-accent/50"
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div
                          className={`h-2 w-2 rounded-full mt-2 ${
                            notification.read ? "bg-muted-foreground" : "bg-[#5C6AC4] animate-pulse"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <WalletConnectButton />
        </div>
      </div>
    </motion.header>
  )
}
