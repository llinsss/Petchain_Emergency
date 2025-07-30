-- PetChain Database Schema
-- Run this script to initialize the Neon database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pet_cache table for caching blockchain data
CREATE TABLE IF NOT EXISTS pet_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id VARCHAR(50) UNIQUE NOT NULL,
    owner_address VARCHAR(42) NOT NULL,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    emergency_contact TEXT,
    emergency_message TEXT,
    medical_data_public BOOLEAN DEFAULT FALSE,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scan_logs table for tracking QR code scans
CREATE TABLE IF NOT EXISTS scan_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id VARCHAR(50) NOT NULL,
    scanner_address VARCHAR(42),
    scanner_ip INET NOT NULL,
    location TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table for owner alerts
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pet_id VARCHAR(50),
    type VARCHAR(50) NOT NULL, -- 'scan', 'emergency', 'reminder'
    title VARCHAR(200) NOT NULL,
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pet_cache_owner ON pet_cache(owner_address);
CREATE INDEX IF NOT EXISTS idx_pet_cache_pet_id ON pet_cache(pet_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_pet_id ON scan_logs(pet_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_timestamp ON scan_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pet_cache_updated_at BEFORE UPDATE ON pet_cache
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development (optional)
-- INSERT INTO users (email, wallet_address) VALUES 
-- ('demo@petchain.app', '0x1234567890123456789012345678901234567890');

-- INSERT INTO pet_cache (pet_id, owner_address, name, breed, age, emergency_contact, emergency_message, medical_data_public) VALUES
-- ('1', '0x1234567890123456789012345678901234567890', 'Buddy', 'Golden Retriever', 3, '+1-555-0123', 'Friendly dog, loves treats', true);

COMMENT ON TABLE users IS 'User accounts linked to wallet addresses';
COMMENT ON TABLE pet_cache IS 'Cached pet data from blockchain for faster access';
COMMENT ON TABLE scan_logs IS 'Log of QR code scans for tracking and notifications';
COMMENT ON TABLE notifications IS 'User notifications for scans and reminders';
