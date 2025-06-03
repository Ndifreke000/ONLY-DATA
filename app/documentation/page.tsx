import { Code2, Database, Zap, Users, ArrowRight, Search, Video, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const sections = [
  {
    title: "Quick Start",
    description: "Get up and running with DATA in minutes",
    icon: Zap,
    articles: [
      { title: "Platform Overview", description: "Understanding the DATA ecosystem", readTime: "5 min" },
      { title: "First Steps", description: "Creating your account and connecting wallet", readTime: "3 min" },
      { title: "Dashboard Tour", description: "Navigating the main interface", readTime: "7 min" },
      { title: "Your First Query", description: "Creating and running SQL queries", readTime: "10 min" },
    ],
  },
  {
    title: "SQL Analytics",
    description: "Master blockchain data querying with SQL",
    icon: Database,
    articles: [
      { title: "Starknet Data Schema", description: "Understanding blockchain data structure", readTime: "15 min" },
      { title: "Query Optimization", description: "Writing efficient queries for large datasets", readTime: "20 min" },
      { title: "Advanced Joins", description: "Combining multiple data sources", readTime: "12 min" },
      { title: "Time Series Analysis", description: "Analyzing trends over time", readTime: "18 min" },
    ],
  },
  {
    title: "Contract Extraction",
    description: "Extract insights from smart contracts",
    icon: Code2,
    articles: [
      { title: "Contract Upload Guide", description: "How to upload and analyze contracts", readTime: "8 min" },
      { title: "Data Extraction Types", description: "Understanding different extraction methods", readTime: "12 min" },
      { title: "AI-Powered Analysis", description: "Leveraging AI for contract insights", readTime: "15 min" },
      { title: "Export and Integration", description: "Using extracted data in other tools", readTime: "10 min" },
    ],
  },
  {
    title: "Python Notebooks",
    description: "Advanced analytics with Python and machine learning",
    icon: Code2,
    articles: [
      { title: "Notebook Environment", description: "Understanding the Python environment", readTime: "6 min" },
      { title: "Data Loading", description: "Importing blockchain data into notebooks", readTime: "10 min" },
      { title: "Visualization Libraries", description: "Creating charts and dashboards", readTime: "15 min" },
      { title: "Machine Learning", description: "Predictive analytics for DeFi", readTime: "25 min" },
    ],
  },
  {
    title: "Marketplace",
    description: "Connect with analysts and grow your network",
    icon: Users,
    articles: [
      { title: "Analyst Profiles", description: "Creating an impressive analyst profile", readTime: "8 min" },
      { title: "Project Collaboration", description: "Working with teams and clients", readTime: "12 min" },
      { title: "Pricing Strategies", description: "Setting competitive rates", readTime: "10 min" },
      { title: "Quality Standards", description: "Maintaining high-quality deliverables", readTime: "15 min" },
    ],
  },
  {
    title: "API & Integrations",
    description: "Integrate DATA with external tools",
    icon: Code2,
    articles: [
      { title: "REST API Overview", description: "Using the DATA API", readTime: "12 min" },
      { title: "Authentication", description: "API keys and security", readTime: "8 min" },
      { title: "Webhooks", description: "Real-time data notifications", readTime: "10 min" },
      { title: "Third-party Tools", description: "Integrating with BI tools", readTime: "15 min" },
    ],
  },
]

const faqs = [
  {
    question: "What makes DATA different from other analytics platforms?",
    answer:
      "DATA is specifically built for Starknet with native support for Cairo contracts, AI-powered contract extraction, and a decentralized analyst marketplace. We focus on the unique needs of the Starknet ecosystem.",
  },
  {
    question: "How does contract data extraction work?",
    answer:
      "Our AI-powered system analyzes smart contracts to extract key metrics like TVL, transaction patterns, user behavior, and gas optimization opportunities. Simply upload a contract file or provide an address.",
  },
  {
    question: "Can I earn STRK tokens on the platform?",
    answer:
      "Yes! You can earn STRK tokens by creating high-quality queries, participating in hackathons, providing analyst services, and contributing to the community.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We use end-to-end encryption, decentralized storage for sensitive data, and give you full control over data sharing permissions.",
  },
  {
    question: "How do I get started with Python notebooks?",
    answer:
      "Navigate to the Python Sandbox, create a new notebook, and start with our pre-loaded Starknet datasets. We provide templates and examples to help you get started quickly.",
  },
]

export default function DocumentationPage() {
  return (
    <div className="h-full w-full p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive guides, tutorials, and API documentation for the DATA platform
        </p>
        <div className="flex justify-center">
          <Badge className="bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE] text-white">
            2025 Edition • Always Up-to-Date
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search documentation..." className="pl-10 h-12 text-lg" />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-[#5C6AC4] group-hover:scale-110 transition-transform" />
            <h3 className="font-medium">Quick Start</h3>
            <p className="text-sm text-muted-foreground">Get started in 5 minutes</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Video className="h-8 w-8 mx-auto mb-2 text-[#22D3EE] group-hover:scale-110 transition-transform" />
            <h3 className="font-medium">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground">Learn by watching</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Code2 className="h-8 w-8 mx-auto mb-2 text-[#FB923C] group-hover:scale-110 transition-transform" />
            <h3 className="font-medium">API Reference</h3>
            <p className="text-sm text-muted-foreground">Complete API docs</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-[#10B981] group-hover:scale-110 transition-transform" />
            <h3 className="font-medium">Community</h3>
            <p className="text-sm text-muted-foreground">Join discussions</p>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#5C6AC4]/20 to-[#22D3EE]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <section.icon className="h-5 w-5 text-[#5C6AC4]" />
                </div>
                <div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.articles.map((article) => (
                  <Link
                    key={article.title}
                    href="#"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group/item"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium group-hover/item:text-[#5C6AC4] transition-colors">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">{article.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {article.readTime}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/item:text-[#5C6AC4] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Common questions about using the DATA platform</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 py-12">
        <h2 className="text-3xl font-bold">Still have questions?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our community and support team are here to help you succeed with DATA
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE]">
            <Link href="/support">
              Get Support <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://discord.gg/data" target="_blank" rel="noopener noreferrer">
              Join Discord
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
