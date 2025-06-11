import { graphqlClient } from "@/lib/graphql/client"
import type { StarkNetBlock, StarkNetTransaction, StarkNetContract, StarkNetToken, NetworkStats } from "./types"

// Real-time StarkNet data queries
export const GET_BLOCKS = `
  query GetBlocks($limit: Int = 10) {
    starknet_blocks(
      order_by: { block_number: desc },
      limit: $limit
    ) {
      id
      block_number
      block_hash
      parent_hash
      timestamp
      transaction_count
      gas_used
      gas_limit
      sequencer_address
    }
  }
`

export const GET_TRANSACTIONS = `
  query GetTransactions($limit: Int = 20) {
    starknet_transactions(
      order_by: { timestamp: desc },
      limit: $limit
    ) {
      id
      transaction_hash
      block_number
      from_address
      to_address
      value_wei
      gas_used
      gas_price
      status
      transaction_type
      timestamp
    }
  }
`

export const GET_CONTRACTS = `
  query GetContracts($limit: Int = 20) {
    starknet_contracts(
      order_by: { total_value_locked: desc },
      limit: $limit
    ) {
      id
      contract_address
      contract_name
      contract_type
      is_verified
      total_value_locked
      transaction_count_24h
      volume_24h
    }
  }
`

export const GET_TOKENS = `
  query GetTokens($limit: Int = 20) {
    starknet_tokens(
      order_by: { market_cap: desc },
      limit: $limit
    ) {
      id
      contract_address
      symbol
      name
      decimals
      price_usd
      price_change_24h
      volume_24h
      market_cap
      holder_count
      total_supply
    }
  }
`

export const GET_NETWORK_STATS = `
  query GetNetworkStats {
    starknet_network_stats {
      id
      metric_name
      metric_value
      metric_type
      updated_at
    }
  }
`

// Query functions
export async function getBlocks(limit = 10): Promise<StarkNetBlock[]> {
  try {
    const data = await graphqlClient.query<{ starknet_blocks: StarkNetBlock[] }>(GET_BLOCKS, { limit })
    return data.starknet_blocks || []
  } catch (error) {
    console.error("Error fetching blocks:", error)
    return []
  }
}

export async function getTransactions(limit = 20): Promise<StarkNetTransaction[]> {
  try {
    const data = await graphqlClient.query<{ starknet_transactions: StarkNetTransaction[] }>(GET_TRANSACTIONS, {
      limit,
    })
    return data.starknet_transactions || []
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

export async function getContracts(limit = 20): Promise<StarkNetContract[]> {
  try {
    const data = await graphqlClient.query<{ starknet_contracts: StarkNetContract[] }>(GET_CONTRACTS, { limit })
    return data.starknet_contracts || []
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return []
  }
}

export async function getTokens(limit = 20): Promise<StarkNetToken[]> {
  try {
    const data = await graphqlClient.query<{ starknet_tokens: StarkNetToken[] }>(GET_TOKENS, { limit })
    return data.starknet_tokens || []
  } catch (error) {
    console.error("Error fetching tokens:", error)
    return []
  }
}

export async function getNetworkStats(): Promise<NetworkStats | null> {
  try {
    const data = await graphqlClient.query<{
      starknet_network_stats: Array<{ metric_name: string; metric_value: string }>
    }>(GET_NETWORK_STATS)

    if (!data.starknet_network_stats) return null

    const stats = data.starknet_network_stats.reduce((acc: any, stat) => {
      acc[stat.metric_name] = Number(stat.metric_value)
      return acc
    }, {})

    return {
      totalTransactions: stats.total_transactions || 0,
      totalContracts: stats.total_contracts || 0,
      totalValueLocked: stats.total_value_locked || 0,
      activeUsers24h: stats.active_users_24h || 0,
      gasUsed24h: stats.gas_used_24h || 0,
      avgBlockTime: stats.avg_block_time || 0,
      currentBlock: stats.current_block || 0,
    }
  } catch (error) {
    console.error("Error fetching network stats:", error)
    return null
  }
}
