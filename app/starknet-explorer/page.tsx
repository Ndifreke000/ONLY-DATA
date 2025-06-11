"use client"

import { useState } from "react"
import {
  useStarkNetDirect,
  formatStarkNetValue,
  formatAddress,
  formatNumber,
  formatCurrency,
  getStatusColor,
  getTypeColor,
} from "@/hooks/use-starknet-direct"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  RefreshCw,
  AlertCircle,
  Database,
  CheckCircle2,
  Loader2,
  Activity,
  Hash,
  DollarSign,
  Users,
  Clock,
  Copy,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Wifi,
  WifiOff,
} from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function StarkNetExplorer() {
  const {
    blocks,
    transactions,
    contracts,
    tokens,
    networkStats,
    loading,
    error,
    connectionStatus,
    lastUpdate,
    retry,
    refresh,
    createSchema,
    schemaInitializing,
    retryCount,
    debugInfo,
  } = useStarkNetDirect()

  const [activeTab, setActiveTab] = useState("transactions")
  const [showSQLScript, setShowSQLScript] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard", {
      description: text.slice(0, 20) + "...",
      duration: 2000,
    })
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "error":
        return <WifiOff className="h-4 w-4 text-red-500" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
    }
  }

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Connected
          </Badge>
        )
      case "error":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            Error
          </Badge>
        )
      case "no-tables":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
          >
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
            Setup Required
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
            Connecting
          </Badge>
        )
    }
  }

  const getSQLScript = () => {
    return `-- Function to format an address
CREATE OR REPLACE FUNCTION format_address(address TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN SUBSTRING(address, 1, 6) || '...' || SUBSTRING(address, LENGTH(address) - 4, 5);
END;
$$ LANGUAGE plpgsql;

-- Function to format a StarkNet value (Wei to ETH)
CREATE OR REPLACE FUNCTION format_starknet_value(value_wei NUMERIC)
RETURNS TEXT AS $$
DECLARE
  value_eth NUMERIC;
BEGIN
  value_eth := value_wei / 1000000000000000000.0;
  RETURN TRUNC(value_eth, 4);
END;
$$ LANGUAGE plpgsql;

-- Function to format a number with commas
CREATE OR REPLACE FUNCTION format_number(x NUMERIC)
RETURNS TEXT AS $$
BEGIN
  RETURN to_char(x, '999G999G999G999');
END;
$$ LANGUAGE plpgsql;

-- Function to format currency
CREATE OR REPLACE FUNCTION format_currency(amount NUMERIC)
RETURNS TEXT AS $$
BEGIN
  RETURN '$' || to_char(amount, '999G999G999G999D99');
END;
$$ LANGUAGE plpgsql;

-- Function to get status color
CREATE OR REPLACE FUNCTION get_status_color(status TEXT)
RETURNS TEXT AS $$
BEGIN
  CASE
    WHEN status = 'PENDING' THEN RETURN 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    WHEN status = 'ACCEPTED_ON_L2' THEN RETURN 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    WHEN status = 'REJECTED' THEN RETURN 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    ELSE RETURN 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to get type color
CREATE OR REPLACE FUNCTION get_type_color(transaction_type TEXT)
RETURNS TEXT AS $$
BEGIN
  CASE
    WHEN transaction_type = 'DEPLOY' THEN RETURN 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    WHEN transaction_type = 'INVOKE' THEN RETURN 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    WHEN transaction_type = 'DECLARE' THEN RETURN 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    ELSE RETURN 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  END CASE;
END;
$$ LANGUAGE plpgsql;`
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="min-h-full w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              StarkNet Explorer
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Real-time blockchain data via Supabase Direct
            </p>
          </div>

          <div className="flex items-center gap-3">
            {getConnectionBadge()}
            {lastUpdate && connectionStatus === "connected" && (
              <span className="text-xs sm:text-sm text-muted-foreground">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            {connectionStatus === "connected" && (
              <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="h-9 px-3">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            )}
          </div>
        </motion.div>

        {/* Connection Status Alerts */}
        {connectionStatus === "connecting" && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Connecting to StarkNet Database</AlertTitle>
            <AlertDescription>Testing connection and checking database schema...</AlertDescription>
          </Alert>
        )}

        {connectionStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={retry} className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === "no-tables" && (
          <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
            <Database className="h-4 w-4" />
            <AlertTitle>Database Setup Required</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                The StarkNet database tables don't exist yet. Click the button below to create them with sample data.
              </p>
              <div className="flex gap-2">
                <Button onClick={createSchema} disabled={schemaInitializing} className="gap-2" size="sm">
                  {schemaInitializing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Schema...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      Initialize Database
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={retry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === "no-functions" && (
          <Alert className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Functions Missing</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>
                The required database functions are not set up. Please run the essential functions SQL script in your
                Supabase SQL Editor.
              </p>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to your Supabase Dashboard → SQL Editor</li>
                  <li>Copy the SQL script below and paste it into the editor</li>
                  <li>Click "Run" to execute the script</li>
                  <li>Click "Check Again" below to verify the setup</li>
                </ol>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => setShowSQLScript(true)} className="gap-2" size="sm">
                  <Database className="h-4 w-4" />
                  Show SQL Script
                </Button>
                <Button variant="outline" size="sm" onClick={retry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* SQL Script Modal */}
        {showSQLScript && (
          <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Essential Functions SQL Script</span>
                <Button variant="ghost" size="sm" onClick={() => setShowSQLScript(false)} className="h-6 w-6 p-0">
                  ×
                </Button>
              </CardTitle>
              <CardDescription>
                Copy this entire script and paste it into your Supabase SQL Editor, then click "Run"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-md text-xs overflow-auto max-h-96 font-mono">
                  <code>{getSQLScript()}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(getSQLScript())
                    toast.success("SQL script copied to clipboard!")
                  }}
                  className="absolute top-2 right-2"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>

              <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                <p className="text-sm font-medium">⚠️ Important:</p>
                <p className="text-sm">
                  Make sure to copy the ENTIRE script including all functions. After running it successfully, click
                  "Check Again" to proceed with the setup.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {connectionStatus === "connected" && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Connected to StarkNet</AlertTitle>
            <AlertDescription>
              Successfully connected to the StarkNet database and loaded {transactions.length} transactions,{" "}
              {blocks.length} blocks, {contracts.length} contracts, and {tokens.length} tokens.
            </AlertDescription>
          </Alert>
        )}

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>Connection Status: {connectionStatus}</div>
              <div>Loading: {loading ? "Yes" : "No"}</div>
              <div>Error: {error || "None"}</div>
              <div>Retry Count: {retryCount}</div>
              <div>Blocks: {blocks.length}</div>
              <div>Transactions: {transactions.length}</div>
              <div>Contracts: {contracts.length}</div>
              <div>Tokens: {tokens.length}</div>
              <div>Network Stats: {networkStats ? "Available" : "None"}</div>
              <div>Schema Initializing: {schemaInitializing ? "Yes" : "No"}</div>
              {debugInfo && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Connection Debug</summary>
                  <pre className="mt-1 text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
                </details>
              )}
            </CardContent>
          </Card>
        )}

        {/* Only show data when connected */}
        {connectionStatus === "connected" && (
          <>
            {/* Network Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                      <p className="text-xl lg:text-2xl font-bold">
                        {loading ? (
                          <Skeleton className="h-8 w-16" />
                        ) : (
                          formatNumber(networkStats?.total_transactions || transactions.length)
                        )}
                      </p>
                    </div>
                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Activity className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    {getConnectionIcon()}
                    <span className="ml-1 font-medium text-green-500">Live</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users (24h)</p>
                      <p className="text-xl lg:text-2xl font-bold">
                        {loading ? (
                          <Skeleton className="h-8 w-16" />
                        ) : (
                          formatNumber(networkStats?.active_users_24h || 1250)
                        )}
                      </p>
                    </div>
                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    {getConnectionIcon()}
                    <span className="ml-1 font-medium text-green-500">Live</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Value Locked</p>
                      <p className="text-xl lg:text-2xl font-bold">
                        {loading ? (
                          <Skeleton className="h-8 w-16" />
                        ) : (
                          formatCurrency(networkStats?.total_value_locked || 25600000)
                        )}
                      </p>
                    </div>
                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    {getConnectionIcon()}
                    <span className="ml-1 font-medium text-green-500">Live</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Block Time</p>
                      <p className="text-xl lg:text-2xl font-bold">
                        {loading ? <Skeleton className="h-8 w-16" /> : `${networkStats?.avg_block_time || 12}s`}
                      </p>
                    </div>
                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    {getConnectionIcon()}
                    <span className="ml-1 font-medium text-green-500">Live</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Data Tables */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>StarkNet Real-Time Data</CardTitle>
                  <CardDescription>Live blockchain information with real-time updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="transactions" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span className="hidden sm:inline">Transactions</span>
                        <Badge variant="secondary" className="ml-1">
                          {transactions.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="blocks" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span className="hidden sm:inline">Blocks</span>
                        <Badge variant="secondary" className="ml-1">
                          {blocks.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="contracts" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span className="hidden sm:inline">Contracts</span>
                        <Badge variant="secondary" className="ml-1">
                          {contracts.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="tokens" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="hidden sm:inline">Tokens</span>
                        <Badge variant="secondary" className="ml-1">
                          {tokens.length}
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
                                <TableHead className="font-semibold">Value</TableHead>
                                <TableHead className="font-semibold">Gas</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Time</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {loading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                  <TableRow key={i}>
                                    {Array.from({ length: 8 }).map((_, j) => (
                                      <TableCell key={j}>
                                        <Skeleton className="h-4 w-full" />
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              ) : transactions.length > 0 ? (
                                transactions.slice(0, 20).map((tx, index) => (
                                  <motion.tr
                                    key={tx.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.02 }}
                                    className="hover:bg-muted/30 transition-colors"
                                  >
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <code className="text-sm bg-muted px-2 py-1 rounded">
                                          {formatAddress(tx.transaction_hash)}
                                        </code>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => copyToClipboard(tx.transaction_hash)}
                                          className="h-6 w-6 p-0"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <code className="text-sm bg-muted px-2 py-1 rounded">
                                        {formatAddress(tx.from_address)}
                                      </code>
                                    </TableCell>
                                    <TableCell>
                                      {tx.to_address ? (
                                        <code className="text-sm bg-muted px-2 py-1 rounded">
                                          {formatAddress(tx.to_address)}
                                        </code>
                                      ) : (
                                        <span className="text-muted-foreground">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {formatStarkNetValue(tx.value_wei || "0")} ETH
                                    </TableCell>
                                    <TableCell className="font-mono">{formatNumber(tx.gas_used || 0)}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className={getStatusColor(tx.status || "SUCCESS")}>
                                        {tx.status || "SUCCESS"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={getTypeColor(tx.transaction_type || "INVOKE")}
                                      >
                                        {(tx.transaction_type || "INVOKE").replace("_", " ")}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                      {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : "Now"}
                                    </TableCell>
                                  </motion.tr>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={8} className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                      <AlertCircle className="h-8 w-8 mb-2" />
                                      <p>No transactions available</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
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
                                <TableHead className="font-semibold">Time</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {loading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                  <TableRow key={i}>
                                    {Array.from({ length: 6 }).map((_, j) => (
                                      <TableCell key={j}>
                                        <Skeleton className="h-4 w-full" />
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              ) : blocks.length > 0 ? (
                                blocks.map((block, index) => (
                                  <motion.tr
                                    key={block.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-muted/30 transition-colors"
                                  >
                                    <TableCell>
                                      <Badge variant="outline" className="font-mono">
                                        #{block.block_number || 0}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <code className="text-sm bg-muted px-2 py-1 rounded">
                                        {formatAddress(block.block_hash || "")}
                                      </code>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {formatNumber(block.transaction_count || 0)}
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="font-mono">{formatNumber(block.gas_used || 0)}</div>
                                        <Progress
                                          value={block.gas_limit ? (block.gas_used / block.gas_limit) * 100 : 0}
                                          className="h-1"
                                        />
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{formatNumber(block.gas_limit || 0)}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                      {block.timestamp ? new Date(block.timestamp).toLocaleTimeString() : "Now"}
                                    </TableCell>
                                  </motion.tr>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                      <AlertCircle className="h-8 w-8 mb-2" />
                                      <p>No blocks available</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
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
                                <TableHead className="font-semibold">24h Txns</TableHead>
                                <TableHead className="font-semibold">24h Volume</TableHead>
                                <TableHead className="font-semibold">TVL</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {loading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                  <TableRow key={i}>
                                    {Array.from({ length: 6 }).map((_, j) => (
                                      <TableCell key={j}>
                                        <Skeleton className="h-4 w-full" />
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              ) : contracts.length > 0 ? (
                                contracts.map((contract, index) => (
                                  <motion.tr
                                    key={contract.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-muted/30 transition-colors"
                                  >
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="font-medium">
                                          {contract.contract_name || "Unknown Contract"}
                                        </div>
                                        <code className="text-sm bg-muted px-2 py-1 rounded">
                                          {formatAddress(contract.contract_address || "")}
                                        </code>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="capitalize">
                                        {(contract.contract_type || "UNKNOWN").toLowerCase()}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {formatNumber(contract.transaction_count_24h || 0)}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {formatCurrency(Number(contract.volume_24h || 0))}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {formatCurrency(Number(contract.total_value_locked || 0))}
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={
                                          contract.is_verified
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                        }
                                      >
                                        {contract.is_verified ? (
                                          <>
                                            <Check className="h-3 w-3 mr-1" />
                                            Verified
                                          </>
                                        ) : (
                                          "Unverified"
                                        )}
                                      </Badge>
                                    </TableCell>
                                  </motion.tr>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                      <AlertCircle className="h-8 w-8 mb-2" />
                                      <p>No contracts available</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
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
                              {loading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                  <TableRow key={i}>
                                    {Array.from({ length: 6 }).map((_, j) => (
                                      <TableCell key={j}>
                                        <Skeleton className="h-4 w-full" />
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              ) : tokens.length > 0 ? (
                                tokens.map((token, index) => (
                                  <motion.tr
                                    key={token.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-muted/30 transition-colors"
                                  >
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="font-medium">{token.symbol || "UNKNOWN"}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {token.name || "Unknown Token"}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{formatCurrency(token.price_usd || 0)}</TableCell>
                                    <TableCell>
                                      <div
                                        className={`flex items-center gap-1 ${
                                          (token.price_change_24h || 0) >= 0 ? "text-green-600" : "text-red-600"
                                        }`}
                                      >
                                        {(token.price_change_24h || 0) >= 0 ? (
                                          <ArrowUpRight className="h-4 w-4" />
                                        ) : (
                                          <ArrowDownRight className="h-4 w-4" />
                                        )}
                                        <span className="font-mono">
                                          {Math.abs(token.price_change_24h || 0).toFixed(2)}%
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {formatCurrency(Number(token.volume_24h || 0))}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {formatCurrency(Number(token.market_cap || 0))}
                                    </TableCell>
                                    <TableCell className="font-mono">{formatNumber(token.holder_count || 0)}</TableCell>
                                  </motion.tr>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                      <AlertCircle className="h-8 w-8 mb-2" />
                                      <p>No tokens available</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
