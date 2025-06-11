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
