-- Create StarkNet tables for direct Supabase access
-- Drop existing tables if they exist
DROP TABLE IF EXISTS starknet_network_stats;
DROP TABLE IF EXISTS starknet_tokens;
DROP TABLE IF EXISTS starknet_contracts;
DROP TABLE IF EXISTS starknet_transactions;
DROP TABLE IF EXISTS starknet_blocks;

-- Create blocks table
CREATE TABLE starknet_blocks (
    id BIGSERIAL PRIMARY KEY,
    block_number BIGINT NOT NULL UNIQUE,
    block_hash TEXT NOT NULL UNIQUE,
    parent_hash TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    transaction_count INTEGER DEFAULT 0,
    gas_used BIGINT DEFAULT 0,
    gas_limit BIGINT DEFAULT 0,
    sequencer_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE starknet_transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_hash TEXT NOT NULL UNIQUE,
    block_number BIGINT,
    from_address TEXT NOT NULL,
    to_address TEXT,
    value_wei TEXT DEFAULT '0',
    gas_used BIGINT DEFAULT 0,
    gas_price BIGINT DEFAULT 0,
    status TEXT DEFAULT 'SUCCESS',
    transaction_type TEXT DEFAULT 'TRANSFER',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contracts table
CREATE TABLE starknet_contracts (
    id BIGSERIAL PRIMARY KEY,
    contract_address TEXT NOT NULL UNIQUE,
    contract_name TEXT,
    contract_type TEXT DEFAULT 'UNKNOWN',
    is_verified BOOLEAN DEFAULT FALSE,
    total_value_locked NUMERIC(20,2) DEFAULT 0,
    transaction_count_24h INTEGER DEFAULT 0,
    volume_24h NUMERIC(20,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tokens table
CREATE TABLE starknet_tokens (
    id BIGSERIAL PRIMARY KEY,
    contract_address TEXT NOT NULL UNIQUE,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    decimals INTEGER DEFAULT 18,
    price_usd NUMERIC(20,8) DEFAULT 0,
    price_change_24h NUMERIC(10,4) DEFAULT 0,
    volume_24h NUMERIC(20,2) DEFAULT 0,
    market_cap NUMERIC(20,2) DEFAULT 0,
    holder_count INTEGER DEFAULT 0,
    total_supply NUMERIC(30,0) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create network stats table
CREATE TABLE starknet_network_stats (
    id BIGSERIAL PRIMARY KEY,
    metric_name TEXT NOT NULL UNIQUE,
    metric_value TEXT NOT NULL,
    metric_type TEXT DEFAULT 'number',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_blocks_number ON starknet_blocks(block_number DESC);
CREATE INDEX idx_blocks_timestamp ON starknet_blocks(timestamp DESC);
CREATE INDEX idx_transactions_timestamp ON starknet_transactions(timestamp DESC);
CREATE INDEX idx_transactions_from ON starknet_transactions(from_address);
CREATE INDEX idx_transactions_to ON starknet_transactions(to_address);
CREATE INDEX idx_contracts_tvl ON starknet_contracts(total_value_locked DESC);
CREATE INDEX idx_tokens_market_cap ON starknet_tokens(market_cap DESC);

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

-- Insert sample data
INSERT INTO starknet_blocks (block_number, block_hash, parent_hash, transaction_count, gas_used, gas_limit, sequencer_address) VALUES
(1000001, '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890', '0x0a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789', 25, 2500000, 5000000, '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'),
(1000002, '0x2b3c4d5e6f7890a1bcdef1234567890abcdef1234567890abcdef1234567890a', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890', 30, 3000000, 5000000, '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'),
(1000003, '0x3c4d5e6f7890a1b2cdef1234567890abcdef1234567890abcdef1234567890ab', '0x2b3c4d5e6f7890a1bcdef1234567890abcdef1234567890abcdef1234567890a', 18, 1800000, 5000000, '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'),
(1000004, '0x4d5e6f7890a1b2c3def1234567890abcdef1234567890abcdef1234567890abc', '0x3c4d5e6f7890a1b2cdef1234567890abcdef1234567890abcdef1234567890ab', 22, 2200000, 5000000, '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'),
(1000005, '0x5e6f7890a1b2c3d4ef1234567890abcdef1234567890abcdef1234567890abcd', '0x4d5e6f7890a1b2c3def1234567890abcdef1234567890abcdef1234567890abc', 35, 3500000, 5000000, '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7');

INSERT INTO starknet_transactions (transaction_hash, block_number, from_address, to_address, value_wei, gas_used, gas_price, status, transaction_type) VALUES
('0xa1b2c3d4e5f6789012345678901234567890123456789012345678901234567890', 1000005, '0x01234567890abcdef01234567890abcdef01234567890abcdef01234567890ab', '0x0fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321', '1000000000000000000', 21000, 1000000000, 'SUCCESS', 'TRANSFER'),
('0xb2c3d4e5f6789012345678901234567890123456789012345678901234567890a1', 1000005, '0x02345678901bcdef02345678901bcdef02345678901bcdef02345678901bcdef0', '0x0edcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321f', '500000000000000000', 45000, 1200000000, 'SUCCESS', 'CONTRACT_CALL'),
('0xc3d4e5f6789012345678901234567890123456789012345678901234567890a1b2', 1000004, '0x03456789012cdef03456789012cdef03456789012cdef03456789012cdef012c', '0x0dcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321fe', '2000000000000000000', 21000, 1100000000, 'SUCCESS', 'TRANSFER'),
('0xd4e5f6789012345678901234567890123456789012345678901234567890a1b2c3', 1000004, '0x04567890123def04567890123def04567890123def04567890123def0123def01', '0x0cba0987654321fedcba0987654321fedcba0987654321fedcba0987654321fed', '750000000000000000', 65000, 1300000000, 'SUCCESS', 'SWAP'),
('0xe5f6789012345678901234567890123456789012345678901234567890a1b2c3d4', 1000003, '0x05678901234ef05678901234ef05678901234ef05678901234ef01234ef012ef', '0x0ba0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedc', '300000000000000000', 21000, 1050000000, 'SUCCESS', 'TRANSFER');

INSERT INTO starknet_contracts (contract_address, contract_name, contract_type, is_verified, total_value_locked, transaction_count_24h, volume_24h) VALUES
('0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', 'ETH Token', 'TOKEN', true, 1500000000, 2500, 50000000),
('0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', 'USDC Token', 'TOKEN', true, 800000000, 1800, 35000000),
('0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3', 'JediSwap Router', 'DEX', true, 250000000, 1200, 15000000),
('0x041fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97023', 'mySwap AMM', 'DEX', true, 180000000, 900, 12000000),
('0x0319111a5037cbec2b3e638cc34a3474e2d2608299f3e62866e9cc683208c610', 'StarkGate Bridge', 'BRIDGE', true, 500000000, 600, 25000000);

INSERT INTO starknet_tokens (contract_address, symbol, name, decimals, price_usd, price_change_24h, volume_24h, market_cap, holder_count, total_supply) VALUES
('0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', 'ETH', 'Ethereum', 18, 2450.50, 2.35, 125000000, 295000000000, 125000, 120000000000000000000000000),
('0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', 'USDC', 'USD Coin', 6, 1.00, -0.02, 85000000, 32000000000, 95000, 32000000000000000),
('0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', 'STRK', 'Starknet Token', 18, 0.85, 5.67, 45000000, 850000000, 75000, 1000000000000000000000000000),
('0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def69584601729a73e7', 'LORDS', 'Lords Token', 18, 0.125, -1.23, 2500000, 12500000, 8500, 100000000000000000000000000),
('0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', 'ZEND', 'Zend Token', 18, 0.045, 8.92, 1200000, 4500000, 5200, 100000000000000000000000000);

INSERT INTO starknet_network_stats (metric_name, metric_value, metric_type) VALUES
('total_transactions', '2500000', 'number'),
('total_contracts', '15000', 'number'),
('total_value_locked', '2500000000', 'currency'),
('active_users_24h', '12500', 'number'),
('gas_used_24h', '150000000', 'number'),
('avg_block_time', '12', 'number'),
('current_block', '1000005', 'number');

-- Create a function to simulate real-time data updates
CREATE OR REPLACE FUNCTION simulate_starknet_data()
RETURNS void AS $$
DECLARE
    new_block_number BIGINT;
    new_tx_hash TEXT;
    random_from TEXT;
    random_to TEXT;
    random_value TEXT;
BEGIN
    -- Get the latest block number
    SELECT COALESCE(MAX(block_number), 1000000) + 1 INTO new_block_number FROM starknet_blocks;
    
    -- Insert a new block
    INSERT INTO starknet_blocks (
        block_number, 
        block_hash, 
        parent_hash, 
        transaction_count, 
        gas_used, 
        gas_limit, 
        sequencer_address
    ) VALUES (
        new_block_number,
        '0x' || encode(gen_random_bytes(32), 'hex'),
        (SELECT block_hash FROM starknet_blocks ORDER BY block_number DESC LIMIT 1),
        floor(random() * 50 + 10)::INTEGER,
        floor(random() * 4000000 + 1000000)::BIGINT,
        5000000,
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
    );
    
    -- Insert some new transactions
    FOR i IN 1..floor(random() * 5 + 1)::INTEGER LOOP
        new_tx_hash := '0x' || encode(gen_random_bytes(32), 'hex');
        random_from := '0x' || encode(gen_random_bytes(32), 'hex');
        random_to := '0x' || encode(gen_random_bytes(32), 'hex');
        random_value := (floor(random() * 10000000000000000000 + 1000000000000000)::BIGINT)::TEXT;
        
        INSERT INTO starknet_transactions (
            transaction_hash,
            block_number,
            from_address,
            to_address,
            value_wei,
            gas_used,
            gas_price,
            status,
            transaction_type
        ) VALUES (
            new_tx_hash,
            new_block_number,
            random_from,
            random_to,
            random_value,
            floor(random() * 100000 + 21000)::BIGINT,
            floor(random() * 2000000000 + 500000000)::BIGINT,
            CASE 
                WHEN random() < 0.9 THEN 'SUCCESS'
                WHEN random() < 0.95 THEN 'PENDING'
                ELSE 'FAILED'
            END,
            CASE 
                WHEN random() < 0.4 THEN 'TRANSFER'
                WHEN random() < 0.6 THEN 'CONTRACT_CALL'
                WHEN random() < 0.8 THEN 'SWAP'
                WHEN random() < 0.9 THEN 'BRIDGE'
                ELSE 'CONTRACT_DEPLOYMENT'
            END
        );
    END LOOP;
    
    -- Update network stats
    UPDATE starknet_network_stats 
    SET metric_value = (SELECT COUNT(*)::TEXT FROM starknet_transactions),
        updated_at = NOW()
    WHERE metric_name = 'total_transactions';
    
    UPDATE starknet_network_stats 
    SET metric_value = new_block_number::TEXT,
        updated_at = NOW()
    WHERE metric_name = 'current_block';
    
    -- Update some token prices randomly
    UPDATE starknet_tokens 
    SET price_usd = price_usd * (1 + (random() - 0.5) * 0.1),
        price_change_24h = (random() - 0.5) * 20,
        volume_24h = volume_24h * (1 + (random() - 0.5) * 0.2)
    WHERE random() < 0.3;
    
END;
$$ LANGUAGE plpgsql;

-- Create a function to run continuous simulation
CREATE OR REPLACE FUNCTION run_starknet_simulation()
RETURNS void AS $$
BEGIN
    -- Run simulation 10 times to create initial activity
    FOR i IN 1..10 LOOP
        PERFORM simulate_starknet_data();
        PERFORM pg_sleep(0.1); -- Small delay between iterations
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Enable real-time for all tables
-- Note: You need to enable these in Supabase Dashboard > Database > Replication
-- ALTER PUBLICATION supabase_realtime ADD TABLE starknet_blocks;
-- ALTER PUBLICATION supabase_realtime ADD TABLE starknet_transactions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE starknet_contracts;
-- ALTER PUBLICATION supabase_realtime ADD TABLE starknet_tokens;
-- ALTER PUBLICATION supabase_realtime ADD TABLE starknet_network_stats;

-- Run initial simulation
SELECT run_starknet_simulation();
