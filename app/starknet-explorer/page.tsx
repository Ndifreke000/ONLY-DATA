"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  SlidersHorizontal,
  FileJson,
  FileSpreadsheet,
  X,
  Check,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts"

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
  {
    hash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcde",
    from: "0xa75e68Ff9746E6532925a3b8D4C0532925a3b8D4",
    to: "0xbef4g410883eF763935044756Hac136c22c200",
    value: "0.123",
    gasUsed: "32000",
    status: "Success",
    timestamp: "7 mins ago",
    type: "Transfer",
  },
  {
    hash: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    from: "0xb86f79Gg0857F7643036a4b8D4C0532925a3b8D4",
    to: "0xcfg5h511994fG874046867Hac136c22c211",
    value: "5.678",
    gasUsed: "78000",
    status: "Success",
    timestamp: "10 mins ago",
    type: "Contract Deployment",
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
  {
    address: "0xa75e68Ff9746E6532925a3b8D4C0532925a3b8D4",
    name: "StarkVault",
    type: "Vault",
    transactions24h: 3245,
    volume24h: 1230000,
    tvl: 34500000,
    verified: false,
  },
  {
    address: "0xb86f79Gg0857F7643036a4b8D4C0532925a3b8D4",
    name: "StarkNFT Marketplace",
    type: "NFT",
    transactions24h: 2156,
    volume24h: 890000,
    tvl: 12300000,
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
  {
    symbol: "USDT",
    name: "Tether",
    price: 1.0,
    change24h: 0.02,
    volume24h: 67800000,
    holders: 145678,
    marketCap: 29800000000,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    price: 1.0,
    change24h: -0.01,
    volume24h: 34500000,
    holders: 78901,
    marketCap: 5600000000,
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
  {
    number: 847389,
    hash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcde",
    timestamp: "48 seconds ago",
    transactions: 134,
    gasUsed: 9876543,
    gasLimit: 15000000,
    miner: "0xa75e68Ff9746E6532925a3b8D4C0532925a3b8D4",
  },
  {
    number: 847388,
    hash: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    timestamp: "60 seconds ago",
    transactions: 189,
    gasUsed: 14523678,
    gasLimit: 15000000,
    miner: "0xb86f79Gg0857F7643036a4b8D4C0532925a3b8D4",
  },
]

// Chart data
const transactionVolumeData = [
  { name: "00:00", volume: 1200 },
  { name: "02:00", volume: 900 },
  { name: "04:00", volume: 600 },
  { name: "06:00", volume: 800 },
  { name: "08:00", volume: 1500 },
  { name: "10:00", volume: 2100 },
  { name: "12:00", volume: 1800 },
  { name: "14:00", volume: 2400 },
  { name: "16:00", volume: 2700 },
  { name: "18:00", volume: 2300 },
  { name: "20:00", volume: 2000 },
  { name: "22:00", volume: 1700 },
]

const activeUsersData = [
  { name: "Mon", users: 12000 },
  { name: "Tue", users: 14000 },
  { name: "Wed", users: 15000 },
  { name: "Thu", users: 13500 },
  { name: "Fri", users: 17000 },
  { name: "Sat", users: 19000 },
  { name: "Sun", users: 16000 },
]

const gasUsageData = [
  { name: "00:00", gas: 8000000 },
  { name: "02:00", gas: 6000000 },
  { name: "04:00", gas: 4000000 },
  { name: "06:00", gas: 5000000 },
  { name: "08:00", gas: 9000000 },
  { name: "10:00", gas: 12000000 },
  { name: "12:00", gas: 11000000 },
  { name: "14:00", gas: 14000000 },
  { name: "16:00", gas: 15000000 },
  { name: "18:00", gas: 13000000 },
  { name: "20:00", gas: 11000000 },
  { name: "22:00", gas: 9000000 },
]

const blockTimeData = [
  { name: "00:00", time: 12.5 },
  { name: "02:00", time: 12.8 },
  { name: "04:00", time: 13.2 },
  { name: "06:00", time: 12.9 },
  { name: "08:00", time: 12.3 },
  { name: "10:00", time: 11.8 },
  { name: "12:00", time: 12.1 },
  { name: "14:00", time: 11.5 },
  { name: "16:00", time: 11.9 },
  { name: "18:00", time: 12.4 },
  { name: "20:00", time: 12.7 },
  { name: "22:00", time: 12.6 },
]

export default function StarknetExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeframe, setTimeframe] = useState("24h")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5) // in seconds
  const [showFilters, setShowFilters] = useState(false)
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv")
  const [exportSection, setExportSection] = useState("transactions")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  })
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState("transactions")

  // Filters
  const [transactionFilters, setTransactionFilters] = useState({
    status: "all",
    type: "all",
    minValue: 0,
    maxValue: 10,
  })
  const [contractFilters, setContractFilters] = useState({
    type: "all",
    verified: "all",
    minTVL: 0,
  })
  const [tokenFilters, setTokenFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    minMarketCap: 0,
  })

  // Filtered data
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions)
  const [filteredContracts, setFilteredContracts] = useState(mockContracts)
  const [filteredTokens, setFilteredTokens] = useState(mockTokens)
  const [filteredBlocks, setFilteredBlocks] = useState(mockBlocks)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)

  // Metrics with animation
  const [metrics, setMetrics] = useState(mockMetrics)

  // Auto-refresh interval reference
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Apply filters
  useEffect(() => {
    // Filter transactions
    const filtered = mockTransactions.filter((tx) => {
      if (transactionFilters.status !== "all" && tx.status.toLowerCase() !== transactionFilters.status.toLowerCase()) {
        return false
      }
      if (transactionFilters.type !== "all" && tx.type !== transactionFilters.type) {
        return false
      }
      const value = Number.parseFloat(tx.value)
      if (value < transactionFilters.minValue || value > transactionFilters.maxValue) {
        return false
      }
      if (searchQuery && !tx.hash.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })
    setFilteredTransactions(filtered)

    // Filter contracts
    const filteredC = mockContracts.filter((contract) => {
      if (contractFilters.type !== "all" && contract.type !== contractFilters.type) {
        return false
      }
      if (contractFilters.verified !== "all" && contract.verified !== (contractFilters.verified === "verified")) {
        return false
      }
      if (contract.tvl < contractFilters.minTVL) {
        return false
      }
      if (
        searchQuery &&
        !contract.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !contract.address.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      return true
    })
    setFilteredContracts(filteredC)

    // Filter tokens
    const filteredT = mockTokens.filter((token) => {
      if (token.price < tokenFilters.minPrice || token.price > tokenFilters.maxPrice) {
        return false
      }
      if (token.marketCap < tokenFilters.minMarketCap) {
        return false
      }
      if (
        searchQuery &&
        !token.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      return true
    })
    setFilteredTokens(filteredT)

    // Filter blocks
    const filteredB = mockBlocks.filter((block) => {
      if (
        searchQuery &&
        !block.hash.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !block.number.toString().includes(searchQuery)
      ) {
        return false
      }
      return true
    })
    setFilteredBlocks(filteredB)
  }, [searchQuery, transactionFilters, contractFilters, tokenFilters])

  // Auto-refresh data every X seconds
  useEffect(() => {
    if (autoRefreshEnabled) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      refreshIntervalRef.current = setInterval(() => {
        refreshData()
      }, refreshInterval * 1000)
    } else if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [autoRefreshEnabled, refreshInterval])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredTransactions, filteredContracts, filteredTokens, filteredBlocks, activeTab])

  const refreshData = () => {
    setIsRefreshing(true)

    // Simulate data refresh with random changes
    setTimeout(() => {
      // Update metrics with small random changes
      setMetrics((prev) => ({
        ...prev,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 50),
        activeUsers24h: prev.activeUsers24h + Math.floor(Math.random() * 100) - 50,
        totalValueLocked: prev.totalValueLocked + Math.floor(Math.random() * 1000000) - 500000,
      }))

      setLastUpdate(new Date())
      setIsRefreshing(false)

      toast.success("Data refreshed successfully", {
        description: `Last updated: ${new Date().toLocaleTimeString()}`,
        duration: 3000,
      })
    }, 800)
  }

  const handleExport = () => {
    setIsExporting(true)

    // Determine which data to export
    let dataToExport: any[] = []
    switch (exportSection) {
      case "transactions":
        dataToExport = filteredTransactions
        break
      case "contracts":
        dataToExport = filteredContracts
        break
      case "tokens":
        dataToExport = filteredTokens
        break
      case "blocks":
        dataToExport = filteredBlocks
        break
      default:
        dataToExport = filteredTransactions
    }

    // Simulate export process
    setTimeout(() => {
      // Create export data
      let exportData: string

      if (exportFormat === "json") {
        exportData = JSON.stringify(dataToExport, null, 2)
        downloadFile(exportData, `starknet-${exportSection}-${formatDate(new Date())}.json`, "application/json")
      } else {
        // CSV format
        const headers = Object.keys(dataToExport[0]).join(",")
        const rows = dataToExport.map((item) => Object.values(item).join(",")).join("\n")
        exportData = `${headers}\n${rows}`
        downloadFile(exportData, `starknet-${exportSection}-${formatDate(new Date())}.csv`, "text/csv")
      }

      setIsExporting(false)
      toast.success(`${exportSection} data exported successfully`, {
        description: `Downloaded as ${exportFormat.toUpperCase()} file`,
        duration: 3000,
      })
    }, 1500)
  }

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard", {
      description: text.slice(0, 20) + "...",
      duration: 2000,
    })
  }

  const truncateHash = (hash: string, length = 8) => {
    return `${hash.slice(0, length)}...${hash.slice(-length)}`
  }

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Get current page data
  const getCurrentPageData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }

  const getTotalPages = (data: any[]) => {
    return Math.ceil(data.length / itemsPerPage)
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="min-h-full w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Starknet Explorer
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Real-time blockchain data and analytics</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Live Data
              </Badge>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing} className="h-9 px-3">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-3">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Export Data</h4>

                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select value={exportSection} onValueChange={setExportSection}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transactions">Transactions</SelectItem>
                          <SelectItem value="contracts">Contracts</SelectItem>
                          <SelectItem value="tokens">Tokens</SelectItem>
                          <SelectItem value="blocks">Blocks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Format</Label>
                      <Select value={exportFormat} onValueChange={(value: "csv" | "json") => setExportFormat(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">
                            <div className="flex items-center gap-2">
                              <FileSpreadsheet className="h-4 w-4" />
                              CSV
                            </div>
                          </SelectItem>
                          <SelectItem value="json">
                            <div className="flex items-center gap-2">
                              <FileJson className="h-4 w-4" />
                              JSON
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleExport} disabled={isExporting} className="w-full">
                      {isExporting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export {exportSection}
                        </>
                      )}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-9 px-3">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search and Auto-refresh Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by hash, address, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={autoRefreshEnabled} onCheckedChange={setAutoRefreshEnabled} id="auto-refresh" />
              <Label htmlFor="auto-refresh" className="text-sm">
                Auto-refresh
              </Label>
            </div>

            {autoRefreshEnabled && (
              <div className="flex items-center gap-2">
                <Label className="text-sm">Every</Label>
                <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(Number(value))}>
                  <SelectTrigger className="w-20 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5s</SelectItem>
                    <SelectItem value="10">10s</SelectItem>
                    <SelectItem value="30">30s</SelectItem>
                    <SelectItem value="60">1m</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-24 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1H</SelectItem>
                <SelectItem value="24h">24H</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="transactions">Transactions</TabsTrigger>
                      <TabsTrigger value="contracts">Contracts</TabsTrigger>
                      <TabsTrigger value="tokens">Tokens</TabsTrigger>
                      <TabsTrigger value="blocks">Blocks</TabsTrigger>
                    </TabsList>

                    <TabsContent value="transactions" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={transactionFilters.status}
                            onValueChange={(value) => setTransactionFilters((prev) => ({ ...prev, status: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={transactionFilters.type}
                            onValueChange={(value) => setTransactionFilters((prev) => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="Transfer">Transfer</SelectItem>
                              <SelectItem value="Contract Call">Contract Call</SelectItem>
                              <SelectItem value="Swap">Swap</SelectItem>
                              <SelectItem value="Contract Deployment">Contract Deployment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Min Value (ETH)</Label>
                          <Slider
                            value={[transactionFilters.minValue]}
                            onValueChange={(value) =>
                              setTransactionFilters((prev) => ({ ...prev, minValue: value[0] }))
                            }
                            max={10}
                            step={0.1}
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground">{transactionFilters.minValue} ETH</div>
                        </div>

                        <div className="space-y-2">
                          <Label>Max Value (ETH)</Label>
                          <Slider
                            value={[transactionFilters.maxValue]}
                            onValueChange={(value) =>
                              setTransactionFilters((prev) => ({ ...prev, maxValue: value[0] }))
                            }
                            max={10}
                            step={0.1}
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground">{transactionFilters.maxValue} ETH</div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="contracts" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={contractFilters.type}
                            onValueChange={(value) => setContractFilters((prev) => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="DEX">DEX</SelectItem>
                              <SelectItem value="Lending">Lending</SelectItem>
                              <SelectItem value="Bridge">Bridge</SelectItem>
                              <SelectItem value="Vault">Vault</SelectItem>
                              <SelectItem value="NFT">NFT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Verification</Label>
                          <Select
                            value={contractFilters.verified}
                            onValueChange={(value) => setContractFilters((prev) => ({ ...prev, verified: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="verified">Verified</SelectItem>
                              <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Min TVL (USD)</Label>
                          <Slider
                            value={[contractFilters.minTVL]}
                            onValueChange={(value) => setContractFilters((prev) => ({ ...prev, minTVL: value[0] }))}
                            max={100000000}
                            step={1000000}
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground">{formatCurrency(contractFilters.minTVL)}</div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tokens" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Min Price (USD)</Label>
                          <Slider
                            value={[tokenFilters.minPrice]}
                            onValueChange={(value) => setTokenFilters((prev) => ({ ...prev, minPrice: value[0] }))}
                            max={5000}
                            step={10}
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground">{formatCurrency(tokenFilters.minPrice)}</div>
                        </div>

                        <div className="space-y-2">
                          <Label>Max Price (USD)</Label>
                          <Slider
                            value={[tokenFilters.maxPrice]}
                            onValueChange={(value) => setTokenFilters((prev) => ({ ...prev, maxPrice: value[0] }))}
                            max={5000}
                            step={10}
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground">{formatCurrency(tokenFilters.maxPrice)}</div>
                        </div>

                        <div className="space-y-2">
                          <Label>Min Market Cap (USD)</Label>
                          <Slider
                            value={[tokenFilters.minMarketCap]}
                            onValueChange={(value) => setTokenFilters((prev) => ({ ...prev, minMarketCap: value[0] }))}
                            max={300000000000}
                            step={1000000000}
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(tokenFilters.minMarketCap)}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="blocks" className="space-y-4 mt-4">
                      <div className="text-center text-muted-foreground py-8">
                        <Info className="h-8 w-8 mx-auto mb-2" />
                        <p>Block filters will be available in the next update</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <motion.p
                    key={metrics.totalTransactions}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl lg:text-2xl font-bold"
                  >
                    {formatNumber(metrics.totalTransactions)}
                  </motion.p>
                </div>
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Activity className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+2.3%</span>
                <span className="text-muted-foreground ml-1">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users (24h)</p>
                  <motion.p
                    key={metrics.activeUsers24h}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl lg:text-2xl font-bold"
                  >
                    {formatNumber(metrics.activeUsers24h)}
                  </motion.p>
                </div>
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+5.7%</span>
                <span className="text-muted-foreground ml-1">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value Locked</p>
                  <motion.p
                    key={metrics.totalValueLocked}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl lg:text-2xl font-bold"
                  >
                    {formatCurrency(metrics.totalValueLocked)}
                  </motion.p>
                </div>
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-500 font-medium">-1.2%</span>
                <span className="text-muted-foreground ml-1">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Block Time</p>
                  <p className="text-xl lg:text-2xl font-bold">{metrics.avgBlockTime}s</p>
                </div>
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+0.3s</span>
                <span className="text-muted-foreground ml-1">vs yesterday</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Transaction Volume (24h)
              </CardTitle>
              <CardDescription>Hourly transaction count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={transactionVolumeData}>
                    <defs>
                      <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#volumeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Active Users (7d)
              </CardTitle>
              <CardDescription>Daily active user count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeUsersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Gas Usage (24h)
              </CardTitle>
              <CardDescription>Hourly gas consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gasUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="gas"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Block Time (24h)
              </CardTitle>
              <CardDescription>Average block time in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={blockTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} domain={[11, 14]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Tables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Blockchain Data</CardTitle>
              <CardDescription>Real-time blockchain information and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="transactions" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Transactions</span>
                    <Badge variant="secondary" className="ml-1">
                      {filteredTransactions.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="contracts" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">Contracts</span>
                    <Badge variant="secondary" className="ml-1">
                      {filteredContracts.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="tokens" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">Tokens</span>
                    <Badge variant="secondary" className="ml-1">
                      {filteredTokens.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="blocks" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="hidden sm:inline">Blocks</span>
                    <Badge variant="secondary" className="ml-1">
                      {filteredBlocks.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="space-y-4">
                  <div className="rounded-xl border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Hash</TableHead>
                            <TableHead className="font-semibold">From</TableHead>
                            <TableHead className="font-semibold">To</TableHead>
                            <TableHead className="font-semibold">Value (ETH)</TableHead>
                            <TableHead className="font-semibold">Gas Used</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold">Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCurrentPageData(filteredTransactions).map((tx, index) => (
                            <motion.tr
                              key={tx.hash}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <code className="text-sm bg-muted px-2 py-1 rounded">{truncateHash(tx.hash)}</code>
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
                              <TableCell>
                                <code className="text-sm bg-muted px-2 py-1 rounded">{truncateHash(tx.from)}</code>
                              </TableCell>
                              <TableCell>
                                <code className="text-sm bg-muted px-2 py-1 rounded">{truncateHash(tx.to)}</code>
                              </TableCell>
                              <TableCell className="font-mono">{tx.value}</TableCell>
                              <TableCell className="font-mono">{formatNumber(Number.parseInt(tx.gasUsed))}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={tx.status === "Success" ? "default" : "destructive"}
                                  className={
                                    tx.status === "Success"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : ""
                                  }
                                >
                                  {tx.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{tx.type}</Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{tx.timestamp}</TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{" "}
                        {filteredTransactions.length} transactions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {getTotalPages(filteredTransactions)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(getTotalPages(filteredTransactions), currentPage + 1))}
                        disabled={currentPage === getTotalPages(filteredTransactions)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contracts" className="space-y-4">
                  <div className="rounded-xl border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Contract</TableHead>
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold">24h Transactions</TableHead>
                            <TableHead className="font-semibold">24h Volume</TableHead>
                            <TableHead className="font-semibold">TVL</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCurrentPageData(filteredContracts).map((contract, index) => (
                            <motion.tr
                              key={contract.address}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">{contract.name}</div>
                                  <code className="text-sm bg-muted px-2 py-1 rounded">
                                    {truncateHash(contract.address)}
                                  </code>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{contract.type}</Badge>
                              </TableCell>
                              <TableCell className="font-mono">{formatNumber(contract.transactions24h)}</TableCell>
                              <TableCell className="font-mono">{formatCurrency(contract.volume24h)}</TableCell>
                              <TableCell className="font-mono">{formatCurrency(contract.tvl)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={contract.verified ? "default" : "secondary"}
                                    className={
                                      contract.verified
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : ""
                                    }
                                  >
                                    {contract.verified ? "Verified" : "Unverified"}
                                  </Badge>
                                  {contract.verified && <Check className="h-4 w-4 text-green-500" />}
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, filteredContracts.length)} of {filteredContracts.length}{" "}
                        contracts
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {getTotalPages(filteredContracts)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(getTotalPages(filteredContracts), currentPage + 1))}
                        disabled={currentPage === getTotalPages(filteredContracts)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tokens" className="space-y-4">
                  <div className="rounded-xl border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Token</TableHead>
                            <TableHead className="font-semibold">Price</TableHead>
                            <TableHead className="font-semibold">24h Change</TableHead>
                            <TableHead className="font-semibold">24h Volume</TableHead>
                            <TableHead className="font-semibold">Market Cap</TableHead>
                            <TableHead className="font-semibold">Holders</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCurrentPageData(filteredTokens).map((token, index) => (
                            <motion.tr
                              key={token.symbol}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">{token.symbol}</div>
                                  <div className="text-sm text-muted-foreground">{token.name}</div>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">{formatCurrency(token.price)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {token.change24h > 0 ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                  )}
                                  <span
                                    className={`font-medium ${token.change24h > 0 ? "text-green-500" : "text-red-500"}`}
                                  >
                                    {token.change24h > 0 ? "+" : ""}
                                    {token.change24h.toFixed(2)}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">{formatCurrency(token.volume24h)}</TableCell>
                              <TableCell className="font-mono">{formatCurrency(token.marketCap)}</TableCell>
                              <TableCell className="font-mono">{formatNumber(token.holders)}</TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, filteredTokens.length)} of {filteredTokens.length} tokens
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {getTotalPages(filteredTokens)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(getTotalPages(filteredTokens), currentPage + 1))}
                        disabled={currentPage === getTotalPages(filteredTokens)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="blocks" className="space-y-4">
                  <div className="rounded-xl border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Block</TableHead>
                            <TableHead className="font-semibold">Hash</TableHead>
                            <TableHead className="font-semibold">Transactions</TableHead>
                            <TableHead className="font-semibold">Gas Used</TableHead>
                            <TableHead className="font-semibold">Gas Limit</TableHead>
                            <TableHead className="font-semibold">Miner</TableHead>
                            <TableHead className="font-semibold">Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCurrentPageData(filteredBlocks).map((block, index) => (
                            <motion.tr
                              key={block.number}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell className="font-mono font-medium">{block.number}</TableCell>
                              <TableCell>
                                <code className="text-sm bg-muted px-2 py-1 rounded">{truncateHash(block.hash)}</code>
                              </TableCell>
                              <TableCell className="font-mono">{block.transactions}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-mono">{formatNumber(block.gasUsed)}</div>
                                  <Progress value={(block.gasUsed / block.gasLimit) * 100} className="h-1" />
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">{formatNumber(block.gasLimit)}</TableCell>
                              <TableCell>
                                <code className="text-sm bg-muted px-2 py-1 rounded">{truncateHash(block.miner)}</code>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{block.timestamp}</TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, filteredBlocks.length)} of {filteredBlocks.length} blocks
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {getTotalPages(filteredBlocks)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(getTotalPages(filteredBlocks), currentPage + 1))}
                        disabled={currentPage === getTotalPages(filteredBlocks)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
