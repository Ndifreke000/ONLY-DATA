-- Function to simulate new StarkNet blocks
CREATE OR REPLACE FUNCTION simulate_new_block()
RETURNS void AS $$
DECLARE
    new_block_number BIGINT;
    new_block_hash TEXT;
    parent_hash TEXT;
    tx_count INTEGER;
    gas_used BIGINT;
BEGIN
    -- Get the latest block number
    SELECT COALESCE(MAX(block_number), 847392) + 1 INTO new_block_number FROM starknet_blocks;
    
    -- Get parent hash
    SELECT block_hash INTO parent_hash FROM starknet_blocks ORDER BY block_number DESC LIMIT 1;
    
    -- Generate random values
    new_block_hash := '0x' || encode(gen_random_bytes(32), 'hex');
    tx_count := floor(random() * 200 + 50)::INTEGER;
    gas_used := floor(random() * 5000000 + 8000000)::BIGINT;
    
    -- Insert new block
    INSERT INTO starknet_blocks (
        block_number, 
        block_hash, 
        parent_hash, 
        timestamp, 
        transaction_count, 
        gas_used, 
        gas_limit,
        sequencer_address
    ) VALUES (
        new_block_number,
        new_block_hash,
        COALESCE(parent_hash, '0x0000000000000000000000000000000000000000000000000000000000000000'),
        NOW(),
        tx_count,
        gas_used,
        15000000,
        '0x' || encode(gen_random_bytes(20), 'hex')
    );
    
    -- Update network stats
    UPDATE starknet_network_stats 
    SET metric_value = (metric_value::BIGINT + 1)::TEXT, updated_at = NOW()
    WHERE metric_name = 'current_block';
    
    RAISE NOTICE 'New block % created with % transactions', new_block_number, tx_count;
END;
$$ LANGUAGE plpgsql;

-- Function to simulate new transactions
CREATE OR REPLACE FUNCTION simulate_new_transaction()
RETURNS void AS $$
DECLARE
    latest_block BIGINT;
    tx_hash TEXT;
    from_addr TEXT;
    to_addr TEXT;
    value_wei TEXT;
    gas_used BIGINT;
    gas_price BIGINT;
    tx_status TEXT;
    tx_type TEXT;
    statuses TEXT[] := ARRAY['SUCCESS', 'FAILED', 'PENDING'];
    types TEXT[] := ARRAY['TRANSFER', 'CONTRACT_CALL', 'SWAP', 'CONTRACT_DEPLOYMENT', 'BRIDGE'];
BEGIN
    -- Get latest block
    SELECT MAX(block_number) INTO latest_block FROM starknet_blocks;
    
    -- Generate random transaction data
    tx_hash := '0x' || encode(gen_random_bytes(32), 'hex');
    from_addr := '0x' || encode(gen_random_bytes(20), 'hex');
    to_addr := '0x' || encode(gen_random_bytes(20), 'hex');
    value_wei := (floor(random() * 10000000000000000000)::BIGINT)::TEXT; -- Random ETH amount in wei
    gas_used := floor(random() * 100000 + 21000)::BIGINT;
    gas_price := floor(random() * 2000000000 + 500000000)::BIGINT;
    tx_status := statuses[floor(random() * array_length(statuses, 1) + 1)];
    tx_type := types[floor(random() * array_length(types, 1) + 1)];
    
    -- Insert new transaction
    INSERT INTO starknet_transactions (
        transaction_hash,
        block_number,
        from_address,
        to_address,
        value_wei,
        gas_used,
        gas_price,
        status,
        transaction_type,
        timestamp
    ) VALUES (
        tx_hash,
        latest_block,
        from_addr,
        to_addr,
        value_wei,
        gas_used,
        gas_price,
        tx_status,
        tx_type,
        NOW()
    );
    
    -- Update total transactions count
    UPDATE starknet_network_stats 
    SET metric_value = (metric_value::BIGINT + 1)::TEXT, updated_at = NOW()
    WHERE metric_name = 'total_transactions';
    
    RAISE NOTICE 'New transaction % created: % -> %', tx_hash, from_addr, to_addr;
END;
$$ LANGUAGE plpgsql;

-- Function to update network stats randomly
CREATE OR REPLACE FUNCTION update_network_stats()
RETURNS void AS $$
BEGIN
    -- Update active users (random change)
    UPDATE starknet_network_stats 
    SET metric_value = (metric_value::BIGINT + floor(random() * 100 - 50))::TEXT, updated_at = NOW()
    WHERE metric_name = 'active_users_24h';
    
    -- Update TVL (random change)
    UPDATE starknet_network_stats 
    SET metric_value = (metric_value::BIGINT + floor(random() * 10000000 - 5000000))::TEXT, updated_at = NOW()
    WHERE metric_name = 'total_value_locked';
    
    -- Update gas used
    UPDATE starknet_network_stats 
    SET metric_value = (metric_value::BIGINT + floor(random() * 1000000))::TEXT, updated_at = NOW()
    WHERE metric_name = 'gas_used_24h';
    
    -- Update avg block time (slight variation)
    UPDATE starknet_network_stats 
    SET metric_value = (12.0 + (random() * 2 - 1))::TEXT, updated_at = NOW()
    WHERE metric_name = 'avg_block_time';
    
    RAISE NOTICE 'Network stats updated';
END;
$$ LANGUAGE plpgsql;

-- Create a function to run the simulation
CREATE OR REPLACE FUNCTION run_starknet_simulation()
RETURNS void AS $$
BEGIN
    -- Simulate new block every ~12 seconds
    PERFORM simulate_new_block();
    
    -- Simulate 3-8 new transactions
    FOR i IN 1..floor(random() * 6 + 3) LOOP
        PERFORM simulate_new_transaction();
    END LOOP;
    
    -- Update network stats
    PERFORM update_network_stats();
END;
$$ LANGUAGE plpgsql;

-- You can manually run the simulation with:
-- SELECT run_starknet_simulation();
