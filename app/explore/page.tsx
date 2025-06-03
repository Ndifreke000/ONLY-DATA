"use client"

import { useState } from "react"
import { Search, Filter, Star, Eye, GitFork, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const queries = [
  {
    id: 1,
    title: "Starknet Daily Active Users",
    description: "Track daily active users on Starknet over the past 30 days",
    author: "alice.stark",
    avatar: "/placeholder.svg",
    views: 1234,
    forks: 45,
    stars: 89,
    tags: ["DeFi", "Users", "Analytics"],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "TVL Analysis Across Protocols",
    description: "Compare Total Value Locked across major Starknet protocols",
    author: "bob.analyst",
    avatar: "/placeholder.svg",
    views: 856,
    forks: 23,
    stars: 67,
    tags: ["TVL", "DeFi", "Protocols"],
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    title: "Transaction Volume Trends",
    description: "Weekly transaction volume analysis with seasonal patterns",
    author: "charlie.data",
    avatar: "/placeholder.svg",
    views: 2341,
    forks: 78,
    stars: 156,
    tags: ["Transactions", "Volume", "Trends"],
    createdAt: "2024-01-10",
  },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Explore Queries</h1>
        <p className="text-slate-400 mt-2">Discover and learn from community-created queries</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search queries, authors, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="stars">Most Starred</SelectItem>
            <SelectItem value="forks">Most Forked</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="bg-slate-800 border-slate-700">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6">
        {queries.map((query) => (
          <Card
            key={query.id}
            className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg hover:text-[#5C6AC4] transition-colors">{query.title}</CardTitle>
                  <CardDescription className="text-slate-400 mt-1">{query.description}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-slate-600">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={query.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-slate-700 text-xs">
                        {query.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-300">{query.author}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {query.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {query.forks}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {query.stars}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {query.createdAt}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {query.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
