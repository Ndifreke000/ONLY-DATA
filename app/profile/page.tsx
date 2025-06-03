"use client"

import type React from "react"

import { useState } from "react"
import { Github, Twitter, MapPin, Calendar, Eye, Edit, Upload, Wallet, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg")

  const userStats = {
    queriesCreated: 0,
    notebooksCreated: 0,
    totalViews: 0,
    totalStars: 0,
    totalForks: 0,
    strkBalance: "125.50",
    strkEarned: "45.25",
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="h-full w-full p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between"
      >
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-border">
              <AvatarImage src={profileImage || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-[#5C6AC4] to-[#22D3EE] text-white text-2xl font-bold">
                DA
              </AvatarFallback>
            </Avatar>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Profile Picture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-[#5C6AC4] to-[#22D3EE] text-white text-4xl font-bold">
                        DA
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <Label htmlFor="image-upload">Choose Image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Data Analyst</h1>
            <p className="text-muted-foreground mt-1">Senior Blockchain Data Analyst</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined January 2025
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Button variant="outline">
                <Github className="h-4 w-4 mr-2" />
                Connect GitHub
              </Button>
              <Button variant="outline">
                <Twitter className="h-4 w-4 mr-2" />
                Connect Twitter
              </Button>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} className="bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE]">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </motion.div>

      {/* STRK Balance Section - Only visible in profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-[#5C6AC4]/10 to-[#22D3EE]/10 border-[#5C6AC4]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#5C6AC4]" />
              STRK Balance & Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#5C6AC4]">{userStats.strkBalance} STRK</div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#22D3EE]">{userStats.strkEarned} STRK</div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
              </div>
              <div className="text-center">
                <Button variant="outline" className="w-full">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Rewards
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6 md:grid-cols-5"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.queriesCreated}</div>
            <p className="text-xs text-muted-foreground">Created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notebooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.notebooksCreated}</div>
            <p className="text-xs text-muted-foreground">Created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalStars}</div>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Forks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalForks}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="work" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="work" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No Work Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start creating queries and notebooks to showcase your analytical skills.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button asChild variant="outline">
                    <a href="/sql-sandbox">Create Query</a>
                  </Button>
                  <Button asChild>
                    <a href="/python-sandbox">New Notebook</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Activity Yet</h3>
                <p>Your activity timeline will appear here as you use the platform.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Ready for Achievements</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your first analysis to unlock achievements and earn STRK rewards.
                </p>
                <Button asChild className="bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE]">
                  <a href="/dashboard">Get Started</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
