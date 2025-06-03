"use client"

import { useState } from "react"
import Link from "next/link"
import { Github, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-200 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-slate-400">Sign in to your DATA account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <WalletConnectButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-slate-900 border-slate-700 hover:bg-slate-700">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900 border-slate-700"
              />
            </div>

            <Button className="w-full bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">
              <Mail className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>

          <div className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#5C6AC4] hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
