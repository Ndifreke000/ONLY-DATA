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

  return (
    <Sidebar className="border-r" variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center"
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#5C6AC4] to-[#22D3EE] shadow-lg">
              <Database className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE] bg-clip-text text-transparent">
              DATA
            </span>
          </Link>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider opacity-60">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                  className="transition-all duration-200"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/explore"}
                  tooltip="Explore Queries"
                  className="transition-all duration-200"
                >
                  <Link href="/explore">
                    <BarChart3 className="h-4 w-4" />
                    <span>Explore</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/sql-sandbox"}
                  tooltip="SQL Sandbox"
                  className="transition-all duration-200"
                >
                  <Link href="/sql-sandbox">
                    <Database className="h-4 w-4" />
                    <span>SQL Sandbox</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/python-sandbox"}
                  tooltip="Python Sandbox"
                  className="transition-all duration-200"
                >
                  <Link href="/python-sandbox">
                    <FileCode className="h-4 w-4" />
                    <span>Python</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/contract-extractor"}
                  tooltip="Contract Data Extractor"
                  className="transition-all duration-200"
                >
                  <Link href="/contract-extractor">
                    <Zap className="h-4 w-4" />
                    <span>Contract Extractor</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider opacity-60">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/marketplace"}
                  tooltip="Marketplace"
                  className="transition-all duration-200"
                >
                  <Link href="/marketplace">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Marketplace</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/hackathons"}
                  tooltip="Hackathons"
                  className="transition-all duration-200"
                >
                  <Link href="/hackathons">
                    <Trophy className="h-4 w-4" />
                    <span>Hackathons</span>
                    {hasActiveHackathon && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Badge className="ml-auto bg-[#5C6AC4] text-white text-xs px-1.5 py-0.5 animate-pulse">
                          New
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
                  tooltip="Research Library"
                  className="transition-all duration-200"
                >
                  <Link href="/library">
                    <BookOpen className="h-4 w-4" />
                    <span>Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/workspaces"}
                  tooltip="Workspaces"
                  className="transition-all duration-200"
                >
                  <Link href="/workspaces">
                    <Users className="h-4 w-4" />
                    <span>Workspaces</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider opacity-60">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/documentation"}
                  tooltip="Documentation"
                  className="transition-all duration-200"
                >
                  <Link href="/documentation">
                    <Code2 className="h-4 w-4" />
                    <span>Docs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/support"}
                  tooltip="Support"
                  className="transition-all duration-200"
                >
                  <Link href="/support">
                    <HelpCircle className="h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="GitHub" className="transition-all duration-200">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-4">
        {user && profile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 p-3 h-auto w-full justify-start hover:bg-accent/50 transition-all duration-200 rounded-lg"
              >
                <Avatar className="h-8 w-8 ring-2 ring-border">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-[#5C6AC4] to-[#22D3EE] text-white font-semibold">
                    {profile.full_name?.slice(0, 2).toUpperCase() ||
                      profile.username?.slice(0, 2).toUpperCase() ||
                      "DA"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{profile.full_name || profile.username || "Data Analyst"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile" className="flex w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings" className="flex w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="text-center">
            <Link href="/auth/signin">
              <Button className="w-full bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE]">Sign In</Button>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
