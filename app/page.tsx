"use client"

import Link from "next/link"
import { ArrowRight, Code2, Database, Users, Zap, Shield, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5C6AC4]/5 to-[#22D3EE]/5" />
        <div className="relative container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE] text-white border-0">
              ⚡ Powered by Starknet • 2025 Edition
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#5C6AC4] via-[#22D3EE] to-[#5C6AC4] bg-clip-text text-transparent">
                DATA
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              The next-generation analytics platform for Starknet. Extract, analyze, and visualize blockchain data with
              AI-powered contract extraction.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE] hover:from-[#5C6AC4]/90 hover:to-[#22D3EE]/90 text-white border-0 shadow-lg px-8 py-6 text-lg"
              >
                <Link href="/dashboard">
                  Start Analyzing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                <Link href="/explore">Explore Platform</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Decentralized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Analytics Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand and analyze Starknet ecosystem data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#5C6AC4] to-[#5C6AC4]/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">SQL Sandbox</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Query Starknet data with our advanced SQL editor featuring AI-powered autocomplete and live schema
                  browser.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#22D3EE]/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Python Notebooks</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Analyze data with cloud-based Jupyter notebooks, pandas, and advanced visualization libraries.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FB923C] to-[#FB923C]/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Contract Extractor</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Upload smart contracts and automatically extract data with AI-powered analysis and insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#10B981]/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Analyst Network</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Connect with expert analysts or offer your services in our decentralized marketplace.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE] bg-clip-text text-transparent">
                0
              </div>
              <div className="text-muted-foreground text-lg">Ready for First Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#22D3EE] to-[#FB923C] bg-clip-text text-transparent">
                ∞
              </div>
              <div className="text-muted-foreground text-lg">Unlimited Potential</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FB923C] to-[#10B981] bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-muted-foreground text-lg">Always Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#10B981] to-[#5C6AC4] bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-muted-foreground text-lg">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Analytics Journey?</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Be among the first to experience the future of blockchain analytics. Join DATA and shape the ecosystem
              together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE] hover:from-[#5C6AC4]/90 hover:to-[#22D3EE]/90 text-white border-0 shadow-lg px-8 py-6 text-lg"
              >
                <Link href="/auth/signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                <Link href="/documentation">View Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
