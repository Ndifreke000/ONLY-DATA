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
import { motion } from "framer-motion"

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

export function DuneSidebar() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()
  const { hasActiveHackathon } = useHackathons()
  const { state } = useSidebar()

  return (
    <Sidebar
      className="border-r border-border/50 bg-gradient-to-b from-background via-background to-orange-50/20 dark:to-orange-950/10"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="p-6 border-b border-border/50 group-data-[collapsible=icon]:p-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
        >
          <Link href="/" className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-lg shadow-orange-500/25">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 opacity-20 blur-sm"></div>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Starklytics
              </span>
              <span className="text-xs text-muted-foreground font-medium">Your Home for Only Data</span>
            </div>
          </Link>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <LayoutDashboard className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/starknet-explorer"}
                  tooltip="Starknet Explorer"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/starknet-explorer"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <Activity className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Starknet Explorer</span>
                    <Badge className="ml-auto bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs px-1.5 py-0.5 group-data-[collapsible=icon]:hidden">
                      LIVE
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/explore"}
                  tooltip="Explore Contracts"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/explore"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <BarChart3 className="h-5 w-5 text-pink-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Explore</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/contract-analyzer"}
                  tooltip="Contract Analyzer"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/contract-analyzer"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <Zap className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Contract Analyzer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/data-visualizer"}
                  tooltip="Data Visualizer"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/data-visualizer"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <Database className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Data Visualizer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/data-pipeline"}
                  tooltip="Data Pipeline"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/data-pipeline"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <FileCode className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Data Pipeline</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4 bg-border/50" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/marketplace"}
                  tooltip="Data Marketplace"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/marketplace"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <ShoppingBag className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Marketplace</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/hackathons"}
                  tooltip="Hackathons"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/hackathons"
                    className="flex items-center gap-3 w-full relative group-data-[collapsible=icon]:justify-center"
                  >
                    <Trophy className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Hackathons</span>
                    {hasActiveHackathon && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="ml-auto group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-top-1 group-data-[collapsible=icon]:-right-1 group-data-[collapsible=icon]:ml-0"
                      >
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-lg">
                          Live
                        </Badge>
                      </motion.div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/library"}
                  tooltip="Data Library"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/library"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <BookOpen className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/workspaces"}
                  tooltip="Workspaces"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/workspaces"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <Users className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Workspaces</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4 bg-border/50" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/documentation"}
                  tooltip="Documentation"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/documentation"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <Code2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Docs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/support"}
                  tooltip="Support"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/10 data-[active=true]:to-pink-500/10 data-[active=true]:border data-[active=true]:border-orange-500/20 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <Link
                    href="/support"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <HelpCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="GitHub"
                  className="h-10 rounded-xl transition-all duration-200 hover:bg-accent/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                >
                  <a
                    href="https://github.com/starklytics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <Github className="h-5 w-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">GitHub</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50 group-data-[collapsible=icon]:p-2">
        {user && profile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 p-4 h-auto w-full justify-start hover:bg-accent/80 transition-all duration-200 rounded-xl border border-transparent hover:border-border/50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 ring-2 ring-border/50 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                    <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-pink-500 text-white font-semibold">
                      {profile.full_name?.slice(0, 2).toUpperCase() ||
                        profile.username?.slice(0, 2).toUpperCase() ||
                        "SA"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:w-3"></div>
                </div>
                <div className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-semibold">{profile.full_name || profile.username || "Stark Analyst"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </Button>
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
          <div className="space-y-2 group-data-[collapsible=icon]:space-y-1">
            <Link href="/auth/signin">
              <Button className="w-full h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0">
                <span className="group-data-[collapsible=icon]:hidden">Sign In</span>
                <span className="hidden group-data-[collapsible=icon]:block text-lg">→</span>
              </Button>
            </Link>
            <Link href="/auth/signup" className="group-data-[collapsible=icon]:hidden">
              <Button
                variant="outline"
                className="w-full h-10 rounded-xl border-border/50 hover:bg-accent/50 transition-all duration-200"
              >
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
