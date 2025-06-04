"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  Database,
  Search,
  Download,
  RefreshCw,
  Copy,
  DollarSign,
  BarChart3,
  Clock,
  Hash,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Mock data - In real app, this would come from Starknet APIs
const mockMetrics = {
  totalTransactions: 2847392,
  totalContracts: 15234,
  totalValueLocked: 847000000,
  activeUsers24h: 23456,
  gasUsed24h: 1234567890,
  avgBlockTime: 12.3,
  networkHashrate: "2.4 TH/s",
  currentBlock: 847392,
}

const mockTransactions = [
  {
    hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    from: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    to: "0x8ba1f109551bD432803012645Hac136c22c177",
    value: "1.234",
    gasUsed: "21000",
    status: "Success",
    timestamp: "2 mins ago",
    type: "Transfer",
  },
  {
    hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    from: "0x853d46Dd7635D7532925a3b8D4C0532925a3b8D4",
    to: "0x9cb2f209661cE542813022645Hac136c22c188",
    value: "0.567",
    gasUsed: "45000",
    status: "Success",
    timestamp: "3 mins ago",
    type: "Contract Call",
  },
  {
    hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    from: "0x964e57Ee8746E6532925a3b8D4C0532925a3b8D4",
    to: "0xadc3f309772dF652824033645Hac136c22c199",
    value: "2.891",
    gasUsed: "67000",
    status: "Failed",
    timestamp: "5 mins ago",
    type: "Swap",
  },
]

const mockContracts = [
  {
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    name: "StarkSwap Router",
    type: "DEX",
    transactions24h: 15234,
    volume24h: 2340000,
    tvl: 45600000,
    verified: true,
  },
  {
    address: "0x853d46Dd7635D7532925a3b8D4C0532925a3b8D4",
    name: "zkLend Protocol",
    type: "Lending",
    transactions24h: 8967,
    volume24h: 1890000,
    tvl: 78900000,
    verified: true,
  },
  {
    address: "0x964e57Ee8746E6532925a3b8D4C0532925a3b8D4",
    name: "Starknet Bridge",
    type: "Bridge",
    transactions24h: 5432,
    volume24h: 5670000,
    tvl: 123400000,
    verified: true,
  },
]

const mockTokens = [
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2340.56,
    change24h: 2.34,
    volume24h: 45600000,
    holders: 234567,
    marketCap: 281000000000,
  },
  {
    symbol: "STRK",
    name: "Starknet Token",
    price: 1.23,
    change24h: -1.45,
    volume24h: 12300000,
    holders: 89012,
    marketCap: 1230000000,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
    change24h: 0.01,
    volume24h: 78900000,
    holders: 156789,
    marketCap: 32100000000,
  },
]

const mockBlocks = [
  {
    number: 847392,
    hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    timestamp: "12 seconds ago",
    transactions: 156,
    gasUsed: 12456789,
    gasLimit: 15000000,
    miner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  },
  {
    number: 847391,
    hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    timestamp: "24 seconds ago",
    transactions: 203,
    gasUsed: 13567890,
    gasLimit: 15000000,
    miner: "0x853d46Dd7635D7532925a3b8D4C0532925a3b8D4",
  },
  {
    number: 847390,
    hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    timestamp: "36 seconds ago",
    transactions: 178,
    gasUsed: 11234567,
    gasLimit: 15000000,
    miner: "0x964e57Ee8746E6532925a3b8D4C0532925a3b8D4",
  },
]

export default function StarknetExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeframe, setTimeframe] = useState("24h")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Auto-refresh data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdate(new Date())
    }, 1000)
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toLocaleString()
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Starknet Explorer
          </h1>
          <p className="text-muted-foreground">Real-time Starknet blockchain data and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Data
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <p className="text-xs text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search transactions, addresses, blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockMetrics.totalTransactions)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from yesterday
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
              <Database className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockMetrics.totalContracts)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +234 new contracts
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
              <DollarSign className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatNumber(mockMetrics.totalValueLocked)}</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1% from yesterday
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockMetrics.activeUsers24h)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.7% from yesterday
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Latest Transactions
              </CardTitle>
              <CardDescription>Real-time transaction feed from the Starknet blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Value (ETH)</TableHead>
                    <TableHead>Gas Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((tx, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                            {formatAddress(tx.hash)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(tx.hash)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          {formatAddress(tx.from)}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">
                        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">{formatAddress(tx.to)}</span>
                      </TableCell>
                      <TableCell>{tx.value}</TableCell>
                      <TableCell>{formatNumber(Number.parseInt(tx.gasUsed))}</TableCell>
                      <TableCell>
                        <Badge
                          variant={tx.status === "Success" ? "default" : "destructive"}
                          className={tx.status === "Success" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{tx.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.type}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-red-500" />
                Top Smart Contracts
              </CardTitle>
              <CardDescription>Most active smart contracts by transaction volume and TVL</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>24h Transactions</TableHead>
                    <TableHead>24h Volume</TableHead>
                    <TableHead>TVL</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockContracts.map((contract, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{contract.name}</div>
                          {contract.verified && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                            {formatAddress(contract.address)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(contract.address)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{contract.type}</Badge>
                      </TableCell>
                      <TableCell>{formatNumber(contract.transactions24h)}</TableCell>
                      <TableCell>${formatNumber(contract.volume24h)}</TableCell>
                      <TableCell>${formatNumber(contract.tvl)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Active</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-pink-500" />
                Token Markets
              </CardTitle>
              <CardDescription>Live token prices and market data on Starknet</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>24h Change</TableHead>
                    <TableHead>24h Volume</TableHead>
                    <TableHead>Market Cap</TableHead>
                    <TableHead>Holders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTokens.map((token, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {token.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold">{token.symbol}</div>
                            <div className="text-sm text-muted-foreground">{token.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">${token.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center gap-1 ${
                            token.change24h >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {token.change24h >= 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {Math.abs(token.change24h).toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell>${formatNumber(token.volume24h)}</TableCell>
                      <TableCell>${formatNumber(token.marketCap)}</TableCell>
                      <TableCell>{formatNumber(token.holders)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-purple-500" />
                Latest Blocks
              </CardTitle>
              <CardDescription>Recent blocks mined on the Starknet blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Block</TableHead>
                    <TableHead>Block Hash</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Gas Used</TableHead>
                    <TableHead>Gas Limit</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBlocks.map((block, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold">
                          #{block.number.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                            {formatAddress(block.hash)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(block.hash)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{block.timestamp}</TableCell>
                      <TableCell>{block.transactions}</TableCell>
                      <TableCell>{formatNumber(block.gasUsed)}</TableCell>
                      <TableCell>{formatNumber(block.gasLimit)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={(block.gasUsed / block.gasLimit) * 100} className="w-16 h-2" />
                          <span className="text-sm">{((block.gasUsed / block.gasLimit) * 100).toFixed(1)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Transaction Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  📊 Transaction volume chart would be rendered here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  📈 Active users chart would be rendered here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Gas Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  ⚡ Gas usage trends would be rendered here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Block Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  ⏱️ Block time analysis would be rendered here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
