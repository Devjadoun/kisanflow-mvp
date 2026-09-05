-- =============================================================================
-- KISANFLOW - PostgreSQL Database Schema v2 (Production Upgrade)
-- Smart India Hackathon 2026 (Problem Statement ID: 26032)
-- Real-time Smart Queue, Event Pipeline, & Authoritative Procurement Schema
-- =============================================================================

-- Enable required cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. QUEUE_ENTRIES TABLE
-- Live physical & digital queue management with positional tracking
-- =============================================================================
CREATE TABLE IF NOT EXISTS queue_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_id TEXT NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    farmer_name TEXT NOT NULL DEFAULT 'Farmer',
    commodity TEXT NOT NULL DEFAULT 'Wheat',
    quantity_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('waiting', 'approaching', 'called', 'processing', 'completed', 'missed', 'cancelled')) DEFAULT 'waiting',
    counter TEXT NOT NULL DEFAULT 'Gate 1',
    estimated_wait_minutes INTEGER NOT NULL DEFAULT 15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 2. PROCUREMENTS TABLE
-- Actual physical weighment, quality testing & acceptance records
-- =============================================================================
CREATE TABLE IF NOT EXISTS procurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    centre_id TEXT NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    commodity_id TEXT NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
    gross_weight NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tare_weight NUMERIC(10, 2) NOT NULL DEFAULT 0,
    net_weight NUMERIC(10, 2) NOT NULL DEFAULT 0,
    moisture NUMERIC(4, 2) NOT NULL DEFAULT 11.5,
    grade TEXT NOT NULL DEFAULT 'Grade A (MSP Compliant)',
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. NOTIFICATIONS TABLE
-- Real-time in-app alerts and notifications
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    phone TEXT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('unread', 'read')) DEFAULT 'unread',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. SMS_LOGS TABLE
-- Outbox and audit trail for SMS gateway transmissions
-- =============================================================================
CREATE TABLE IF NOT EXISTS sms_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES notifications(id) ON DELETE SET NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'submitted', 'delivered', 'failed', 'retrying', 'dead_letter')) DEFAULT 'queued',
    idempotency_key TEXT UNIQUE,
    retry_count INTEGER NOT NULL DEFAULT 0,
    provider TEXT NOT NULL DEFAULT 'DEMO_SMS_PROVIDER',
    error_details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. EVENT_LOGS TABLE
-- Immutable event ledger for distributed state synchronization
-- =============================================================================
CREATE TABLE IF NOT EXISTS event_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    correlation_id TEXT,
    event_version INTEGER NOT NULL DEFAULT 1,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. AUDIT_LOGS TABLE
-- Operational audit trail for administrative tracking
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. UPDATE BOOKINGS STATUS CONSTRAINT
-- Support full state machine lifecycle
-- =============================================================================
DO $$
BEGIN
    ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
    ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
        CHECK (status IN ('booked', 'confirmed', 'waiting', 'approaching', 'called', 'processing', 'quality_check', 'completed', 'payment_pending', 'paid', 'cancelled', 'missed', 'rescheduled', 'failed'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- =============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_queue_centre_status ON queue_entries(centre_id, status);
CREATE INDEX IF NOT EXISTS idx_queue_booking_id ON queue_entries(booking_id);
CREATE INDEX IF NOT EXISTS idx_procurements_booking ON procurements(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_phone ON notifications(phone);
CREATE INDEX IF NOT EXISTS idx_sms_idempotency ON sms_logs(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_event_entity ON event_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_event ON audit_logs(event_type);

-- =============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous / authenticated read/write for MVP evaluation
DO $$
BEGIN
    CREATE POLICY "Public read queue_entries" ON queue_entries FOR SELECT USING (true);
    CREATE POLICY "Public insert queue_entries" ON queue_entries FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public update queue_entries" ON queue_entries FOR UPDATE USING (true);
    CREATE POLICY "Public delete queue_entries" ON queue_entries FOR DELETE USING (true);

    CREATE POLICY "Public read procurements" ON procurements FOR SELECT USING (true);
    CREATE POLICY "Public insert procurements" ON procurements FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public update procurements" ON procurements FOR UPDATE USING (true);

    CREATE POLICY "Public read notifications" ON notifications FOR SELECT USING (true);
    CREATE POLICY "Public insert notifications" ON notifications FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public update notifications" ON notifications FOR UPDATE USING (true);

    CREATE POLICY "Public read sms_logs" ON sms_logs FOR SELECT USING (true);
    CREATE POLICY "Public insert sms_logs" ON sms_logs FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public update sms_logs" ON sms_logs FOR UPDATE USING (true);

    CREATE POLICY "Public read event_logs" ON event_logs FOR SELECT USING (true);
    CREATE POLICY "Public insert event_logs" ON event_logs FOR INSERT WITH CHECK (true);

    CREATE POLICY "Public read audit_logs" ON audit_logs FOR SELECT USING (true);
    CREATE POLICY "Public insert audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- =============================================================================
-- 10. REALTIME PUBLICATION
-- Enable Supabase Realtime for instant multi-client push
-- =============================================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
    ALTER PUBLICATION supabase_realtime ADD TABLE queue_entries;
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    ALTER PUBLICATION supabase_realtime ADD TABLE sms_logs;
    ALTER PUBLICATION supabase_realtime ADD TABLE event_logs;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- =============================================================================
-- 11. REMOVE OBSOLETE HARDCODED DEMO SEED DATA
-- Cleans out the initial hardcoded A027 booking and baseline bonus rewards
-- =============================================================================
DELETE FROM rewards WHERE reason LIKE '%Baseline onboarding%';
DELETE FROM bookings WHERE booking_id = 'KF-2026-00127';
