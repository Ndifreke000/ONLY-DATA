-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS starknet_events CASCADE;
DROP TABLE IF EXISTS starknet_transactions CASCADE;
DROP TABLE IF EXISTS starknet_blocks CASCADE;
DROP TABLE IF EXISTS starknet_contracts CASCADE;
DROP TABLE IF EXISTS starknet_tokens CASCADE;
DROP TABLE IF EXISTS starknet_network_stats CASCADE;

-- Create StarkNet blocks table
CREATE TABLE starknet_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_number BIGINT UNIQUE NOT NULL,
    block_hash TEXT UNIQUE NOT NULL,
    parent_hash TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    transaction_count INTEGER DEFAULT 0,
    gas_used BIGINT DEFAULT 0,
    gas_limit BIGINT DEFAULT 15000000,
    sequencer_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create StarkNet transactions table
CREATE TABLE starknet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_hash TEXT UNIQUE NOT NULL,
    block_number BIGINT NOT NULL,
    from_address TEXT NOT NULL,
    to_address TEXT,
    value_wei TEXT DEFAULT '0',
    gas_used BIGINT DEFAULT 0,
    gas_price BIGINT DEFAULT 0,
    status TEXT CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')) DEFAULT 'SUCCESS',
    transaction_type TEXT CHECK (transaction_type IN ('TRANSFER', 'CONTRACT_CALL', 'SWAP', 'CONTRACT_DEPLOYMENT', 'BRIDGE')) DEFAULT 'TRANSFER',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create StarkNet contracts table
CREATE TABLE starknet_contracts (
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
CREATE TABLE starknet_tokens (
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

-- Create network stats table
CREATE TABLE starknet_network_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT UNIQUE NOT NULL,
    metric_value TEXT NOT NULL,
    metric_type TEXT DEFAULT 'number',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_starknet_blocks_number ON starknet_blocks(block_number DESC);
CREATE INDEX idx_starknet_blocks_timestamp ON starknet_blocks(timestamp DESC);
CREATE INDEX idx_starknet_transactions_hash ON starknet_transactions(transaction_hash);
CREATE INDEX idx_starknet_transactions_block ON starknet_transactions(block_number DESC);
CREATE INDEX idx_starknet_transactions_timestamp ON starknet_transactions(timestamp DESC);
CREATE INDEX idx_starknet_transactions_from ON starknet_transactions(from_address);
CREATE INDEX idx_starknet_transactions_to ON starknet_transactions(to_address);
CREATE INDEX idx_starknet_transactions_status ON starknet_transactions(status);
CREATE INDEX idx_starknet_transactions_type ON starknet_transactions(transaction_type);
CREATE INDEX idx_starknet_contracts_address ON starknet_contracts(contract_address);
CREATE INDEX idx_starknet_contracts_type ON starknet_contracts(contract_type);
CREATE INDEX idx_starknet_contracts_verified ON starknet_contracts(is_verified);
CREATE INDEX idx_starknet_tokens_symbol ON starknet_tokens(symbol);
CREATE INDEX idx_starknet_tokens_market_cap ON starknet_tokens(market_cap DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE starknet_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE starknet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE starknet_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE starknet_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE starknet_network_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for blocks" ON starknet_blocks FOR SELECT USING (true);
CREATE POLICY "Public read access for transactions" ON starknet_transactions FOR SELECT USING (true);
CREATE POLICY "Public read access for contracts" ON starknet_contracts FOR SELECT USING (true);
CREATE POLICY "Public read access for tokens" ON starknet_tokens FOR SELECT USING (true);
CREATE POLICY "Public read access for network stats" ON starknet_network_stats FOR SELECT USING (true);

-- Insert sample network statistics
INSERT INTO starknet_network_stats (metric_name, metric_value, metric_type) VALUES
('total_transactions', '2847392', 'number'),
('total_contracts', '15234', 'number'),
('total_value_locked', '847000000', 'number'),
('active_users_24h', '23456', 'number'),
('gas_used_24h', '1234567890', 'number'),
('avg_block_time', '12.3', 'number'),
('current_block', '847392', 'number')
ON CONFLICT (metric_name) DO UPDATE SET 
    metric_value = EXCLUDED.metric_value,
    updated_at = NOW();

-- Insert sample blocks
INSERT INTO starknet_blocks (block_number, block_hash, parent_hash, timestamp, transaction_count, gas_used, gas_limit, sequencer_address) VALUES
(847392, '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890', '0x0a1b2c3d4e5f6789abcdef1234567890abcdef1234567890abcdef1234567890', NOW() - INTERVAL '1 minute', 156, 12456789, 15000000, '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4'),
(847391, '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890', NOW() - INTERVAL '2 minutes', 203, 13567890, 15000000, '0x853d46Dd7635D7532925a3b8D4C0532925a3b8D4'),
(847390, '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd', '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab', NOW() - INTERVAL '3 minutes', 178, 11234567, 15000000, '0x964e57Ee8746E6532925a3b8D4C0532925a3b8D4'),
(847389, '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcde', '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd', NOW() - INTERVAL '4 minutes', 134, 9876543, 15000000, '0xa75e68Ff9746E6532925a3b8D4C0532925a3b8D4'),
(847388, '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcde', NOW() - INTERVAL '5 minutes', 189, 14523678, 15000000, '0xb86f79Gg0857F7643036a4b8D4C0532925a3b8D4');

-- Insert sample transactions
INSERT INTO starknet_transactions (transaction_hash, block_number, from_address, to_address, value_wei, gas_used, gas_price, status, transaction_type, timestamp) VALUES
('0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890', 847392, '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4', '0x8ba1f109551bD432803012645Hac136c22c177', '1234000000000000000', 21000, 1000000000, 'SUCCESS', 'TRANSFER', NOW() - INTERVAL '1 minute'),
('0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab', 847391, '0x853d46Dd7635D7532925a3b8D4C0532925a3b8D4', '0x9cb2f209661cE542813022645Hac136c22c188', '567000000000000000', 45000, 1200000000, 'SUCCESS', 'CONTRACT_CALL', NOW() - INTERVAL '2 minutes'),
('0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd', 847390, '0x964e57Ee8746E6532925a3b8D4C0532925a3b8D4', '0xadc3f309772dF652824033645Hac136c22c199', '2891000000000000000', 67000, 1100000000, 'FAILED', 'SWAP', NOW() - INTERVAL '3 minutes'),
('0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcde', 847389, '0xa75e68Ff9746E6532925a3b8D4C0532925a3b8D4', '0xbef4g410883eF763935044756Hac136c22c200', '123000000000000000', 32000, 950000000, 'SUCCESS', 'TRANSFER', NOW() - INTERVAL '4 minutes'),
('0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 847388, '0xb86f79Gg0857F7643036a4b8D4C0532925a3b8D4', '0xcfg5h511994fG874046867Hac136c22c211', '5678000000000000000', 78000, 1300000000, 'SUCCESS', 'CONTRACT_DEPLOYMENT', NOW() - INTERVAL '5 minutes');

-- Insert sample contracts
INSERT INTO starknet_contracts (contract_address, contract_name, contract_type, is_verified, total_value_locked, transaction_count_24h, volume_24h) VALUES
('0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4', 'StarkSwap Router', 'DEX', true, '45600000000000000000000000', 15234, '2340000000000000000000000'),
('0x853d46Dd7635D7532925a3b8D4C0532925a3b8D4', 'zkLend Protocol', 'LENDING', true, '78900000000000000000000000', 8967, '1890000000000000000000000'),
('0x964e57Ee8746E6532925a3b8D4C0532925a3b8D4', 'Starknet Bridge', 'BRIDGE', true, '123400000000000000000000000', 5432, '5670000000000000000000000'),
('0xa75e68Ff9746E6532925a3b8D4C0532925a3b8D4', 'StarkVault', 'VAULT', false, '34500000000000000000000000', 3245, '1230000000000000000000000'),
('0xb86f79Gg0857F7643036a4b8D4C0532925a3b8D4', 'StarkNFT Marketplace', 'NFT', true, '12300000000000000000000000', 2156, '890000000000000000000000');

-- Insert sample tokens
INSERT INTO starknet_tokens (contract_address, symbol, name, decimals, price_usd, price_change_24h, volume_24h, market_cap, holder_count, total_supply) VALUES
('0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', 'ETH', 'Ethereum', 18, 2340.56, 2.34, '45600000000000000000000000', '281000000000000000000000000000', 234567, '120000000000000000000000000'),
('0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', 'STRK', 'Starknet Token', 18, 1.23, -1.45, '12300000000000000000000000', '1230000000000000000000000000', 89012, '10000000000000000000000000000'),
('0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', 'USDC', 'USD Coin', 6, 1.0, 0.01, '78900000000000', '32100000000000000', 156789, '32100000000000000'),
('0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', 'USDT', 'Tether', 6, 1.0, 0.02, '67800000000000', '29800000000000000', 145678, '29800000000000000'),
('0x00da114221cb83fa859dbdb4c44beeaa0bb8740f2e645a0cc8fb4725ee2301a27', 'DAI', 'Dai Stablecoin', 18, 1.0, -0.01, '34500000000000000000000000', '5600000000000000000000000000', 78901, '5600000000000000000000000000');

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

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE starknet_blocks;
ALTER PUBLICATION supabase_realtime ADD TABLE starknet_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE starknet_contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE starknet_tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE starknet_network_stats;
