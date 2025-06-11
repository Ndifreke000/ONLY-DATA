"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getRecentBlocks,
  getRecentTransactions,
  getTopContracts,
  getTopTokens,
  getNetworkStats,
  searchTransactions,
  type StarkNetBlock,
  type StarkNetTransaction,
  type StarkNetContract,
  type StarkNetToken,
  type NetworkStats,
} from "@/lib/graphql/starknet-queries"

interface UseStarkNetDataOptions {
  autoRefresh?: boolean
  refreshInterval?: number // in seconds
}

interface StarkNetDataState {
  blocks: StarkNetBlock[]
  transactions: StarkNetTransaction[]
  contracts: StarkNetContract[]
  tokens: StarkNetToken[]
  networkStats: NetworkStats | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

interface StarkNetDataFilters {
  transactions?: {
    status?: string
    type?: string
    limit?: number
  }
  contracts?: {
    type?: string
    verified?: boolean
    limit?: number
  }
  tokens?: {
    limit?: number
  }
  blocks?: {
    limit?: number
  }
}

export function useStarkNetData(options: UseStarkNetDataOptions = {}) {
  const { autoRefresh = true, refreshInterval = 30 } = options

  const [state, setState] = useState<StarkNetDataState>({
    blocks: [],
    transactions: [],
    contracts: [],
    tokens: [],
    networkStats: null,
    loading: true,
    error: null,
    lastUpdated: null,
  })

  const [filters, setFilters] = useState<StarkNetDataFilters>({})

  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setState((prev) => ({ ...prev, loading: true, error: null }))
        }

        // Fetch all data in parallel
        const [blocks, transactions, contracts, tokens, networkStats] = await Promise.all([
          getRecentBlocks(filters.blocks?.limit || 10),
          getRecentTransactions(filters.transactions?.limit || 20, {
            status: filters.transactions?.status,
            type: filters.transactions?.type,
          }),
          getTopContracts(filters.contracts?.limit || 20, {
            type: filters.contracts?.type,
            verified: filters.contracts?.verified,
          }),
          getTopTokens(filters.tokens?.limit || 20),
          getNetworkStats(),
        ])

        setState((prev) => ({
          ...prev,
          blocks,
          transactions,
          contracts,
          tokens,
          networkStats,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        }))
      } catch (error) {
        console.error("Error fetching StarkNet data:", error)
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch data",
        }))
      }
    },
    [filters],
  )

  const searchData = useCallback(async (searchTerm: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const searchResults = await searchTransactions(searchTerm, 50)

      setState((prev) => ({
        ...prev,
        transactions: searchResults,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }))

      return searchResults
    } catch (error) {
      console.error("Error searching StarkNet data:", error)
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Search failed",
      }))
      return []
    }
  }, [])

  const updateFilters = useCallback((newFilters: Partial<StarkNetDataFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }, [])

  const refreshData = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchData(false) // Silent refresh
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchData])

  return {
    ...state,
    filters,
    updateFilters,
    refreshData,
    searchData,
    isRefreshing: state.loading,
  }
}

// Utility functions for data formatting
export function formatStarkNetValue(valueWei: string, decimals = 18): string {
  if (!valueWei) return "0"

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

    return `${quotient}.${trimmedRemainder}`
  } catch (error) {
    console.error("Error formatting StarkNet value:", error)
    return "0"
  }
}

export function formatStarkNetAddress(address: string, length = 8): string {
  if (!address) return "-"
  if (address.length <= length * 2) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function getTransactionTypeColor(type: string): string {
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
