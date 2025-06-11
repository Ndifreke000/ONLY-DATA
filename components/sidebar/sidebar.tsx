"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Code2,
  Database,
  FileCode,
  Github,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Trophy,
  Users,
  Zap,
  HelpCircle,
  User,
  Star,
  Activity,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useHackathons } from "@/hooks/use-hackathons"

// Enhanced icon animation variants
const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.3,
      rotate: { duration: 0.6, ease: "easeInOut" },
    },
  },
  tap: { scale: 0.95 },
}

const badgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
}

export function DuneSidebar() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()
  const { hasActiveHackathon } = useHackathons()
  const { state } = useSidebar()

  return (
    <Sidebar
      className="border-r border-border/50 bg-gradient-to-b from-background via-background to-orange-50/20 dark:to-orange-950/10 shadow-lg"
      variant="sidebar"
      collapsible="icon"
      side="left"
    >
      {/* Header - Enhanced with animations */}
      <SidebarHeader className="p-6 border-b border-border/50 group-data-[collapsible=icon]:p-4 group-data-[collapsible=icon]:pb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center gap-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2"
        >
          <Link
            href="/"
            className="flex items-center gap-4 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2"
          >
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-lg shadow-orange-500/25 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                <Star className="h-5 w-5 text-white group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 opacity-20 blur-sm"></div>
            </motion.div>
            <AnimatePresence>
              {state !== "collapsed" && (
                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                    Starklytics
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">Your Home for Only Data</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>
      </SidebarHeader>

      {/* Content - Enhanced with better spacing and animations */}
      <SidebarContent className="px-4 py-6 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4 overflow-y-auto">
        {/* Analytics Section */}
        <SidebarGroup className="mb-8 group-data-[collapsible=icon]:mb-6">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-4 px-4 group-data-[collapsible=icon]:hidden">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 group-data-[collapsible=icon]:space-y-3">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/15 data-[active=true]:to-pink-500/15 data-[active=true]:border data-[active=true]:border-orange-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <LayoutDashboard className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Dashboard
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/starknet-explorer"}
                  tooltip="Starknet Explorer"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-red-500/15 data-[active=true]:to-orange-500/15 data-[active=true]:border data-[active=true]:border-red-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:relative"
                >
                  <Link
                    href="/starknet-explorer"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <Activity className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Starknet Explorer
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.div variants={badgeVariants} initial="hidden" animate="visible" exit="hidden">
                          <Badge className="ml-auto bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs px-2 py-1 animate-pulse">
                            LIVE
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Enhanced badge for collapsed state */}
                    <AnimatePresence>
                      {state === "collapsed" && (
                        <motion.div
                          className="absolute -top-2 -right-2"
                          variants={badgeVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-background shadow-lg"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/explore"}
                  tooltip="Explore Contracts"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-pink-500/15 data-[active=true]:to-purple-500/15 data-[active=true]:border data-[active=true]:border-pink-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/explore"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <BarChart3 className="h-5 w-5 text-pink-600 dark:text-pink-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Explore
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/contract-analyzer"}
                  tooltip="Contract Analyzer"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-500/15 data-[active=true]:to-indigo-500/15 data-[active=true]:border data-[active=true]:border-purple-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/contract-analyzer"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Contract Analyzer
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/data-visualizer"}
                  tooltip="Data Visualizer"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500/15 data-[active=true]:to-cyan-500/15 data-[active=true]:border data-[active=true]:border-blue-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/data-visualizer"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Data Visualizer
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/data-pipeline"}
                  tooltip="Data Pipeline"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-green-500/15 data-[active=true]:to-emerald-500/15 data-[active=true]:border data-[active=true]:border-green-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/data-pipeline"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <FileCode className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Data Pipeline
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-6 bg-border/50 group-data-[collapsible=icon]:mx-2 group-data-[collapsible=icon]:my-4" />

        {/* Platform Section */}
        <SidebarGroup className="mb-8 group-data-[collapsible=icon]:mb-6">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-4 px-4 group-data-[collapsible=icon]:hidden">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 group-data-[collapsible=icon]:space-y-3">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/marketplace"}
                  tooltip="Data Marketplace"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-500/15 data-[active=true]:to-teal-500/15 data-[active=true]:border data-[active=true]:border-emerald-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/marketplace"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <ShoppingBag className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Marketplace
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/hackathons"}
                  tooltip="Hackathons"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-amber-500/15 data-[active=true]:to-yellow-500/15 data-[active=true]:border data-[active=true]:border-amber-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:relative"
                >
                  <Link
                    href="/hackathons"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Hackathons
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {hasActiveHackathon && (
                      <>
                        <AnimatePresence>
                          {state !== "collapsed" && (
                            <motion.div variants={badgeVariants} initial="hidden" animate="visible" exit="hidden">
                              <Badge className="ml-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-lg">
                                Live
                              </Badge>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* Enhanced badge for collapsed state */}
                        <AnimatePresence>
                          {state === "collapsed" && (
                            <motion.div
                              className="absolute -top-2 -right-2"
                              variants={badgeVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                            >
                              <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse border-2 border-background shadow-lg"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/library"}
                  tooltip="Data Library"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500/15 data-[active=true]:to-blue-500/15 data-[active=true]:border data-[active=true]:border-indigo-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/library"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Library
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/workspaces"}
                  tooltip="Workspaces"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-cyan-500/15 data-[active=true]:to-blue-500/15 data-[active=true]:border data-[active=true]:border-cyan-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/workspaces"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Workspaces
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-6 bg-border/50 group-data-[collapsible=icon]:mx-2 group-data-[collapsible=icon]:my-4" />

        {/* Resources Section */}
        <SidebarGroup className="mb-6 group-data-[collapsible=icon]:mb-4">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-4 px-4 group-data-[collapsible=icon]:hidden">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 group-data-[collapsible=icon]:space-y-3">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/documentation"}
                  tooltip="Documentation"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-green-500/15 data-[active=true]:to-emerald-500/15 data-[active=true]:border data-[active=true]:border-green-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/documentation"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <Code2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Docs
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/support"}
                  tooltip="Support"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/15 data-[active=true]:to-red-500/15 data-[active=true]:border data-[active=true]:border-orange-500/30 data-[active=true]:shadow-lg group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link
                    href="/support"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <HelpCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Support
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="GitHub"
                  className="h-12 rounded-xl transition-all duration-300 hover:bg-accent/80 hover:shadow-md group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <a
                    href="https://github.com/starklytics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 w-full px-4 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full"
                  >
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
                      <Github className="h-5 w-5 text-slate-600 dark:text-slate-400 flex-shrink-0 drop-shadow-sm" />
                    </motion.div>
                    <AnimatePresence>
                      {state !== "collapsed" && (
                        <motion.span
                          className="font-medium text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          GitHub
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - Enhanced with animations */}
      <SidebarFooter className="p-6 border-t border-border/50 group-data-[collapsible=icon]:p-4">
        {user && profile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  className="flex items-center gap-4 p-3 h-auto w-full justify-start hover:bg-accent/80 transition-all duration-200 rounded-xl border border-transparent hover:border-border/50 hover:shadow-md group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center"
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10 ring-2 ring-border/50 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                      <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-pink-500 text-white font-semibold">
                        {profile.full_name?.slice(0, 2).toUpperCase() ||
                          profile.username?.slice(0, 2).toUpperCase() ||
                          "SA"}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:w-3"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>
                  <AnimatePresence>
                    {state !== "collapsed" && (
                      <motion.div
                        className="flex-1 text-left"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm font-semibold">
                          {profile.full_name || profile.username || "Stark Analyst"}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/profile" className="flex w-full items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile & STK Tokens
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/settings" className="flex w-full items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer rounded-lg">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="space-y-3 group-data-[collapsible=icon]:space-y-2">
            <Link href="/auth/signin">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:text-sm">
                  <AnimatePresence mode="wait">
                    {state !== "collapsed" ? (
                      <motion.span
                        key="signin-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Sign In
                      </motion.span>
                    ) : (
                      <motion.span
                        key="signin-arrow"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                        className="text-xl"
                      >
                        →
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </Link>
            <AnimatePresence>
              {state !== "collapsed" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/auth/signup">
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl border-border/50 hover:bg-accent/50 transition-all duration-200"
                    >
                      Create Account
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
