-- Essential functions for StarkNet Explorer
-- Run this first in Supabase SQL Editor

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = table_name
  );
END;
$$;

-- Function to get table count
CREATE OR REPLACE FUNCTION get_table_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename LIKE 'starknet_%'
  );
END;
$$;

-- Function to execute SQL (for schema creation)
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

-- Function to create the complete StarkNet schema
CREATE OR REPLACE FUNCTION create_starknet_schema()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result text;
BEGIN
  -- Drop existing tables if they exist (cascade to handle dependencies)
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
    block_number BIGINT REFERENCES starknet_blocks(block_number),
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

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_starknet_blocks_number ON starknet_blocks(block_number DESC);
  CREATE INDEX IF NOT EXISTS idx_starknet_transactions_hash ON starknet_transactions(transaction_hash);
  CREATE INDEX IF NOT EXISTS idx_starknet_transactions_block ON starknet_transactions(block_number DESC);
  CREATE INDEX IF NOT EXISTS idx_starknet_transactions_timestamp ON starknet_transactions(timestamp DESC);
  CREATE INDEX IF NOT EXISTS idx_starknet_contracts_address ON starknet_contracts(contract_address);
  CREATE INDEX IF NOT EXISTS idx_starknet_tokens_symbol ON starknet_tokens(token_symbol);

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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_table_exists(text) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION get_table_count() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION create_starknet_schema() TO authenticated, anon, service_role;

-- Test the functions
SELECT check_table_exists('starknet_blocks') as blocks_exist;
SELECT get_table_count() as starknet_table_count;
