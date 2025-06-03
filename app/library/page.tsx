"use client"

import { useState } from "react"
import { Search, BookOpen, Download, ExternalLink, Calendar, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const resources = [
  {
    id: 1,
    title: "Starknet Architecture Deep Dive",
    description: "Comprehensive guide to understanding Starknet's technical architecture and Cairo language",
    type: "whitepaper",
    author: "Starknet Foundation",
    publishDate: "2024-01-15",
    readTime: "45 min",
    tags: ["Architecture", "Cairo", "Technical"],
    downloadUrl: "#",
  },
  {
    id: 2,
    title: "DeFi Analytics Best Practices",
    description: "Industry standards and methodologies for analyzing decentralized finance protocols",
    type: "guide",
    author: "DeFi Research Group",
    publishDate: "2024-01-10",
    readTime: "30 min",
    tags: ["DeFi", "Analytics", "Best Practices"],
    downloadUrl: "#",
  },
  {
    id: 3,
    title: "Layer 2 Scaling Solutions Comparison",
    description:
      "Detailed comparison of different Layer 2 scaling solutions including Starknet, Arbitrum, and Optimism",
    type: "research",
    author: "Ethereum Research",
    publishDate: "2024-01-05",
    readTime: "60 min",
    tags: ["Layer 2", "Scaling", "Comparison"],
    downloadUrl: "#",
  },
  {
    id: 4,
    title: "SQL for Blockchain Data Analysis",
    description: "Complete tutorial series on using SQL for blockchain data analysis with practical examples",
    type: "tutorial",
    author: "DATA Team",
    publishDate: "2023-12-20",
    readTime: "120 min",
    tags: ["SQL", "Tutorial", "Blockchain"],
    downloadUrl: "#",
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "whitepaper":
      return "bg-[#5C6AC4]"
    case "guide":
      return "bg-[#22D3EE]"
    case "research":
      return "bg-[#FB923C]"
    case "tutorial":
      return "bg-[#10B981]"
    default:
      return "bg-slate-600"
  }
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return matchesSearch && resource.type === activeTab
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Research Library</h1>
        <p className="text-slate-400 mt-2">Curated resources, whitepapers, and documentation</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search resources, topics, authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="whitepaper">Whitepapers</TabsTrigger>
          <TabsTrigger value="guide">Guides</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorials</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${getTypeColor(resource.type)} text-white`}>{resource.type}</Badge>
                        <span className="text-sm text-slate-400">{resource.readTime} read</span>
                      </div>
                      <CardTitle className="text-xl hover:text-[#5C6AC4] transition-colors cursor-pointer">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1">{resource.description}</CardDescription>
                    </div>
                    <BookOpen className="h-6 w-6 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {resource.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {resource.publishDate}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Read
                      </Button>
                      <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-4">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
