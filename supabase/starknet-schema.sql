-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- Create StarkNet blocks table
CREATE TABLE IF NOT EXISTS starknet_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_number BIGINT UNIQUE NOT NULL,
    block_hash TEXT UNIQUE NOT NULL,
    parent_hash TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    transaction_count INTEGER DEFAULT 0,
    gas_used BIGINT DEFAULT 0,
    gas_limit BIGINT DEFAULT 0,
    sequencer_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create StarkNet transactions table
CREATE TABLE IF NOT EXISTS starknet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_hash TEXT UNIQUE NOT NULL,
    block_number BIGINT NOT NULL,
    from_address TEXT NOT NULL,
    to_address TEXT,
    value_wei TEXT DEFAULT '0',
    gas_used BIGINT DEFAULT 0,
    gas_price BIGINT DEFAULT 0,
    status TEXT CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')) DEFAULT 'PENDING',
    transaction_type TEXT CHECK (transaction_type IN ('TRANSFER', 'CONTRACT_CALL', 'SWAP', 'CONTRACT_DEPLOYMENT', 'BRIDGE')) DEFAULT 'TRANSFER',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (block_number) REFERENCES starknet_blocks(block_number) ON DELETE CASCADE
);

-- Create StarkNet contracts table
CREATE TABLE IF NOT EXISTS starknet_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_address TEXT UNIQUE NOT NULL,
    contract_name TEXT,
    contract_type TEXT CHECK (contract_type IN ('DEX', 'LENDING', 'BRIDGE', 'VAULT', 'NFT', 'GOVERNANCE', 'OTHER')) DEFAULT 'OTHER',
    is_verified BOOLEAN DEFAULT FALSE,
    total_value_locked TEXT DEFAULT '0',
    transaction_count_24h INTEGER DEFAULT 0,
    volume_24h TEXT DEFAULT '0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create StarkNet tokens table
CREATE TABLE IF NOT EXISTS starknet_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_address TEXT UNIQUE NOT NULL,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    decimals INTEGER DEFAULT 18,
    price_usd DECIMAL(20, 8) DEFAULT 0,
    price_change_24h DECIMAL(10, 4) DEFAULT 0,
    volume_24h TEXT DEFAULT '0',
    market_cap TEXT DEFAULT '0',
    holder_count INTEGER DEFAULT 0,
    total_supply TEXT DEFAULT '0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create StarkNet events table
CREATE TABLE IF NOT EXISTS starknet_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_hash TEXT NOT NULL,
    block_number BIGINT NOT NULL,
    event_name TEXT NOT NULL,
    contract_address TEXT NOT NULL,
    data JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (transaction_hash) REFERENCES starknet_transactions(transaction_hash) ON DELETE CASCADE,
    FOREIGN KEY (block_number) REFERENCES starknet_blocks(block_number) ON DELETE CASCADE
);

-- Create network stats table
CREATE TABLE IF NOT EXISTS starknet_network_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT UNIQUE NOT NULL,
    metric_value TEXT NOT NULL,
    metric_type TEXT DEFAULT 'number',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_starknet_blocks_number ON starknet_blocks(block_number DESC);
CREATE INDEX IF NOT EXISTS idx_starknet_blocks_timestamp ON starknet_blocks(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_starknet_transactions_hash ON starknet_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_starknet_transactions_block ON starknet_transactions(block_number DESC);
CREATE INDEX IF NOT EXISTS idx_starknet_transactions_timestamp ON starknet_transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_starknet_transactions_from ON starknet_transactions(from_address);
CREATE INDEX IF NOT EXISTS idx_starknet_transactions_to ON starknet_transactions(to_address);
CREATE INDEX IF NOT EXISTS idx_starknet_transactions_status ON starknet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_starknet_transactions_type ON starknet_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_starknet_contracts_address ON starknet_contracts(contract_address);
CREATE INDEX IF NOT EXISTS idx_starknet_contracts_type ON starknet_contracts(contract_type);
CREATE INDEX IF NOT EXISTS idx_starknet_contracts_verified ON starknet_contracts(is_verified);
CREATE INDEX IF NOT EXISTS idx_starknet_contracts_tvl ON starknet_contracts(total_value_locked DESC);
CREATE INDEX IF NOT EXISTS idx_starknet_tokens_symbol ON starknet_tokens(symbol);
CREATE INDEX IF NOT EXISTS idx_starknet_tokens_market_cap ON starknet_tokens(market_cap DESC);
CREATE INDEX IF NOT EXISTS idx_starknet_events_tx_hash ON starknet_events(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_starknet_events_block ON starknet_events(block_number DESC);
CREATE INDEX IF NOT EXISTS idx_starknet_events_contract ON starknet_events(contract_address);
CREATE INDEX IF NOT EXISTS idx_starknet_events_timestamp ON starknet_events(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE starknet_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE starknet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE starknet_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE starknet_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE starknet_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE starknet_network_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for blocks" ON starknet_blocks FOR SELECT USING (true);
CREATE POLICY "Public read access for transactions" ON starknet_transactions FOR SELECT USING (true);
CREATE POLICY "Public read access for contracts" ON starknet_contracts FOR SELECT USING (true);
CREATE POLICY "Public read access for tokens" ON starknet_tokens FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON starknet_events FOR SELECT USING (true);
CREATE POLICY "Public read access for network stats" ON starknet_network_stats FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_starknet_blocks_updated_at BEFORE UPDATE ON starknet_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_starknet_transactions_updated_at BEFORE UPDATE ON starknet_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_starknet_contracts_updated_at BEFORE UPDATE ON starknet_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_starknet_tokens_updated_at BEFORE UPDATE ON starknet_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_starknet_network_stats_updated_at BEFORE UPDATE ON starknet_network_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
