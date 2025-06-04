import { Database, Zap, ArrowRight, Search, MessageCircle, FileCode, BarChart3, GitBranch, Code } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sections = [
  {
    title: "Getting Started",
    description: "Get up and running with Starklytics in minutes",
    icon: Zap,
    articles: [
      { title: "Platform Overview", description: "Understanding the Starklytics ecosystem", readTime: "5 min" },
      { title: "First Steps", description: "Creating your account and connecting wallet", readTime: "3 min" },
      { title: "Dashboard Tour", description: "Navigating the main interface", readTime: "7 min" },
      { title: "Your First Analysis", description: "Analyzing your first smart contract", readTime: "10 min" },
    ],
  },
  {
    title: "Data Pipeline",
    description: "Set up GraphQL subgraphs to ingest StarkNet data",
    icon: GitBranch,
    articles: [
      {
        title: "GraphQL Subgraph Setup",
        description: "Create and deploy subgraphs for data ingestion",
        readTime: "15 min",
      },
      { title: "Real-time Data Streaming", description: "Configure live data feeds from StarkNet", readTime: "12 min" },
      { title: "Custom Contract Indexing", description: "Index your own smart contracts", readTime: "18 min" },
      { title: "Data Pipeline Monitoring", description: "Monitor and troubleshoot your pipelines", readTime: "10 min" },
    ],
  },
  {
    title: "Python Analysis",
    description: "Analyze blockchain data with Python and Jupyter notebooks",
    icon: Code,
    articles: [
      { title: "Python Environment Setup", description: "Getting started with Python analysis", readTime: "8 min" },
      { title: "Data Loading from GraphQL", description: "Connect to your subgraph data", readTime: "10 min" },
      {
        title: "Statistical Analysis",
        description: "Perform statistical analysis on blockchain data",
        readTime: "15 min",
      },
      { title: "Machine Learning Models", description: "Build predictive models for DeFi", readTime: "25 min" },
    ],
  },
  {
    title: "SQL Queries",
    description: "Query structured blockchain data with SQL",
    icon: Database,
    articles: [
      { title: "SQL Sandbox Guide", description: "Using the built-in SQL query environment", readTime: "8 min" },
      { title: "StarkNet Data Schema", description: "Understanding the blockchain data structure", readTime: "12 min" },
      { title: "Advanced SQL Techniques", description: "Complex queries for blockchain analysis", readTime: "20 min" },
      { title: "Query Optimization", description: "Writing efficient queries for large datasets", readTime: "15 min" },
    ],
  },
  {
    title: "Smart Contract Analysis",
    description: "Extract insights from Starknet smart contracts",
    icon: FileCode,
    articles: [
      { title: "Contract Upload Guide", description: "How to upload and analyze contracts", readTime: "8 min" },
      { title: "Cairo Contract Analysis", description: "Understanding Cairo-specific features", readTime: "15 min" },
      { title: "AI-Powered Analysis", description: "Leveraging AI for contract insights", readTime: "12 min" },
      { title: "Security Auditing", description: "Identifying vulnerabilities and risks", readTime: "18 min" },
    ],
  },
  {
    title: "Data Visualization",
    description: "Visualize blockchain data with powerful charts",
    icon: BarChart3,
    articles: [
      { title: "Chart Types", description: "Understanding different visualization options", readTime: "10 min" },
      { title: "Custom Dashboards", description: "Creating personalized data views", readTime: "12 min" },
      { title: "Real-time Analytics", description: "Monitoring on-chain activity as it happens", readTime: "8 min" },
      { title: "Export & Sharing", description: "Sharing insights with your team", readTime: "5 min" },
    ],
  },
]

const faqs = [
  {
    question: "What makes Starklytics different from other analytics platforms?",
    answer:
      "Starklytics is specifically built for Starknet with native GraphQL data pipelines, Python/SQL analysis tools, and ZK-specific insights. We focus on the unique needs of the Starknet ecosystem with specialized tools for zero-knowledge applications.",
  },
  {
    question: "How does the GraphQL data pipeline work?",
    answer:
      "Our GraphQL subgraphs automatically index StarkNet blockchain data in real-time. You can deploy custom subgraphs for any contract, and the data becomes immediately queryable via GraphQL, Python, or SQL. This eliminates the need for manual data fetching and provides a reliable, scalable data infrastructure.",
  },
  {
    question: "Can I use Python for blockchain data analysis?",
    answer:
      "Yes! Starklytics provides a full Python environment with Jupyter notebooks, pandas, numpy, and machine learning libraries pre-installed. You can directly query your GraphQL subgraphs from Python and perform advanced statistical analysis, visualization, and predictive modeling.",
  },
  {
    question: "What SQL capabilities are available?",
    answer:
      "Our SQL sandbox provides PostgreSQL-compatible querying of your indexed blockchain data. You can write complex queries, joins, aggregations, and time-series analysis. The data is automatically structured and optimized for analytical workloads.",
  },
  {
    question: "How do I get started with data pipelines?",
    answer:
      "Navigate to the Data Pipeline section, choose a subgraph template (like ERC-20 transfers or DeFi protocols), provide your contract address, and deploy. Within minutes, you'll have real-time data flowing into your analysis environment.",
  },
]

const guides = {
  pipeline: [
    {
      title: "Setting Up Your First Subgraph",
      steps: [
        "Go to the Data Pipeline section",
        "Choose a template that matches your contract type",
        "Enter your StarkNet contract address",
        "Configure the subgraph name and settings",
        "Deploy and wait for initial indexing to complete",
      ],
    },
    {
      title: "Connecting Python to Your Data",
      steps: [
        "Open the Python Sandbox from the analysis tools",
        "Install the GraphQL client: pip install gql",
        "Use the provided code template to connect to your subgraph",
        "Query your data and load it into a pandas DataFrame",
        "Start analyzing with Python's data science libraries",
      ],
    },
    {
      title: "Writing SQL Queries",
      steps: [
        "Navigate to the SQL Sandbox",
        "Browse the available tables from your subgraphs",
        "Write your SQL query using standard PostgreSQL syntax",
        "Execute the query to see results",
        "Export results as CSV or JSON for further analysis",
      ],
    },
  ],
  analysis: [
    {
      title: "Python Data Analysis Workflow",
      steps: [
        "Load data from GraphQL using the gql library",
        "Clean and preprocess data with pandas",
        "Perform exploratory data analysis",
        "Create visualizations with matplotlib or plotly",
        "Build statistical models or machine learning algorithms",
      ],
    },
    {
      title: "SQL Analysis Patterns",
      steps: [
        "Start with simple SELECT queries to explore data",
        "Use GROUP BY for aggregations and summaries",
        "Apply window functions for time-series analysis",
        "Create complex joins to combine multiple data sources",
        "Optimize queries for performance on large datasets",
      ],
    },
    {
      title: "Real-time Monitoring Setup",
      steps: [
        "Set up your subgraph with real-time indexing",
        "Create Python scripts that poll for new data",
        "Build SQL views for commonly accessed metrics",
        "Set up alerts for anomalous patterns",
        "Create dashboards for continuous monitoring",
      ],
    },
  ],
  contracts: [
    {
      title: "Contract Analysis with Python",
      steps: [
        "Upload your smart contract to the analyzer",
        "Export the analysis results as JSON",
        "Load the data into Python for deeper analysis",
        "Use statistical methods to identify patterns",
        "Create custom visualizations of contract behavior",
      ],
    },
    {
      title: "SQL Queries for Contract Data",
      steps: [
        "Query function call frequencies and gas usage",
        "Analyze transaction patterns over time",
        "Identify the most active users and addresses",
        "Calculate financial metrics like TVL and volume",
        "Compare performance across different contracts",
      ],
    },
  ],
}

export default function DocumentationPage() {
  return (
    <div className="h-full w-full p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Starklytics Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your comprehensive guide to StarkNet data analysis with GraphQL, Python, and SQL
        </p>
        <div className="flex justify-center gap-2">
          <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">2025 Edition</Badge>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">GraphQL + Python + SQL</Badge>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <GitBranch className="h-8 w-8 mx-auto mb-2 text-orange-500 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium">Data Pipeline</h3>
            <p className="text-sm text-muted-foreground">GraphQL subgraphs</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Code className="h-8 w-8 mx-auto mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium">Python Analysis</h3>
            <p className="text-sm text-muted-foreground">Jupyter notebooks</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Database className="h-8 w-8 mx-auto mb-2 text-green-500 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium">SQL Queries</h3>
            <p className="text-sm text-muted-foreground">Structured queries</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-pink-500 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium">Community</h3>
            <p className="text-sm text-muted-foreground">Join discussions</p>
          </CardContent>
        </Card>
      </div>

      {/* User Guides Tabs */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">User Guides</h2>
          <p className="text-muted-foreground">Step-by-step instructions for data analysis workflows</p>
        </div>

        <Tabs defaultValue="pipeline" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pipeline">Data Pipeline</TabsTrigger>
            <TabsTrigger value="analysis">Python & SQL</TabsTrigger>
            <TabsTrigger value="contracts">Contract Analysis</TabsTrigger>
          </TabsList>

          {Object.entries(guides).map(([key, guideList]) => (
            <TabsContent key={key} value={key} className="space-y-4 mt-4">
              {guideList.map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal pl-5 space-y-2">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Documentation Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <section.icon className="h-5 w-5 text-orange-500" />
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
                      <h4 className="font-medium group-hover/item:text-orange-500 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{article.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {article.readTime}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/item:text-orange-500 transition-colors" />
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
          <p className="text-muted-foreground">Common questions about using Starklytics for data analysis</p>
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
        <h2 className="text-3xl font-bold">Ready to start analyzing StarkNet data?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Set up your first data pipeline and start querying blockchain data with Python and SQL
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500">
            <Link href="/data-pipeline">
              Start Data Pipeline <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/python-sandbox">Try Python Analysis</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
