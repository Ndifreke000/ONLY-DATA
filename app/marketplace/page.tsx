"use client"

import { useState } from "react"
import { Search, Star, MapPin, DollarSign, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const analysts = [
  {
    id: 1,
    name: "Alice Chen",
    title: "Senior Blockchain Analyst",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 150,
    location: "San Francisco, CA",
    skills: ["DeFi", "Smart Contracts", "Python", "SQL"],
    verified: true,
    available: true,
    description: "Specialized in DeFi protocol analysis with 5+ years experience in blockchain data analytics.",
  },
  {
    id: 2,
    name: "Bob Martinez",
    title: "Data Scientist",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviews: 89,
    hourlyRate: 120,
    location: "Remote",
    skills: ["Machine Learning", "Statistics", "R", "Visualization"],
    verified: true,
    available: false,
    description: "Expert in predictive modeling and statistical analysis for crypto markets.",
  },
  {
    id: 3,
    name: "Carol Kim",
    title: "Starknet Specialist",
    avatar: "/placeholder.svg",
    rating: 5.0,
    reviews: 45,
    hourlyRate: 200,
    location: "London, UK",
    skills: ["Starknet", "Cairo", "Layer 2", "Scaling"],
    verified: true,
    available: true,
    description: "Deep expertise in Starknet ecosystem and Layer 2 scaling solutions.",
  },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Marketplace</h1>
        <p className="text-slate-400 mt-2">Connect with expert analysts or offer your services</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search analysts, skills, location..."
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
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="bg-slate-800 border-slate-700">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {analysts.map((analyst) => (
          <Card key={analyst.id} className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 transition-colors">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={analyst.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-slate-700">
                    {analyst.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{analyst.name}</CardTitle>
                    {analyst.verified && <Badge className="bg-[#5C6AC4] text-white text-xs">Verified</Badge>}
                  </div>
                  <CardDescription className="text-slate-400">{analyst.title}</CardDescription>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {analyst.rating} ({analyst.reviews})
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {analyst.location}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">{analyst.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {analyst.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">${analyst.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${analyst.available ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-sm text-slate-400">{analyst.available ? "Available" : "Busy"}</span>
                </div>
              </div>

              <Button className="w-full mt-4 bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">Contact Analyst</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
