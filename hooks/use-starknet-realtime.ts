"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import { getBlocks, getTransactions, getContracts, getTokens, getNetworkStats } from "@/lib/starknet/queries"
import type {
  StarkNetBlock,
  StarkNetTransaction,
  StarkNetContract,
  StarkNetToken,
  NetworkStats,
} from "@/lib/starknet/types"

interface StarkNetData {
  blocks: StarkNetBlock[]
  transactions: StarkNetTransaction[]
  contracts: StarkNetContract[]
  tokens: StarkNetToken[]
  networkStats: NetworkStats | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export function useStarkNetRealtime() {
  const [data, setData] = useState<StarkNetData>({
    blocks: [],
    transactions: [],
    contracts: [],
    tokens: [],
    networkStats: null,
    loading: true,
    error: null,
    lastUpdated: null,
  })

  const fetchAllData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }))

      const [blocks, transactions, contracts, tokens, networkStats] = await Promise.all([
        getBlocks(10),
        getTransactions(50),
        getContracts(20),
        getTokens(20),
        getNetworkStats(),
      ])

      setData({
        blocks,
        transactions,
        contracts,
        tokens,
        networkStats,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error("Error fetching StarkNet data:", error)
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      }))
    }
  }, [])

  const refreshData = useCallback(() => {
    fetchAllData()
  }, [fetchAllData])

  // Initial data fetch
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Real-time subscriptions
  useEffect(() => {
    // Subscribe to new blocks
    const blocksSubscription = supabase
      .channel("starknet_blocks_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "starknet_blocks",
        },
        (payload) => {
          console.log("New block:", payload)
          // Refresh blocks data when new block is added
          getBlocks(10).then((blocks) => {
            setData((prev) => ({ ...prev, blocks, lastUpdated: new Date() }))
          })
        },
      )
      .subscribe()

    // Subscribe to new transactions
    const transactionsSubscription = supabase
      .channel("starknet_transactions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "starknet_transactions",
        },
        (payload) => {
          console.log("New transaction:", payload)
          // Refresh transactions data when new transaction is added
          getTransactions(50).then((transactions) => {
            setData((prev) => ({ ...prev, transactions, lastUpdated: new Date() }))
          })
        },
      )
      .subscribe()

    // Subscribe to contract updates
    const contractsSubscription = supabase
      .channel("starknet_contracts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "starknet_contracts",
        },
        (payload) => {
          console.log("Contract updated:", payload)
          // Refresh contracts data
          getContracts(20).then((contracts) => {
            setData((prev) => ({ ...prev, contracts, lastUpdated: new Date() }))
          })
        },
      )
      .subscribe()

    // Subscribe to network stats updates
    const statsSubscription = supabase
      .channel("starknet_network_stats_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "starknet_network_stats",
        },
        (payload) => {
          console.log("Network stats updated:", payload)
          // Refresh network stats
          getNetworkStats().then((networkStats) => {
            setData((prev) => ({ ...prev, networkStats, lastUpdated: new Date() }))
          })
        },
      )
      .subscribe()

    // Auto-refresh every 30 seconds as fallback
    const interval = setInterval(() => {
      fetchAllData()
    }, 30000)

    return () => {
      blocksSubscription.unsubscribe()
      transactionsSubscription.unsubscribe()
      contractsSubscription.unsubscribe()
      statsSubscription.unsubscribe()
      clearInterval(interval)
    }
  }, [fetchAllData])

  return {
    ...data,
    refreshData,
  }
}

// Utility functions
export function formatStarkNetValue(valueWei: string, decimals = 18): string {
  if (!valueWei || valueWei === "0") return "0"

  try {
    const value = BigInt(valueWei)
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

export function formatNumber(num: number): string {
  if (!num && num !== 0) return "0"
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toString()
}

export function formatCurrency(amount: number): string {
  if (!amount && amount !== 0) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getStatusColor(status: string): string {
  switch (status) {
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
  switch (type) {
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
