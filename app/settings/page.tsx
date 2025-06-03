"use client"

import { useState } from "react"
import { Github, Twitter, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    twoFactorAuth: false,
    publicProfile: true,
  })

  const updateSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account preferences and integrations</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription className="text-slate-400">
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Data" className="bg-slate-900 border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Analyst" className="bg-slate-900 border-slate-700" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="analyst@example.com"
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-md text-slate-200 resize-none"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="publicProfile">Public Profile</Label>
                  <p className="text-sm text-slate-400">Make your profile visible to other users</p>
                </div>
                <Switch
                  id="publicProfile"
                  checked={settings.publicProfile}
                  onCheckedChange={(checked) => updateSetting("publicProfile", checked)}
                />
              </div>
              <Button className="bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription className="text-slate-400">
                Choose how you want to be notified about activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-slate-400">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-slate-400">Receive browser push notifications</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-slate-400">Receive updates about new features and events</p>
                </div>
                <Switch
                  id="marketingEmails"
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => updateSetting("marketingEmails", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription className="text-slate-400">Change your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" className="bg-slate-900 border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="bg-slate-900 border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className="bg-slate-900 border-slate-700" />
                </div>
                <Button className="bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription className="text-slate-400">
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Enable 2FA</Label>
                    <p className="text-sm text-slate-400">Secure your account with two-factor authentication</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>GitHub Integration</CardTitle>
                <CardDescription className="text-slate-400">
                  Connect your GitHub account to share repositories and showcase your work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Github className="h-8 w-8" />
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-sm text-slate-400">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-slate-700 border-slate-600">
                    Connect GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Twitter Integration</CardTitle>
                <CardDescription className="text-slate-400">
                  Connect your Twitter account to share your queries and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Twitter className="h-8 w-8" />
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-slate-400">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-slate-700 border-slate-600">
                    Connect Twitter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Free Plan</h3>
                    <p className="text-sm text-slate-400">Basic features with limited usage</p>
                  </div>
                  <Badge className="bg-slate-700 text-slate-300">Current</Badge>
                </div>
                <Button className="mt-4 bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">Upgrade to Premium</Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your payment methods for subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <CreditCard className="h-12 w-12 mx-auto mb-4" />
                  <p>No payment methods added</p>
                  <Button variant="outline" className="mt-4 bg-slate-700 border-slate-600">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
