"use client"

import { useState } from "react"
import { Database, Code, Zap, GitBranch, Play, Settings, FileCode, BarChart3, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { motion } from "framer-motion"

const pipelineSteps = [
  {
    title: "GraphQL Subgraph Setup",
    description: "Create and deploy subgraphs to index StarkNet data",
    icon: GitBranch,
    status: "active",
  },
  {
    title: "Data Ingestion",
    description: "Real-time data streaming from StarkNet contracts",
    icon: Database,
    status: "completed",
  },
  {
    title: "Python Analysis",
    description: "Process and analyze data using Python notebooks",
    icon: Code,
    status: "pending",
  },
  {
    title: "SQL Queries",
    description: "Query structured data with SQL for insights",
    icon: FileCode,
    status: "pending",
  },
]

const subgraphTemplates = [
  {
    name: "ERC-20 Token Transfers",
    description: "Index all token transfer events and holder balances",
    contracts: ["Token Bridge", "DEX Pools", "Lending Protocols"],
    entities: ["Transfer", "TokenHolder", "DailyStats"],
  },
  {
    name: "NFT Collections",
    description: "Track NFT mints, transfers, and marketplace activity",
    contracts: ["NFT Collections", "Marketplaces", "Auction Houses"],
    entities: ["NFT", "Collection", "Sale", "Owner"],
  },
  {
    name: "DeFi Protocols",
    description: "Monitor liquidity pools, swaps, and yield farming",
    contracts: ["AMM Pools", "Lending", "Yield Farms"],
    entities: ["Pool", "Swap", "LiquidityPosition", "Yield"],
  },
  {
    name: "Cross-Chain Bridges",
    description: "Track assets moving between L1 and StarkNet",
    contracts: ["StarkNet Bridge", "Token Bridges"],
    entities: ["Deposit", "Withdrawal", "BridgeTransaction"],
  },
]

export default function DataPipelinePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [contractAddress, setContractAddress] = useState("")
  const [subgraphName, setSubgraphName] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)

  const deploySubgraph = async () => {
    if (!contractAddress || !subgraphName) {
      toast.error("Please provide contract address and subgraph name")
      return
    }

    setIsDeploying(true)
    // Simulate deployment
    setTimeout(() => {
      setIsDeploying(false)
      toast.success("Subgraph deployed successfully!")
    }, 3000)
  }

  return (
    <div className="h-full w-full p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Data Pipeline
            </h1>
            <p className="text-muted-foreground mt-2">
              Set up GraphQL subgraphs to ingest StarkNet data, then analyze with Python and SQL
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">GraphQL Powered</Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white">Real-time</Badge>
          </div>
        </div>
      </motion.div>

      {/* Pipeline Status */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Pipeline Status
          </CardTitle>
          <CardDescription>Current status of your data ingestion pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {pipelineSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  step.status === "completed"
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                    : step.status === "active"
                      ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
                      : "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <step.icon
                    className={`h-5 w-5 ${
                      step.status === "completed"
                        ? "text-green-500"
                        : step.status === "active"
                          ? "text-orange-500"
                          : "text-gray-400"
                    }`}
                  />
                  <Badge
                    variant={step.status === "completed" ? "default" : "outline"}
                    className={
                      step.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : step.status === "active"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                          : ""
                    }
                  >
                    {step.status}
                  </Badge>
                </div>
                <h3 className="font-medium text-sm">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subgraph Templates */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-orange-500" />
              Subgraph Templates
            </CardTitle>
            <CardDescription>Pre-built templates for common StarkNet data patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subgraphTemplates.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTemplate === template.name
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                    : "border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700"
                }`}
                onClick={() => setSelectedTemplate(template.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{template.name}</h3>
                  {selectedTemplate === template.name && (
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                      Selected
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Contracts:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.contracts.map((contract) => (
                        <Badge key={contract} variant="outline" className="text-xs">
                          {contract}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Entities:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.entities.map((entity) => (
                        <Badge key={entity} variant="outline" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Deployment Configuration */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-500" />
              Deploy Subgraph
            </CardTitle>
            <CardDescription>Configure and deploy your data ingestion subgraph</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subgraphName">Subgraph Name</Label>
              <Input
                id="subgraphName"
                placeholder="e.g., starklytics/token-transfers"
                value={subgraphName}
                onChange={(e) => setSubgraphName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractAddress">Contract Address</Label>
              <Input
                id="contractAddress"
                placeholder="0x..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="font-mono"
              />
            </div>

            {selectedTemplate && (
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm font-medium">Selected Template:</p>
                <p className="text-sm text-muted-foreground">{selectedTemplate}</p>
              </div>
            )}

            <Button
              onClick={deploySubgraph}
              disabled={isDeploying || !contractAddress || !subgraphName}
              className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
            >
              {isDeploying ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Deploying...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Deploy Subgraph
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Subgraph will index from block 0 to current</p>
              <p>• Real-time updates every ~15 seconds</p>
              <p>• GraphQL endpoint will be available after deployment</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Tools */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            Analysis Tools
          </CardTitle>
          <CardDescription>Use Python and SQL to analyze your ingested data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="python" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="python">Python Analysis</TabsTrigger>
              <TabsTrigger value="sql">SQL Queries</TabsTrigger>
            </TabsList>

            <TabsContent value="python" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Jupyter Notebooks</CardTitle>
                    <CardDescription>Interactive Python analysis environment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">pandas, numpy, matplotlib pre-installed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Direct GraphQL data access</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Open Python Sandbox
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Processing</CardTitle>
                    <CardDescription>Transform and clean your StarkNet data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Real-time data streaming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Statistical analysis tools</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Datasets
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sample Python Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`import pandas as pd
import requests
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# Connect to your subgraph
transport = RequestsHTTPTransport(
    url="https://api.thegraph.com/subgraphs/name/starklytics/token-transfers"
)
client = Client(transport=transport, fetch_schema_from_transport=True)

# Query token transfers
query = gql("""
    query GetTransfers($first: Int!) {
        transfers(first: $first, orderBy: timestamp, orderDirection: desc) {
            id
            from
            to
            value
            timestamp
            transactionHash
        }
    }
""")

# Execute query and convert to DataFrame
result = client.execute(query, variable_values={"first": 1000})
df = pd.DataFrame(result['transfers'])

# Analyze data
daily_volume = df.groupby(df['timestamp'].dt.date)['value'].sum()
top_senders = df['from'].value_counts().head(10)

print("Daily Volume:", daily_volume)
print("Top Senders:", top_senders)`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sql" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SQL Sandbox</CardTitle>
                    <CardDescription>Query your data with SQL</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">PostgreSQL-compatible queries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Real-time data access</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Open SQL Sandbox
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Query Builder</CardTitle>
                    <CardDescription>Visual query construction</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Drag-and-drop interface</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Export results as CSV/JSON</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Build Query
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sample SQL Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="-- Query daily transfer volumes
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as transfer_count,
    SUM(value) as total_volume
FROM transfers 
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Find top token holders
SELECT 
    address,
    SUM(CASE WHEN to_address = address THEN value ELSE -value END) as balance
FROM transfers 
GROUP BY address 
ORDER BY balance DESC 
LIMIT 100;"
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <Button className="mt-3">
                    <Play className="h-4 w-4 mr-2" />
                    Execute Query
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
