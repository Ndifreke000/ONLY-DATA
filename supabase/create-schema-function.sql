-- Create a function to initialize the StarkNet schema
CREATE OR REPLACE FUNCTION create_starknet_schema()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result text;
BEGIN
  -- Drop existing tables if they exist
  DROP TABLE IF EXISTS starknet_network_stats;
  DROP TABLE IF EXISTS starknet_tokens;
  DROP TABLE IF EXISTS starknet_contracts;
  DROP TABLE IF EXISTS starknet_transactions;
  DROP TABLE IF EXISTS starknet_blocks;

  -- Create blocks table
  CREATE TABLE starknet_blocks (
      id SERIAL PRIMARY KEY,
      block_number BIGINT NOT NULL UNIQUE,
      block_hash TEXT NOT NULL,
      parent_hash TEXT NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      transaction_count INTEGER DEFAULT 0,
      gas_used BIGINT DEFAULT 0,
      sequencer_address TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create transactions table
  CREATE TABLE starknet_transactions (
      id SERIAL PRIMARY KEY,
      transaction_hash TEXT NOT NULL UNIQUE,
      block_number BIGINT,
      transaction_type TEXT NOT NULL,
      sender_address TEXT,
      contract_address TEXT,
      entry_point TEXT,
      calldata JSONB,
      max_fee BIGINT DEFAULT 0,
      actual_fee BIGINT DEFAULT 0,
      status TEXT DEFAULT 'ACCEPTED_ON_L2',
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
      implementation_hash TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      total_value_locked DECIMAL(20,2) DEFAULT 0,
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
      market_cap DECIMAL(20,2) DEFAULT 0,
      volume_24h DECIMAL(20,2) DEFAULT 0,
      holders_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create network stats table
  CREATE TABLE starknet_network_stats (
      id SERIAL PRIMARY KEY,
      metric_name TEXT NOT NULL UNIQUE,
      metric_value DECIMAL(20,2) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Insert sample blocks
  INSERT INTO starknet_blocks (block_number, block_hash, parent_hash, transaction_count, gas_used, sequencer_address) VALUES
  (100001, '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890', '0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba', 25, 1500000, '0x1234567890abcdef1234567890abcdef12345678'),
  (100002, '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890', 18, 1200000, '0x1234567890abcdef1234567890abcdef12345678'),
  (100003, '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd', '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab', 32, 1800000, '0x1234567890abcdef1234567890abcdef12345678');

  -- Insert sample transactions
  INSERT INTO starknet_transactions (transaction_hash, block_number, transaction_type, sender_address, contract_address, max_fee, actual_fee, status) VALUES
  ('0xabc123def456789012345678901234567890123456789012345678901234567890', 100001, 'INVOKE', '0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', 1000000000000000, 850000000000000, 'ACCEPTED_ON_L2'),
  ('0xdef456789012345678901234567890123456789012345678901234567890abc123', 100001, 'DEPLOY', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', 2000000000000000, 1750000000000000, 'ACCEPTED_ON_L2'),
  ('0x789012345678901234567890123456789012345678901234567890abc123def456', 100002, 'INVOKE', '0x5555555555555555555555555555555555555555', '0x6666666666666666666666666666666666666666', 500000000000000, 425000000000000, 'ACCEPTED_ON_L2');

  -- Insert sample contracts
  INSERT INTO starknet_contracts (contract_address, contract_name, contract_type, is_verified, total_value_locked, transaction_count) VALUES
  ('0x2222222222222222222222222222222222222222', 'StarkSwap DEX', 'DEX', TRUE, 15000000.50, 12500),
  ('0x4444444444444444444444444444444444444444', 'StarkLend Protocol', 'LENDING', TRUE, 8500000.25, 8200),
  ('0x6666666666666666666666666666666666666666', 'StarkNFT Marketplace', 'NFT', FALSE, 2100000.75, 3400);

  -- Insert sample tokens
  INSERT INTO starknet_tokens (contract_address, token_name, token_symbol, total_supply, price_usd, market_cap, volume_24h, holders_count) VALUES
  ('0x7777777777777777777777777777777777777777', 'Starknet Token', 'STRK', 10000000000000000000000000000, 0.85, 8500000000, 125000000, 45000),
  ('0x8888888888888888888888888888888888888888', 'Ethereum', 'ETH', 120000000000000000000000000, 2450.50, 294060000000, 15000000000, 120000),
  ('0x9999999999999999999999999999999999999999', 'USD Coin', 'USDC', 35000000000000000, 1.00, 35000000000, 8500000000, 85000);

  -- Insert network stats
  INSERT INTO starknet_network_stats (metric_name, metric_value) VALUES
  ('total_transactions', 2500000),
  ('total_contracts', 15000),
  ('total_value_locked', 25600000.50),
  ('active_users_24h', 12500),
  ('gas_used_24h', 45000000),
  ('avg_block_time', 12.5),
  ('current_block', 100003);

  -- Create indexes for better performance
  CREATE INDEX idx_blocks_number ON starknet_blocks(block_number);
  CREATE INDEX idx_transactions_hash ON starknet_transactions(transaction_hash);
  CREATE INDEX idx_transactions_block ON starknet_transactions(block_number);
  CREATE INDEX idx_contracts_address ON starknet_contracts(contract_address);
  CREATE INDEX idx_tokens_address ON starknet_tokens(contract_address);

  -- Enable Row Level Security (optional)
  ALTER TABLE starknet_blocks ENABLE ROW LEVEL SECURITY;
  ALTER TABLE starknet_transactions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE starknet_contracts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE starknet_tokens ENABLE ROW LEVEL SECURITY;
  ALTER TABLE starknet_network_stats ENABLE ROW LEVEL SECURITY;

  -- Create policies to allow read access
  CREATE POLICY "Allow read access to blocks" ON starknet_blocks FOR SELECT USING (true);
  CREATE POLICY "Allow read access to transactions" ON starknet_transactions FOR SELECT USING (true);
  CREATE POLICY "Allow read access to contracts" ON starknet_contracts FOR SELECT USING (true);
  CREATE POLICY "Allow read access to tokens" ON starknet_tokens FOR SELECT USING (true);
  CREATE POLICY "Allow read access to network stats" ON starknet_network_stats FOR SELECT USING (true);

  result := 'StarkNet schema and sample data created successfully!';
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_starknet_schema() TO authenticated;
GRANT EXECUTE ON FUNCTION create_starknet_schema() TO anon;
GRANT EXECUTE ON FUNCTION create_starknet_schema() TO service_role;
