"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  fetchStarkNetBlocks,
  fetchStarkNetTransactions,
  fetchStarkNetContracts,
  fetchStarkNetTokens,
  fetchNetworkStats,
  testSupabaseConnection,
  initializeSchema,
  getConnectionDebugInfo,
  getEssentialFunctionsSQL,
} from "@/lib/starknet/supabase-client"
import { supabase } from "@/lib/supabase/client"

type HookConnectionStatus = "connecting" | "connected" | "error" | "no-tables" | "no-functions"

export function useStarkNetDirect() {
  const [blocks, setBlocks] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [tokens, setTokens] = useState<any[]>([])
  const [networkStats, setNetworkStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<HookConnectionStatus>("connecting")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [schemaInitializing, setSchemaInitializing] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [setupStep, setSetupStep] = useState<"functions" | "tables" | "complete">("functions")

  // Refs for cleanup
  const subscriptionsRef = useRef<any[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log("🧹 Cleaning up subscriptions and intervals...")

    // Unsubscribe from all channels
    subscriptionsRef.current.forEach((subscription) => {
      try {
        subscription.unsubscribe()
      } catch (error) {
        console.warn("Error unsubscribing:", error)
      }
    })
    subscriptionsRef.current = []

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Test connection with comprehensive error handling
  const testConnection = useCallback(async (): Promise<boolean> => {
    if (!mountedRef.current) return false

    try {
      setConnectionStatus("connecting")
      setError(null)

      console.log("🔍 Testing Supabase connection...")
      const connectionResult = await testSupabaseConnection()

      if (!mountedRef.current) return false

      // Update debug info
      try {
        const debug = await getConnectionDebugInfo()
        setDebugInfo(debug)
      } catch (debugError) {
        console.warn("Failed to get debug info:", debugError)
      }

      // Update setup step
      if (connectionResult.setupStep) {
        setSetupStep(connectionResult.setupStep)
      }

      if (!connectionResult.connected) {
        console.error("❌ Connection failed:", connectionResult.error, connectionResult.details)
        setError(`Connection failed: ${connectionResult.details || connectionResult.error}`)
        setConnectionStatus("error")
        return false
      }

      // Check what's missing and set appropriate status
      if (!connectionResult.functionsExist) {
        console.warn("⚠️ Functions don't exist:", connectionResult.details)
        setError(`Database functions missing: ${connectionResult.details}`)
        setConnectionStatus("no-functions")
        return false
      }

      if (!connectionResult.tablesExist) {
        console.warn("⚠️ Tables don't exist:", connectionResult.details)
        setError(`Tables missing: ${connectionResult.details}`)
        setConnectionStatus("no-tables")
        return false
      }

      console.log("✅ Connection successful, all components available")
      setConnectionStatus("connected")
      setRetryCount(0) // Reset retry count on success
      return true
    } catch (err) {
      if (!mountedRef.current) return false

      console.error("❌ Connection test failed:", err)
      const errorMessage = err instanceof Error ? err.message : "Connection failed"
      setError(errorMessage)
      setConnectionStatus("error")
      setRetryCount((prev) => prev + 1)
      return false
    }
  }, [])

  // Initialize schema with proper error handling
  const createSchema = useCallback(async (): Promise<boolean> => {
    if (!mountedRef.current) return false

    try {
      setSchemaInitializing(true)
      setError(null)
      console.log("🚀 Starting schema initialization...")

      const result = await initializeSchema()

      if (!mountedRef.current) return false

      if (!result.success) {
        setError(`Failed to create schema: ${result.error} - ${result.details}`)
        return false
      }

      console.log("✅ Schema created successfully, testing connection...")

      // Test connection again after schema creation
      const connected = await testConnection()
      if (connected && mountedRef.current) {
        console.log("✅ Connection successful, fetching data...")
        await fetchAllData()
      }

      return connected
    } catch (err) {
      if (!mountedRef.current) return false

      console.error("❌ Schema initialization failed:", err)
      const errorMessage = err instanceof Error ? err.message : "Schema initialization failed"
      setError(errorMessage)
      return false
    } finally {
      if (mountedRef.current) {
        setSchemaInitializing(false)
      }
    }
  }, [])

  // Fetch all data with error handling
  const fetchAllData = useCallback(async () => {
    if (!mountedRef.current) return

    try {
      setLoading(true)
      console.log("📊 Fetching StarkNet data...")

      const [blocksData, transactionsData, contractsData, tokensData, statsData] = await Promise.allSettled([
        fetchStarkNetBlocks(10),
        fetchStarkNetTransactions(50),
        fetchStarkNetContracts(20),
        fetchStarkNetTokens(20),
        fetchNetworkStats(),
      ])

      if (!mountedRef.current) return

      // Process results - always set data even if empty
      const blocks = blocksData.status === "fulfilled" ? blocksData.value : []
      const transactions = transactionsData.status === "fulfilled" ? transactionsData.value : []
      const contracts = contractsData.status === "fulfilled" ? contractsData.value : []
      const tokens = tokensData.status === "fulfilled" ? tokensData.value : []
      const stats = statsData.status === "fulfilled" ? statsData.value : null

      // Log any errors but don't fail completely
      const errors = [blocksData, transactionsData, contractsData, tokensData, statsData]
        .filter((result) => result.status === "rejected")
        .map((result) => (result as PromiseRejectedResult).reason)

      if (errors.length > 0) {
        console.warn("⚠️ Some data fetching failed:", errors)
        // Only set error if ALL requests failed
        if (errors.length === 5) {
          setError("Failed to fetch any data")
        }
      }

      console.log("📊 Data fetched:", {
        blocks: blocks.length,
        transactions: transactions.length,
        contracts: contracts.length,
        tokens: tokens.length,
        stats: stats ? "loaded" : "null",
        errors: errors.length,
      })

      setBlocks(blocks)
      setTransactions(transactions)
      setContracts(contracts)
      setTokens(tokens)
      setNetworkStats(stats)
      setLastUpdate(new Date())

      // Only clear error if we got some data
      if (errors.length < 5) {
        setError(null)
      }
    } catch (err) {
      if (!mountedRef.current) return

      console.error("❌ Error fetching data:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data"
      setError(errorMessage)
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  // Set up real-time subscriptions
  const setupSubscriptions = useCallback(() => {
    if (connectionStatus !== "connected" || !mountedRef.current) return

    console.log("🔄 Setting up real-time subscriptions...")

    // Clean up existing subscriptions first
    cleanup()

    try {
      const subscriptions = [
        supabase
          .channel("starknet_blocks_changes")
          .on("postgres_changes", { event: "*", schema: "public", table: "starknet_blocks" }, (payload) => {
            console.log("🔄 Blocks updated:", payload)
            if (mountedRef.current) {
              fetchStarkNetBlocks(10)
                .then((data) => {
                  if (mountedRef.current) setBlocks(data)
                })
                .catch(console.warn)
            }
          })
          .subscribe(),

        supabase
          .channel("starknet_transactions_changes")
          .on("postgres_changes", { event: "*", schema: "public", table: "starknet_transactions" }, (payload) => {
            console.log("🔄 Transactions updated:", payload)
            if (mountedRef.current) {
              fetchStarkNetTransactions(50)
                .then((data) => {
                  if (mountedRef.current) setTransactions(data)
                })
                .catch(console.warn)
            }
          })
          .subscribe(),

        supabase
          .channel("starknet_network_stats_changes")
          .on("postgres_changes", { event: "*", schema: "public", table: "starknet_network_stats" }, (payload) => {
            console.log("🔄 Network stats updated:", payload)
            if (mountedRef.current) {
              fetchNetworkStats()
                .then((data) => {
                  if (mountedRef.current) setNetworkStats(data)
                })
                .catch(console.warn)
            }
          })
          .subscribe(),
      ]

      subscriptionsRef.current = subscriptions
      console.log("✅ Real-time subscriptions set up successfully")
    } catch (error) {
      console.error("❌ Failed to set up subscriptions:", error)
    }
  }, [connectionStatus, cleanup])

  // Auto-refresh with exponential backoff
  const setupAutoRefresh = useCallback(() => {
    if (connectionStatus !== "connected" || !mountedRef.current) return

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up new interval with exponential backoff based on retry count
    const baseInterval = 30000 // 30 seconds
    const interval = Math.min(baseInterval * Math.pow(2, retryCount), 300000) // Max 5 minutes

    console.log(`⏰ Setting up auto-refresh every ${interval / 1000} seconds`)

    intervalRef.current = setInterval(() => {
      if (mountedRef.current && connectionStatus === "connected") {
        console.log("🔄 Auto-refreshing data...")
        fetchAllData()
      }
    }, interval)
  }, [connectionStatus, retryCount, fetchAllData])

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      console.log("🚀 Initializing StarkNet Direct hook...")
      const connected = await testConnection()
      if (connected && mountedRef.current) {
        await fetchAllData()
      } else {
        // Even if not connected, stop loading
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    initialize()

    // Cleanup on unmount
    return () => {
      mountedRef.current = false
      cleanup()
    }
  }, [testConnection, fetchAllData, cleanup])

  // Set up subscriptions when connected
  useEffect(() => {
    setupSubscriptions()
    return cleanup
  }, [setupSubscriptions, cleanup])

  // Set up auto-refresh when connected
  useEffect(() => {
    setupAutoRefresh()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [setupAutoRefresh])

  // Retry function with exponential backoff
  const retry = useCallback(async () => {
    console.log(`🔄 Retrying connection (attempt ${retryCount + 1})...`)
    const connected = await testConnection()
    if (connected && mountedRef.current) {
      await fetchAllData()
    }
  }, [testConnection, fetchAllData, retryCount])

  // Manual refresh function
  const refresh = useCallback(async () => {
    console.log("🔄 Manual refresh triggered...")
    if (connectionStatus === "connected") {
      await fetchAllData()
    } else {
      await retry()
    }
  }, [connectionStatus, fetchAllData, retry])

  // Get SQL script for copying
  const getSQLScript = useCallback(() => {
    return getEssentialFunctionsSQL()
  }, [])

  return {
    // Data
    blocks,
    transactions,
    contracts,
    tokens,
    networkStats,

    // State
    loading,
    error,
    connectionStatus,
    lastUpdate,
    schemaInitializing,
    retryCount,
    debugInfo,
    setupStep,

    // Actions
    retry,
    refresh,
    createSchema,
    getSQLScript,
  }
}

// Export utility functions (keeping the same as before)
export function formatStarkNetValue(valueWei: string | number, decimals = 18): string {
  if (!valueWei || valueWei === "0" || valueWei === 0) return "0"

  try {
    const value = typeof valueWei === "string" ? BigInt(valueWei) : BigInt(valueWei.toString())
    const divisor = BigInt(10 ** decimals)
    const quotient = value / divisor
    const remainder = value % divisor

    if (remainder === 0n) {
      return quotient.toString()
    }

    const remainderStr = remainder.toString().padStart(decimals, "0")
    const trimmedRemainder = remainderStr.replace(/0+$/, "")

    if (trimmedRemainder === "") {
      return quotient.toString()
    }

    return `${quotient}.${trimmedRemainder.slice(0, 6)}`
  } catch (error) {
    console.error("Error formatting value:", error)
    return "0"
  }
}

export function formatAddress(address: string, length = 6): string {
  if (!address) return "-"
  if (address.length <= length * 2) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function formatNumber(num: number | string): string {
  const n = typeof num === "string" ? Number.parseFloat(num) : num
  if (!n && n !== 0) return "0"
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`
  return n.toString()
}

export function formatCurrency(amount: number | string): string {
  const n = typeof amount === "string" ? Number.parseFloat(amount) : amount
  if (!n && n !== 0) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function getStatusColor(status: string): string {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "FAILED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function getTypeColor(type: string): string {
  switch (type?.toUpperCase()) {
    case "TRANSFER":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "CONTRACT_CALL":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "SWAP":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "CONTRACT_DEPLOYMENT":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "BRIDGE":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}
