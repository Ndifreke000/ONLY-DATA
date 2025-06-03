"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, Mail, Book, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Support request submitted:", formData)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Support & Feedback</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Get help with the platform or share your feedback to help us improve
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <Book className="h-8 w-8 text-[#5C6AC4] mx-auto mb-2" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription className="text-slate-400">Find answers in our comprehensive guides</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-slate-700 border-slate-600">
              Browse Docs
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <MessageCircle className="h-8 w-8 text-[#22D3EE] mx-auto mb-2" />
            <CardTitle>Community</CardTitle>
            <CardDescription className="text-slate-400">Connect with other users on Discord</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-slate-700 border-slate-600">
              Join Discord
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <Mail className="h-8 w-8 text-[#FB923C] mx-auto mb-2" />
            <CardTitle>Direct Support</CardTitle>
            <CardDescription className="text-slate-400">Email us for technical assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-slate-700 border-slate-600">
              Email Support
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Submit a Support Request</CardTitle>
          <CardDescription className="text-slate-400">
            Describe your issue or feedback and we'll get back to you soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="account">Account Issue</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="bg-slate-900 border-slate-700"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Please provide as much detail as possible..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-slate-900 border-slate-700 min-h-[120px]"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
