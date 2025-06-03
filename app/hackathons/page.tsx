"use client"

import { useState } from "react"
import { Trophy, Calendar, DollarSign, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const hackathons = [
  {
    id: 1,
    title: "Starknet DeFi Analytics Challenge",
    description: "Build innovative analytics tools for DeFi protocols on Starknet",
    prize: 50000,
    currency: "STRK",
    participants: 234,
    maxParticipants: 500,
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    status: "active",
    organizer: "Starknet Foundation",
    tags: ["DeFi", "Analytics", "Starknet"],
  },
  {
    id: 2,
    title: "Layer 2 Scaling Metrics",
    description: "Create comprehensive metrics dashboard for L2 scaling solutions",
    prize: 25000,
    currency: "USDC",
    participants: 89,
    maxParticipants: 200,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    status: "active",
    organizer: "Ethereum Foundation",
    tags: ["Layer 2", "Metrics", "Dashboard"],
  },
  {
    id: 3,
    title: "NFT Market Analysis",
    description: "Analyze NFT trading patterns and market trends",
    prize: 15000,
    currency: "ETH",
    participants: 156,
    maxParticipants: 300,
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    status: "upcoming",
    organizer: "OpenSea",
    tags: ["NFT", "Trading", "Analysis"],
  },
]

export default function HackathonsPage() {
  const [activeTab, setActiveTab] = useState("active")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "upcoming":
        return "bg-blue-600"
      case "ended":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hackathons</h1>
          <p className="text-slate-400 mt-2">Compete in data analytics challenges and win prizes</p>
        </div>
        <Button className="bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">
          <Trophy className="h-4 w-4 mr-2" />
          Host Hackathon
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {hackathons
              .filter((h) => h.status === "active")
              .map((hackathon) => (
                <Card key={hackathon.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                        <CardDescription className="text-slate-400 mt-1">{hackathon.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(hackathon.status)}>{hackathon.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#22D3EE]" />
                        <span className="font-medium">
                          {hackathon.prize.toLocaleString()} {hackathon.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-400">{getDaysRemaining(hackathon.endDate)} days left</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-400">Participants</span>
                        <span className="text-slate-300">
                          {hackathon.participants}/{hackathon.maxParticipants}
                        </span>
                      </div>
                      <Progress value={(hackathon.participants / hackathon.maxParticipants) * 100} className="h-2" />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {hackathon.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-slate-400">by {hackathon.organizer}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" className="bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">
                          Join Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {hackathons
              .filter((h) => h.status === "upcoming")
              .map((hackathon) => (
                <Card key={hackathon.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                        <CardDescription className="text-slate-400 mt-1">{hackathon.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(hackathon.status)}>{hackathon.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#22D3EE]" />
                        <span className="font-medium">
                          {hackathon.prize.toLocaleString()} {hackathon.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-400">Starts {hackathon.startDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {hackathon.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-slate-400">by {hackathon.organizer}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" className="bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">
                          Notify Me
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No past hackathons yet</h3>
            <p className="text-slate-400">Check back later for completed competitions and results.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
