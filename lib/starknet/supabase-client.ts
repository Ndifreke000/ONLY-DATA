import { supabase } from "@/lib/supabase/client"

// Connection status type
export type ConnectionStatus = {
  connected: boolean
  tablesExist: boolean
  functionsExist: boolean
  error?: string
  details?: string
  tableCount?: number
  setupStep?: "functions" | "tables" | "complete"
}

// Retry configuration
const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
}

// Utility function for exponential backoff
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Utility function for retry logic
async function withRetry<T>(
  operation: () => Promise<T>,
  context: string,
  maxAttempts = RETRY_CONFIG.maxAttempts,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`${context} - Attempt ${attempt}/${maxAttempts}`)
      const result = await operation()
      if (attempt > 1) {
        console.log(`${context} - Success on attempt ${attempt}`)
      }
      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`${context} - Attempt ${attempt} failed:`, lastError.message)

      if (attempt < maxAttempts) {
        const delayMs = Math.min(RETRY_CONFIG.baseDelay * Math.pow(2, attempt - 1), RETRY_CONFIG.maxDelay)
        console.log(`${context} - Retrying in ${delayMs}ms...`)
        await delay(delayMs)
      }
    }
  }

  throw lastError || new Error(`${context} failed after ${maxAttempts} attempts`)
}

// Test basic Supabase connection without any dependencies
export async function testSupabaseConnection(): Promise<ConnectionStatus> {
  try {
    console.log("🔍 Testing Supabase connection (fail-safe mode)...")

    // Step 1: Test absolute basic connectivity
    let basicConnectivity = false
    try {
      // Try the simplest possible query that should always work
      const { error } = await supabase.from("_supabase_migrations").select("id").limit(1)

      if (error) {
        // Even if this table doesn't exist, we're connected if we get a proper error response
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          console.log("✅ Basic connectivity confirmed (via error response)")
          basicConnectivity = true
        } else {
          console.error("❌ Basic connectivity failed:", error.message)
          return {
            connected: false,
            tablesExist: false,
            functionsExist: false,
            error: "Cannot connect to Supabase",
            details: error.message,
            setupStep: "functions",
          }
        }
      } else {
        console.log("✅ Basic connectivity confirmed (direct)")
        basicConnectivity = true
      }
    } catch (error) {
      console.error("❌ Basic connectivity test failed:", error)
      return {
        connected: false,
        tablesExist: false,
        functionsExist: false,
        error: "Connection failed",
        details: error instanceof Error ? error.message : String(error),
        setupStep: "functions",
      }
    }

    if (!basicConnectivity) {
      return {
        connected: false,
        tablesExist: false,
        functionsExist: false,
        error: "Cannot establish basic connection",
        details: "Failed to connect to Supabase database",
        setupStep: "functions",
      }
    }

    // Step 2: Check if our custom functions exist (safely)
    let functionsExist = false
    try {
      console.log("🔍 Checking if custom functions exist...")
      const { data, error } = await supabase.rpc("get_table_count")

      if (!error && typeof data === "number") {
        functionsExist = true
        console.log("✅ Custom functions are available")
      }
    } catch (error) {
      console.log("⚠️ Custom functions not available (expected on first run)")
      functionsExist = false
    }

    if (!functionsExist) {
      return {
        connected: true,
        tablesExist: false,
        functionsExist: false,
        error: "Database functions not found",
        details: "Please run the essential-functions-simple.sql script in Supabase SQL Editor",
        setupStep: "functions",
      }
    }

    // Step 3: Check if StarkNet tables exist (using our custom function)
    let tablesExist = false
    let tableCount = 0

    try {
      console.log("🔍 Checking StarkNet tables...")
      const { data, error } = await supabase.rpc("get_table_count")

      if (error) {
        throw new Error(`Table count check failed: ${error.message}`)
      }

      tableCount = data || 0
      tablesExist = tableCount >= 5

      console.log(`📊 Found ${tableCount}/5 StarkNet tables`)

      if (!tablesExist) {
        return {
          connected: true,
          tablesExist: false,
          functionsExist: true,
          tableCount,
          error: "StarkNet tables missing",
          details: `Found ${tableCount}/5 required tables. Ready for schema initialization.`,
          setupStep: "tables",
        }
      }
    } catch (error) {
      console.warn("Table check failed:", error)
      return {
        connected: true,
        tablesExist: false,
        functionsExist: true,
        error: "Table check failed",
        details: error instanceof Error ? error.message : String(error),
        setupStep: "tables",
      }
    }

    // Step 4: Test data access if tables exist
    if (tablesExist) {
      try {
        console.log("🔍 Testing data access...")
        await withRetry(async () => {
          const { data, error } = await supabase.from("starknet_blocks").select("id").limit(1)

          if (error) {
            throw new Error(`Data access test failed: ${error.message}`)
          }

          console.log("✅ Data access test successful")
          return data
        }, "Data access test")
      } catch (error) {
        console.warn("Data access test failed:", error)
        return {
          connected: true,
          tablesExist: false,
          functionsExist: true,
          error: "Data access failed",
          details: error instanceof Error ? error.message : String(error),
          setupStep: "tables",
        }
      }
    }

    console.log("🎉 All connection tests passed!")
    return {
      connected: true,
      tablesExist,
      functionsExist: true,
      tableCount,
      details: "All systems operational",
      setupStep: "complete",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("❌ Connection test failed:", errorMessage)

    return {
      connected: false,
      tablesExist: false,
      functionsExist: false,
      error: "Connection test failed",
      details: errorMessage,
      setupStep: "functions",
    }
  }
}

// Initialize schema - only works if functions exist
export async function initializeSchema(): Promise<{ success: boolean; error?: string; details?: string }> {
  try {
    console.log("🚀 Initializing StarkNet schema...")

    // First check if functions exist
    const connectionStatus = await testSupabaseConnection()

    if (!connectionStatus.functionsExist) {
      return {
        success: false,
        error: "Required functions not found",
        details: "Please run the essential-functions-simple.sql script in Supabase SQL Editor first",
      }
    }

    const result = await withRetry(async () => {
      const { data, error } = await supabase.rpc("create_starknet_schema")

      if (error) {
        throw new Error(`Schema creation failed: ${error.message}`)
      }

      if (data && data.startsWith("ERROR:")) {
        throw new Error(data)
      }

      console.log("✅ Schema creation result:", data)
      return data
    }, "Schema initialization")

    // Verify the schema was created successfully
    const verificationResult = await testSupabaseConnection()

    if (!verificationResult.connected || !verificationResult.tablesExist) {
      throw new Error(`Schema verification failed: ${verificationResult.error} - ${verificationResult.details}`)
    }

    console.log("🎉 Schema initialized and verified successfully!")
    return {
      success: true,
      details: `Schema created with ${verificationResult.tableCount} tables`,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("❌ Schema initialization failed:", errorMessage)

    return {
      success: false,
      error: "Schema initialization failed",
      details: errorMessage,
    }
  }
}

// Safe fetch functions that handle missing tables gracefully
export async function fetchStarkNetBlocks(limit = 10) {
  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from("starknet_blocks")
        .select("*")
        .order("block_number", { ascending: false })
        .limit(limit)

      if (error) {
        // If table doesn't exist, return empty array instead of throwing
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          console.warn("starknet_blocks table does not exist")
          return []
        }
        throw error
      }
      return data || []
    }, "Fetch blocks")
  } catch (error) {
    console.error("Error fetching blocks:", error)
    return []
  }
}

export async function fetchStarkNetTransactions(limit = 50) {
  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from("starknet_transactions")
        .select("*")
        .order("id", { ascending: false })
        .limit(limit)

      if (error) {
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          console.warn("starknet_transactions table does not exist")
          return []
        }
        throw error
      }
      return data || []
    }, "Fetch transactions")
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

export async function fetchStarkNetContracts(limit = 20) {
  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from("starknet_contracts")
        .select("*")
        .order("total_value_locked", { ascending: false })
        .limit(limit)

      if (error) {
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          console.warn("starknet_contracts table does not exist")
          return []
        }
        throw error
      }
      return data || []
    }, "Fetch contracts")
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return []
  }
}

export async function fetchStarkNetTokens(limit = 20) {
  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from("starknet_tokens")
        .select("*")
        .order("market_cap", { ascending: false })
        .limit(limit)

      if (error) {
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          console.warn("starknet_tokens table does not exist")
          return []
        }
        throw error
      }
      return data || []
    }, "Fetch tokens")
  } catch (error) {
    console.error("Error fetching tokens:", error)
    return []
  }
}

export async function fetchNetworkStats() {
  try {
    return await withRetry(async () => {
      const { data, error } = await supabase.from("starknet_network_stats").select("*").single()

      if (error) {
        // If no data exists or table doesn't exist, return default stats
        if (
          error.code === "PGRST116" ||
          (error.message.includes("relation") && error.message.includes("does not exist"))
        ) {
          console.log("No network stats found, returning defaults")
          return {
            total_transactions: 0,
            total_contracts: 0,
            total_value_locked: 0,
            active_users_24h: 0,
            gas_used_24h: 0,
            avg_block_time: 12.0,
            current_block: 0,
          }
        }
        throw error
      }

      return data
    }, "Fetch network stats")
  } catch (error) {
    console.error("Error fetching network stats:", error)
    return {
      total_transactions: 0,
      total_contracts: 0,
      total_value_locked: 0,
      active_users_24h: 0,
      gas_used_24h: 0,
      avg_block_time: 12.0,
      current_block: 0,
    }
  }
}

// Health check that never fails
export async function healthCheck(): Promise<{
  status: "healthy" | "degraded" | "unhealthy" | "setup-required"
  details: Record<string, any>
}> {
  const startTime = Date.now()
  const details: Record<string, any> = {}

  try {
    // Test connection
    const connectionResult = await testSupabaseConnection()
    details.connection = connectionResult
    details.responseTime = Date.now() - startTime

    if (!connectionResult.connected) {
      return { status: "unhealthy", details }
    }

    if (!connectionResult.functionsExist) {
      return { status: "setup-required", details }
    }

    if (!connectionResult.tablesExist) {
      return { status: "degraded", details }
    }

    // Test data fetching only if tables exist
    if (connectionResult.tablesExist) {
      const [blocks, transactions] = await Promise.allSettled([fetchStarkNetBlocks(1), fetchStarkNetTransactions(1)])

      details.dataAccess = {
        blocks: blocks.status === "fulfilled" ? "ok" : (blocks as PromiseRejectedResult).reason.message,
        transactions:
          transactions.status === "fulfilled" ? "ok" : (transactions as PromiseRejectedResult).reason.message,
      }

      const hasDataErrors = blocks.status === "rejected" || transactions.status === "rejected"
      return {
        status: hasDataErrors ? "degraded" : "healthy",
        details,
      }
    }

    return { status: "healthy", details }
  } catch (error) {
    details.error = error instanceof Error ? error.message : String(error)
    details.responseTime = Date.now() - startTime

    return { status: "unhealthy", details }
  }
}

// Export connection status for debugging
export async function getConnectionDebugInfo() {
  try {
    const health = await healthCheck()
    const connection = await testSupabaseConnection()

    return {
      timestamp: new Date().toISOString(),
      health,
      connection,
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "configured" : "missing",
      },
    }
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "configured" : "missing",
      },
    }
  }
}

// Get the SQL script content for easy copying
export function getEssentialFunctionsSQL(): string {
  return `-- Essential Functions for StarkNet Explorer
-- Copy and paste this entire script into Supabase SQL Editor and click "Run"

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = table_name
  );
$$;

-- Function to get table count
CREATE OR REPLACE FUNCTION get_table_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*)::integer
  FROM pg_tables 
  WHERE schemaname = 'public'
  AND tablename LIKE 'starknet_%';
$$;

-- Function to execute SQL (simplified version)
CREATE OR REPLACE FUNCTION exec_sql(sql_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_text;
  RETURN 'SUCCESS';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'ERROR: ' || SQLERRM;
END;
$$;

-- Function to create the complete StarkNet schema (all in one)
CREATE OR REPLACE FUNCTION create_starknet_schema()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Drop existing tables if they exist
  DROP TABLE IF EXISTS starknet_network_stats CASCADE;
  DROP TABLE IF EXISTS starknet_tokens CASCADE;
  DROP TABLE IF EXISTS starknet_contracts CASCADE;
  DROP TABLE IF EXISTS starknet_transactions CASCADE;
  DROP TABLE IF EXISTS starknet_blocks CASCADE;

  -- Create blocks table
  CREATE TABLE starknet_blocks (
    id SERIAL PRIMARY KEY,
    block_number BIGINT NOT NULL UNIQUE,
    block_hash TEXT NOT NULL UNIQUE,
    parent_hash TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transaction_count INTEGER DEFAULT 0,
    gas_used BIGINT DEFAULT 0,
    gas_limit BIGINT DEFAULT 0,
    sequencer_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create transactions table
  CREATE TABLE starknet_transactions (
    id SERIAL PRIMARY KEY,
    transaction_hash TEXT NOT NULL UNIQUE,
    block_number BIGINT,
    transaction_type TEXT NOT NULL DEFAULT 'INVOKE',
    from_address TEXT,
    to_address TEXT,
    value_wei TEXT DEFAULT '0',
    gas_used BIGINT DEFAULT 0,
    gas_price BIGINT DEFAULT 0,
    actual_fee BIGINT DEFAULT 0,
    status TEXT DEFAULT 'SUCCESS',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create contracts table
  CREATE TABLE starknet_contracts (
    id SERIAL PRIMARY KEY,
    contract_address TEXT NOT NULL UNIQUE,
    contract_name TEXT,
    contract_type TEXT DEFAULT 'UNKNOWN',
    class_hash TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    total_value_locked DECIMAL(20,2) DEFAULT 0,
    volume_24h DECIMAL(20,2) DEFAULT 0,
    transaction_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create tokens table
  CREATE TABLE starknet_tokens (
    id SERIAL PRIMARY KEY,
    contract_address TEXT NOT NULL UNIQUE,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    decimals INTEGER DEFAULT 18,
    total_supply DECIMAL(30,0) DEFAULT 0,
    price_usd DECIMAL(20,8) DEFAULT 0,
    price_change_24h DECIMAL(10,4) DEFAULT 0,
    market_cap DECIMAL(20,2) DEFAULT 0,
    volume_24h DECIMAL(20,2) DEFAULT 0,
    holders_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create network stats table
  CREATE TABLE starknet_network_stats (
    id SERIAL PRIMARY KEY,
    total_transactions BIGINT DEFAULT 0,
    total_contracts INTEGER DEFAULT 0,
    total_value_locked DECIMAL(20,2) DEFAULT 0,
    active_users_24h INTEGER DEFAULT 0,
    gas_used_24h BIGINT DEFAULT 0,
    avg_block_time DECIMAL(10,2) DEFAULT 12.0,
    current_block BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX idx_starknet_blocks_number ON starknet_blocks(block_number DESC);
  CREATE INDEX idx_starknet_transactions_hash ON starknet_transactions(transaction_hash);
  CREATE INDEX idx_starknet_transactions_block ON starknet_transactions(block_number DESC);
  CREATE INDEX idx_starknet_transactions_timestamp ON starknet_transactions(timestamp DESC);
  CREATE INDEX idx_starknet_contracts_address ON starknet_contracts(contract_address);
  CREATE INDEX idx_starknet_tokens_symbol ON starknet_tokens(token_symbol);

  -- Insert sample data
  INSERT INTO starknet_blocks (block_number, block_hash, parent_hash, transaction_count, gas_used, gas_limit, sequencer_address) VALUES
  (100001, '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890', '0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba', 25, 1500000, 2000000, '0x1234567890abcdef1234567890abcdef12345678'),
  (100002, '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890', 18, 1200000, 2000000, '0x1234567890abcdef1234567890abcdef12345678'),
  (100003, '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd', '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab', 32, 1800000, 2000000, '0x1234567890abcdef1234567890abcdef12345678'),
  (100004, '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd', 28, 1650000, 2000000, '0x1234567890abcdef1234567890abcdef12345678'),
  (100005, '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12', '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 35, 1950000, 2000000, '0x1234567890abcdef1234567890abcdef12345678');

  INSERT INTO starknet_transactions (transaction_hash, block_number, transaction_type, from_address, to_address, value_wei, gas_used, gas_price, actual_fee, status) VALUES
  ('0xabc123def456789012345678901234567890123456789012345678901234567890', 100001, 'INVOKE', '0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', '1000000000000000000', 85000, 10000000000, 850000000000, 'SUCCESS'),
  ('0xdef456789012345678901234567890123456789012345678901234567890abc123', 100001, 'DEPLOY', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', '0', 175000, 10000000000, 1750000000000, 'SUCCESS'),
  ('0x789012345678901234567890123456789012345678901234567890abc123def456', 100002, 'TRANSFER', '0x5555555555555555555555555555555555555555', '0x6666666666666666666666666666666666666666', '500000000000000000', 42500, 10000000000, 425000000000, 'SUCCESS'),
  ('0x012345678901234567890123456789012345678901234567890abc123def45678', 100002, 'SWAP', '0x7777777777777777777777777777777777777777', '0x8888888888888888888888888888888888888888', '2000000000000000000', 95000, 12000000000, 1140000000000, 'SUCCESS'),
  ('0x345678901234567890123456789012345678901234567890abc123def456789012', 100003, 'BRIDGE', '0x9999999999999999999999999999999999999999', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '750000000000000000', 125000, 11000000000, 1375000000000, 'SUCCESS');

  INSERT INTO starknet_contracts (contract_address, contract_name, contract_type, is_verified, total_value_locked, volume_24h, transaction_count) VALUES
  ('0x2222222222222222222222222222222222222222', 'StarkSwap DEX', 'DEX', true, 15000000.50, 2500000.00, 1250),
  ('0x4444444444444444444444444444444444444444', 'StarkLend Protocol', 'LENDING', true, 8500000.25, 1200000.00, 820),
  ('0x6666666666666666666666666666666666666666', 'StarkNFT Marketplace', 'NFT', false, 2100000.75, 450000.00, 340),
  ('0x8888888888888888888888888888888888888888', 'StarkBridge', 'BRIDGE', true, 5200000.00, 800000.00, 650),
  ('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'StarkYield Farm', 'DEFI', true, 3800000.30, 600000.00, 480);

  INSERT INTO starknet_tokens (contract_address, token_name, token_symbol, total_supply, price_usd, price_change_24h, market_cap, volume_24h, holders_count) VALUES
  ('0x7777777777777777777777777777777777777777', 'Starknet Token', 'STRK', 10000000000, 0.85, 5.2, 8500000000, 125000000, 45000),
  ('0x8888888888888888888888888888888888888888', 'Ethereum', 'ETH', 120000000, 2450.50, -2.1, 294060000000, 15000000000, 120000),
  ('0x9999999999999999999999999999999999999999', 'USD Coin', 'USDC', 35000000000, 1.00, 0.1, 35000000000, 8500000000, 85000),
  ('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'Wrapped Bitcoin', 'WBTC', 21000000, 43250.75, 3.8, 908265750000, 2800000000, 65000),
  ('0xcccccccccccccccccccccccccccccccccccccccc', 'StarkDAO Token', 'SDAO', 1000000000, 2.45, -1.5, 2450000000, 45000000, 28000);

  INSERT INTO starknet_network_stats (total_transactions, total_contracts, total_value_locked, active_users_24h, gas_used_24h, avg_block_time, current_block) VALUES
  (2500000, 15000, 25600000.50, 12500, 45000000000, 12.5, 100005);

  RETURN 'Schema created successfully with sample data';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'ERROR: ' || SQLERRM;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION check_table_exists(text) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION get_table_count() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION create_starknet_schema() TO authenticated, anon, service_role;

-- Test the functions to make sure they work
SELECT 'Functions created successfully' as status;
SELECT get_table_count() as current_starknet_table_count;`
}
