"use client"

import { useState } from "react"
import { Plus, Users, Calendar, MoreHorizontal, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const workspaces = [
  {
    id: 1,
    name: "DeFi Analytics Team",
    description: "Collaborative workspace for DeFi protocol analysis",
    members: 8,
    lastActivity: "2 hours ago",
    role: "Owner",
    starred: true,
    color: "bg-[#5C6AC4]",
  },
  {
    id: 2,
    name: "Starknet Research",
    description: "Research and analysis of Starknet ecosystem",
    members: 12,
    lastActivity: "1 day ago",
    role: "Member",
    starred: false,
    color: "bg-[#22D3EE]",
  },
  {
    id: 3,
    name: "NFT Market Analysis",
    description: "Tracking NFT market trends and patterns",
    members: 5,
    lastActivity: "3 days ago",
    role: "Admin",
    starred: true,
    color: "bg-[#FB923C]",
  },
]

export default function WorkspacesPage() {
  const [starredWorkspaces, setStarredWorkspaces] = useState(workspaces.filter((w) => w.starred).map((w) => w.id))

  const toggleStar = (workspaceId: number) => {
    setStarredWorkspaces((prev) =>
      prev.includes(workspaceId) ? prev.filter((id) => id !== workspaceId) : [...prev, workspaceId],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-slate-400 mt-2">Collaborate with teams on data analysis projects</p>
        </div>
        <Button className="bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Workspace
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${workspace.color} flex items-center justify-center`}>
                    <span className="text-white font-semibold">
                      {workspace.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{workspace.name}</CardTitle>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs mt-1">
                      {workspace.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleStar(workspace.id)} className="h-8 w-8 p-0">
                    <Star
                      className={`h-4 w-4 ${
                        starredWorkspaces.includes(workspace.id) ? "fill-yellow-400 text-yellow-400" : "text-slate-400"
                      }`}
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem className="hover:bg-slate-700">View Details</DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-700">Settings</DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-700 text-red-400">Leave Workspace</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-400 mb-4">{workspace.description}</CardDescription>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {workspace.members} members
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {workspace.lastActivity}
                </div>
              </div>

              <div className="flex -space-x-2 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-slate-800">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-slate-700 text-xs">U{i}</AvatarFallback>
                  </Avatar>
                ))}
                {workspace.members > 4 && (
                  <div className="h-6 w-6 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center">
                    <span className="text-xs text-slate-300">+{workspace.members - 4}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
