-- =============================================================================
-- KISANFLOW - PostgreSQL Database Schema for Supabase
-- Smart India Hackathon 2026 (Problem Statement ID: 26032)
-- Predictive Smart Queue & Slot Management System for Agricultural Procurement
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. PROFILES TABLE
-- Roles: farmer, operator, admin
-- =============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('farmer', 'operator', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 2. FARMERS TABLE
-- Extended details for registered agricultural producers
-- =============================================================================
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    village TEXT,
    district TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. CENTRES TABLE
-- Physical Mandi Samiti procurement centres
-- =============================================================================
CREATE TABLE IF NOT EXISTS centres (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 20,
    service_rate NUMERIC(4, 2) NOT NULL DEFAULT 4.0,
    status TEXT NOT NULL DEFAULT 'Optimal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. COMMODITIES TABLE
-- Official procurement commodities and MSP benchmark rates
-- =============================================================================
CREATE TABLE IF NOT EXISTS commodities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Quintal',
    msp_rate NUMERIC(10, 2) NOT NULL
);

-- =============================================================================
-- 5. SLOTS TABLE
-- Granular hourly capacity allocation per procurement centre
-- =============================================================================
CREATE TABLE IF NOT EXISTS slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_id TEXT NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 20,
    booked_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. BOOKINGS TABLE
-- Core appointment and queue token entity
-- Statuses: booked, arrived, waiting, processing, completed, no_show, cancelled
-- =============================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT UNIQUE NOT NULL,
    farmer_id UUID REFERENCES farmers(id) ON DELETE SET NULL,
    centre_id TEXT NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    commodity_id TEXT NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES slots(id) ON DELETE SET NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    token TEXT NOT NULL,
    queue_position INTEGER NOT NULL DEFAULT 1,
    predicted_wait_minutes INTEGER NOT NULL DEFAULT 35,
    status TEXT NOT NULL CHECK (status IN ('booked', 'arrived', 'waiting', 'processing', 'completed', 'no_show', 'cancelled')) DEFAULT 'booked',
    total_estimated_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. PAYMENTS TABLE
-- Prototype simulated Direct Benefit Transfer (DBT) disbursement registry
-- =============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    transaction_id TEXT NOT NULL,
    payment_mode TEXT NOT NULL DEFAULT 'Simulated DBT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. FEEDBACK TABLE
-- Post-procurement farmer experience ratings and feedback
-- =============================================================================
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 9. REWARDS TABLE
-- Kisan Loyalty & punctuality reward point ledger
-- =============================================================================
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_centre_id ON bookings(centre_id);
CREATE INDEX IF NOT EXISTS idx_bookings_farmer_id ON bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(token);
CREATE INDEX IF NOT EXISTS idx_slots_centre_date ON slots(centre_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_rewards_farmer ON rewards(farmer_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Configured for anonymous/authenticated access in hackathon evaluation mode
-- =============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Public READ policies (allows frontend to load reference and demonstration data)
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read farmers" ON farmers FOR SELECT USING (true);
CREATE POLICY "Public read centres" ON centres FOR SELECT USING (true);
CREATE POLICY "Public read commodities" ON commodities FOR SELECT USING (true);
CREATE POLICY "Public read slots" ON slots FOR SELECT USING (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public read payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Public read feedback" ON feedback FOR SELECT USING (true);
CREATE POLICY "Public read rewards" ON rewards FOR SELECT USING (true);

-- Public INSERT/UPDATE policies for demo functionality (anon key support)
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Public insert payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert feedback" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert rewards" ON rewards FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update slots" ON slots FOR UPDATE USING (true);

-- =============================================================================
-- SEED DATA
-- Populate default Mandi Centres, MSP Commodities, and Demo Profiles
-- =============================================================================

-- 1. Procurement Centres
INSERT INTO centres (id, name, location, capacity, service_rate, status) VALUES
('dadri', 'Dadri Procurement Centre', 'Gautam Buddha Nagar, UP', 20, 4.2, 'Optimal'),
('greater-noida', 'Greater Noida Procurement Centre', 'Gautam Buddha Nagar, UP', 25, 3.8, 'Moderate'),
('sikandrabad', 'Sikandrabad Procurement Centre', 'Bulandshahr, UP', 15, 4.8, 'Smooth'),
('bulandshahr', 'Bulandshahr Central Procurement Mandi', 'Bulandshahr, UP', 30, 4.0, 'Optimal')
ON CONFLICT (id) DO NOTHING;

-- 2. Commodities (2026 MSP Rates)
INSERT INTO commodities (id, name, unit, msp_rate) VALUES
('wheat', 'Wheat (गेहूं)', 'Quintal', 2275.00),
('rice', 'Paddy / Rice (धान)', 'Quintal', 2300.00),
('mustard', 'Mustard (सरसों)', 'Quintal', 5650.00),
('bajra', 'Bajra (बाजरा)', 'Quintal', 2500.00),
('maize', 'Maize (मक्का)', 'Quintal', 2090.00)
ON CONFLICT (id) DO NOTHING;

-- 3. Default Profiles (Farmer, Operator, Admin)
INSERT INTO profiles (id, name, phone, role) VALUES
('a0000000-0000-0000-0000-000000000001', 'Ramesh Kumar', '+91 98765 43210', 'farmer'),
('a0000000-0000-0000-0000-000000000002', 'Suresh Chandra', '+91 94120 11234', 'operator'),
('a0000000-0000-0000-0000-000000000003', 'State Agricultural Board', '+91 11 2338 1234', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 4. Farmer Detail Record
INSERT INTO farmers (id, profile_id, village, district) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Dhoom Manikpur, Dadri', 'Gautam Buddha Nagar')
ON CONFLICT (id) DO NOTHING;

-- 5. Standard Slots for Dadri Centre
INSERT INTO slots (id, centre_id, slot_date, start_time, end_time, capacity, booked_count) VALUES
('c0000000-0000-0000-0000-000000000001', 'dadri', CURRENT_DATE, '09:00 AM', '10:00 AM', 20, 18),
('c0000000-0000-0000-0000-000000000002', 'dadri', CURRENT_DATE, '11:00 AM', '12:00 PM', 20, 8),
('c0000000-0000-0000-0000-000000000003', 'dadri', CURRENT_DATE, '01:00 PM', '02:00 PM', 20, 12),
('c0000000-0000-0000-0000-000000000004', 'dadri', CURRENT_DATE, '03:00 PM', '04:00 PM', 20, 15),
('c0000000-0000-0000-0000-000000000005', 'dadri', CURRENT_DATE, '05:00 PM', '06:00 PM', 20, 11)
ON CONFLICT (id) DO NOTHING;

-- 6. Initial Seed Booking for Demo Farmer (Token A027)
INSERT INTO bookings (
    id, booking_id, farmer_id, centre_id, commodity_id, slot_id,
    quantity, token, queue_position, predicted_wait_minutes, status, total_estimated_amount
) VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'KF-2026-00127',
    'b0000000-0000-0000-0000-000000000001',
    'dadri',
    'wheat',
    'c0000000-0000-0000-0000-000000000002',
    250.00,
    'A027',
    8,
    35,
    'booked',
    5687.50
) ON CONFLICT (booking_id) DO NOTHING;

-- 7. Initial Loyalty Rewards for Demo Farmer
INSERT INTO rewards (farmer_id, points, reason) VALUES
('b0000000-0000-0000-0000-000000000001', 1200, 'Baseline onboarding & historical procurement bonus'),
('b0000000-0000-0000-0000-000000000001', 50, 'Booked AI recommended optimal off-peak slot')
ON CONFLICT DO NOTHING;
