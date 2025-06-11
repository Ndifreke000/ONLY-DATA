import { graphqlClient } from "./client"

// Types for StarkNet data
export interface StarkNetBlock {
  id: string
  block_number: number
  block_hash: string
  parent_hash: string
  timestamp: string
  transaction_count: number
  gas_used: number
  gas_limit: number
  sequencer_address?: string
}

export interface StarkNetTransaction {
  id: string
  transaction_hash: string
  block_number: number
  from_address: string
  to_address?: string
  value_wei: string
  gas_used: number
  gas_price: number
  status: "SUCCESS" | "FAILED" | "PENDING"
  transaction_type: "TRANSFER" | "CONTRACT_CALL" | "SWAP" | "CONTRACT_DEPLOYMENT" | "BRIDGE"
  timestamp: string
}

export interface StarkNetContract {
  id: string
  contract_address: string
  contract_name?: string
  contract_type: "DEX" | "LENDING" | "BRIDGE" | "VAULT" | "NFT" | "GOVERNANCE" | "OTHER"
  is_verified: boolean
  total_value_locked: string
  transaction_count_24h: number
  volume_24h: string
}

export interface StarkNetToken {
  id: string
  contract_address: string
  symbol: string
  name: string
  decimals: number
  price_usd: number
  price_change_24h: number
  volume_24h: string
  market_cap: string
  holder_count: number
  total_supply: string
}

export interface NetworkStats {
  totalTransactions: number
  totalContracts: number
  totalValueLocked: number
  activeUsers24h: number
  gasUsed24h: number
  avgBlockTime: number
  currentBlock: number
}

// GraphQL Queries - Updated to match Supabase's pg_graphql schema
export const GET_RECENT_BLOCKS = `
  query GetRecentBlocks($limit: Int = 10) {
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

export const GET_RECENT_TRANSACTIONS = `
  query GetRecentTransactions($limit: Int = 20, $status: String, $type: String) {
    starknet_transactions(
      order_by: { timestamp: desc },
      limit: $limit,
      where: {
        ${`_and: [
          { status: { _eq: $status } },
          { transaction_type: { _eq: $type } }
        ]`}
      }
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

export const GET_TOP_CONTRACTS = `
  query GetTopContracts($limit: Int = 20, $type: String, $verified: Boolean) {
    starknet_contracts(
      order_by: { total_value_locked: desc },
      limit: $limit,
      where: {
        ${`_and: [
          { contract_type: { _eq: $type } },
          { is_verified: { _eq: $verified } }
        ]`}
      }
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

export const GET_TOP_TOKENS = `
  query GetTopTokens($limit: Int = 20) {
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

export const SEARCH_TRANSACTIONS = `
  query SearchTransactions($searchTerm: String!, $limit: Int = 20) {
    starknet_transactions(
      limit: $limit,
      where: {
        _or: [
          { transaction_hash: { _ilike: $searchTerm } },
          { from_address: { _ilike: $searchTerm } },
          { to_address: { _ilike: $searchTerm } }
        ]
      },
      order_by: { timestamp: desc }
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

// Query functions - Updated to handle the correct response format
export async function getRecentBlocks(limit = 10): Promise<StarkNetBlock[]> {
  try {
    const response = await graphqlClient.query(GET_RECENT_BLOCKS, { limit })
    return response.data?.starknet_blocks || []
  } catch (error) {
    console.error("Error fetching recent blocks:", error)
    return []
  }
}

export async function getRecentTransactions(
  limit = 20,
  filters?: { status?: string; type?: string },
): Promise<StarkNetTransaction[]> {
  try {
    // Only include filters if they're defined
    const variables: any = { limit }
    if (filters?.status) variables.status = filters.status
    if (filters?.type) variables.type = filters.type

    const response = await graphqlClient.query(GET_RECENT_TRANSACTIONS, variables)
    return response.data?.starknet_transactions || []
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    return []
  }
}

export async function getTopContracts(
  limit = 20,
  filters?: { type?: string; verified?: boolean },
): Promise<StarkNetContract[]> {
  try {
    // Only include filters if they're defined
    const variables: any = { limit }
    if (filters?.type) variables.type = filters.type
    if (filters?.verified !== undefined) variables.verified = filters.verified

    const response = await graphqlClient.query(GET_TOP_CONTRACTS, variables)
    return response.data?.starknet_contracts || []
  } catch (error) {
    console.error("Error fetching top contracts:", error)
    return []
  }
}

export async function getTopTokens(limit = 20): Promise<StarkNetToken[]> {
  try {
    const response = await graphqlClient.query(GET_TOP_TOKENS, { limit })
    return response.data?.starknet_tokens || []
  } catch (error) {
    console.error("Error fetching top tokens:", error)
    return []
  }
}

export async function getNetworkStats(): Promise<NetworkStats | null> {
  try {
    const response = await graphqlClient.query(GET_NETWORK_STATS)
    const stats = response.data?.starknet_network_stats?.reduce((acc: any, stat: any) => {
      const { metric_name, metric_value } = stat
      acc[metric_name] = Number(metric_value)
      return acc
    }, {})

    if (!stats) return null

    return {
      totalTransactions: stats?.total_transactions || 0,
      totalContracts: stats?.total_contracts || 0,
      totalValueLocked: stats?.total_value_locked || 0,
      activeUsers24h: stats?.active_users_24h || 0,
      gasUsed24h: stats?.gas_used_24h || 0,
      avgBlockTime: stats?.avg_block_time || 0,
      currentBlock: stats?.current_block || 0,
    }
  } catch (error) {
    console.error("Error fetching network stats:", error)
    return null
  }
}

export async function searchTransactions(searchTerm: string, limit = 20): Promise<StarkNetTransaction[]> {
  try {
    const response = await graphqlClient.query(SEARCH_TRANSACTIONS, {
      searchTerm: `%${searchTerm}%`,
      limit,
    })
    return response.data?.starknet_transactions || []
  } catch (error) {
    console.error("Error searching transactions:", error)
    return []
  }
}
