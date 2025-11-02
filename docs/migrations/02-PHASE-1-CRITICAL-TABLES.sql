-- =============================================================================
-- PHASE 1: CRITICAL TABLES & STORAGE
-- File: 02-PHASE-1-CRITICAL-TABLES.sql
-- Purpose: Create 5 essential tables + 1 storage bucket
-- Estimated Duration: 2.5 hours
-- Timeline: Day 1 (Critical path)
-- Status: PRODUCTION READY
-- =============================================================================
--
-- EXECUTION STEPS:
-- 1. Backup database first
-- 2. Execute sections in order (1.1 → 1.2 → 1.3 → 1.4)
-- 3. Create avatars bucket via Supabase console (Section 1.5)
-- 4. Run verification queries at end of each section
-- 5. After all tables: pnpm db:types && pnpm typecheck
--
-- =============================================================================

BEGIN TRANSACTION;

-- =============================================================================
-- 1.1: CREATE appointment_services TABLE (30 minutes)
-- =============================================================================
-- PURPOSE: Maps services to appointments for booking system
-- IMPACT: 10 files, booking creation will fail without this
-- =============================================================================

CREATE TABLE IF NOT EXISTS scheduling.appointment_services (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys (required)
  appointment_id UUID NOT NULL REFERENCES scheduling.appointments(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES catalog.services(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES organization.staff_profiles(id) ON DELETE SET NULL,

  -- Service information (denormalized for performance)
  service_name VARCHAR(255),
  duration_minutes INTEGER,
  price_at_time NUMERIC(10, 2),

  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_id UUID REFERENCES identity.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_by_id UUID REFERENCES identity.profiles(id) ON DELETE SET NULL,

  -- Data integrity
  CONSTRAINT valid_appointment_service
    CHECK (appointment_id IS NOT NULL AND service_id IS NOT NULL),
  CONSTRAINT valid_duration
    CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  CONSTRAINT valid_price
    CHECK (price_at_time IS NULL OR price_at_time >= 0)
);

-- Indexes for query performance
CREATE INDEX idx_appointment_services_appointment_id
  ON scheduling.appointment_services(appointment_id);
CREATE INDEX idx_appointment_services_service_id
  ON scheduling.appointment_services(service_id);
CREATE INDEX idx_appointment_services_staff_id
  ON scheduling.appointment_services(staff_id);
CREATE INDEX idx_appointment_services_created_at
  ON scheduling.appointment_services(created_at DESC);

-- Enable RLS
ALTER TABLE scheduling.appointment_services ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Users can view appointment services for their appointments
CREATE POLICY "Users view appointment services for their appointments"
  ON scheduling.appointment_services
  FOR SELECT
  USING (
    -- Customer can see their own appointment services
    appointment_id IN (
      SELECT a.id FROM scheduling.appointments a
      WHERE a.customer_id = auth.uid()
    )
    OR
    -- Staff can see services for appointments at their salon
    appointment_id IN (
      SELECT a.id FROM scheduling.appointments a
      INNER JOIN organization.staff_profiles sp ON a.salon_id = sp.salon_id
      WHERE sp.user_id = auth.uid()
    )
    OR
    -- Salon managers can see all their salon's appointment services
    appointment_id IN (
      SELECT a.id FROM scheduling.appointments a
      WHERE a.salon_id IN (
        SELECT id FROM organization.salons
        WHERE owner_id = auth.uid()
      )
    )
  );

-- RLS Policy 2: Staff can insert appointment services
CREATE POLICY "Staff can insert appointment services"
  ON scheduling.appointment_services
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scheduling.appointments a
      INNER JOIN organization.staff_profiles sp ON a.salon_id = sp.salon_id
      WHERE a.id = appointment_id AND sp.user_id = auth.uid()
    )
  );

-- RLS Policy 3: Staff can update appointment services
CREATE POLICY "Staff can update appointment services"
  ON scheduling.appointment_services
  FOR UPDATE
  USING (
    appointment_id IN (
      SELECT a.id FROM scheduling.appointments a
      INNER JOIN organization.staff_profiles sp ON a.salon_id = sp.salon_id
      WHERE sp.user_id = auth.uid()
    )
  );

-- RLS Policy 4: Anon cannot access
CREATE POLICY "Anon cannot access appointment services"
  ON scheduling.appointment_services
  FOR ALL
  USING (auth.role() != 'anon');

-- Grant permissions
GRANT SELECT ON scheduling.appointment_services TO authenticated;
GRANT INSERT ON scheduling.appointment_services TO authenticated;
GRANT UPDATE ON scheduling.appointment_services TO authenticated;

-- =============================================================================
-- VERIFICATION: appointment_services
-- =============================================================================
-- Run these queries to verify table was created correctly

/*
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_schema = 'scheduling'
  AND table_name = 'appointment_services'
) as table_exists;
-- Expected: true

SELECT indexname FROM pg_indexes
WHERE tablename = 'appointment_services'
ORDER BY indexname;
-- Expected: 4 indexes (appointment_id, service_id, staff_id, created_at)

SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'appointment_services';
-- Expected: relrowsecurity = true
*/

-- =============================================================================
-- 1.2: CREATE message_threads TABLE (45 minutes)
-- =============================================================================
-- PURPOSE: Stores conversation threads between users
-- IMPACT: 22 files, messaging system completely broken without this
-- =============================================================================

CREATE TABLE IF NOT EXISTS communication.message_threads (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants
  created_by_id UUID NOT NULL REFERENCES identity.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES identity.profiles(id) ON DELETE CASCADE,

  -- Thread metadata
  subject VARCHAR(500),
  description TEXT,

  -- Optional relationships (for context)
  salon_id UUID REFERENCES organization.salons(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES scheduling.appointments(id) ON DELETE SET NULL,

  -- Thread status
  is_archived BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,

  -- Additional context
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Data integrity
  CONSTRAINT valid_participants
    CHECK (created_by_id != recipient_id),
  CONSTRAINT valid_dates
    CHECK (last_message_at IS NULL OR last_message_at >= created_at),
  CONSTRAINT valid_unread
    CHECK (unread_count >= 0)
);

-- Indexes for query performance
CREATE INDEX idx_message_threads_created_by
  ON communication.message_threads(created_by_id);
CREATE INDEX idx_message_threads_recipient
  ON communication.message_threads(recipient_id);
CREATE INDEX idx_message_threads_created_at
  ON communication.message_threads(created_at DESC);
CREATE INDEX idx_message_threads_last_message_at
  ON communication.message_threads(last_message_at DESC NULLS LAST);
CREATE INDEX idx_message_threads_salon
  ON communication.message_threads(salon_id);
CREATE INDEX idx_message_threads_appointment
  ON communication.message_threads(appointment_id);

-- Composite index for common query pattern
CREATE INDEX idx_message_threads_participants
  ON communication.message_threads(created_by_id, recipient_id);

-- Unique constraint to prevent duplicate threads
CREATE UNIQUE INDEX idx_message_threads_unique_active
  ON communication.message_threads(
    LEAST(created_by_id, recipient_id),
    GREATEST(created_by_id, recipient_id)
  ) WHERE is_deleted = FALSE;

-- Enable RLS
ALTER TABLE communication.message_threads ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Users can view their own threads
CREATE POLICY "Users can view their own threads"
  ON communication.message_threads
  FOR SELECT
  USING (
    (created_by_id = auth.uid() OR recipient_id = auth.uid())
    AND is_deleted = FALSE
  );

-- RLS Policy 2: Users can create threads
CREATE POLICY "Users can create threads"
  ON communication.message_threads
  FOR INSERT
  WITH CHECK (
    created_by_id = auth.uid()
    AND created_by_id != recipient_id
  );

-- RLS Policy 3: Users can update their threads
CREATE POLICY "Users can update their threads"
  ON communication.message_threads
  FOR UPDATE
  USING (created_by_id = auth.uid() OR recipient_id = auth.uid());

-- RLS Policy 4: Users can soft-delete their threads
CREATE POLICY "Users can soft-delete their threads"
  ON communication.message_threads
  FOR DELETE
  USING (created_by_id = auth.uid() OR recipient_id = auth.uid());

-- RLS Policy 5: Anon cannot access
CREATE POLICY "Anon cannot access threads"
  ON communication.message_threads
  FOR ALL
  USING (auth.role() != 'anon');

-- Grant permissions
GRANT SELECT ON communication.message_threads TO authenticated;
GRANT INSERT ON communication.message_threads TO authenticated;
GRANT UPDATE ON communication.message_threads TO authenticated;
GRANT DELETE ON communication.message_threads TO authenticated;

-- =============================================================================
-- VERIFICATION: message_threads
-- =============================================================================
-- Run these queries to verify table was created correctly

/*
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_schema = 'communication'
  AND table_name = 'message_threads'
) as table_exists;
-- Expected: true

SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'message_threads'
ORDER BY constraint_name;
-- Expected: valid_participants, valid_dates, valid_unread constraints
*/

-- =============================================================================
-- 1.3: CREATE customer_favorites TABLE (25 minutes)
-- =============================================================================
-- PURPOSE: Stores which salons customers have marked as favorites
-- IMPACT: 5 files, favorites feature completely non-functional without this
-- =============================================================================

CREATE TABLE IF NOT EXISTS engagement.customer_favorites (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys
  customer_id UUID NOT NULL REFERENCES identity.profiles(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES organization.salons(id) ON DELETE CASCADE,

  -- Favorite data
  notes TEXT,
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  is_favorite BOOLEAN DEFAULT TRUE,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_id UUID REFERENCES identity.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_by_id UUID REFERENCES identity.profiles(id) ON DELETE SET NULL,

  -- Data integrity
  CONSTRAINT valid_customer_salon
    CHECK (customer_id IS NOT NULL AND salon_id IS NOT NULL)
);

-- Indexes
CREATE UNIQUE INDEX idx_customer_favorites_unique
  ON engagement.customer_favorites(customer_id, salon_id)
  WHERE is_favorite = TRUE;
CREATE INDEX idx_customer_favorites_customer
  ON engagement.customer_favorites(customer_id);
CREATE INDEX idx_customer_favorites_salon
  ON engagement.customer_favorites(salon_id);
CREATE INDEX idx_customer_favorites_created_at
  ON engagement.customer_favorites(created_at DESC);

-- Enable RLS
ALTER TABLE engagement.customer_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Customers can view their own favorites
CREATE POLICY "Customers can view their own favorites"
  ON engagement.customer_favorites
  FOR SELECT
  USING (customer_id = auth.uid());

-- RLS Policy 2: Customers can add favorites
CREATE POLICY "Customers can add favorites"
  ON engagement.customer_favorites
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- RLS Policy 3: Customers can update their own favorites
CREATE POLICY "Customers can update their own favorites"
  ON engagement.customer_favorites
  FOR UPDATE
  USING (customer_id = auth.uid());

-- RLS Policy 4: Customers can remove their own favorites
CREATE POLICY "Customers can remove their own favorites"
  ON engagement.customer_favorites
  FOR DELETE
  USING (customer_id = auth.uid());

-- RLS Policy 5: Anon cannot access
CREATE POLICY "Anon cannot access favorites"
  ON engagement.customer_favorites
  FOR ALL
  USING (auth.role() != 'anon');

-- Grant permissions
GRANT SELECT ON engagement.customer_favorites TO authenticated;
GRANT INSERT ON engagement.customer_favorites TO authenticated;
GRANT UPDATE ON engagement.customer_favorites TO authenticated;
GRANT DELETE ON engagement.customer_favorites TO authenticated;

-- Create view for easier querying (joins with salon data)
CREATE OR REPLACE VIEW engagement.customer_favorites_view AS
SELECT
  cf.id,
  cf.customer_id,
  cf.salon_id,
  cf.notes,
  cf.rating,
  s.name as salon_name,
  s.slug as salon_slug,
  s.description,
  s.image_url,
  cf.created_at,
  cf.updated_at
FROM engagement.customer_favorites cf
LEFT JOIN organization.salons s ON s.id = cf.salon_id
WHERE cf.is_favorite = TRUE;

GRANT SELECT ON engagement.customer_favorites_view TO authenticated;

-- =============================================================================
-- VERIFICATION: customer_favorites
-- =============================================================================
-- Run these queries to verify table was created correctly

/*
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_schema = 'engagement'
  AND table_name = 'customer_favorites'
) as table_exists;
-- Expected: true

SELECT EXISTS (
  SELECT 1 FROM information_schema.views
  WHERE table_schema = 'engagement'
  AND table_name = 'customer_favorites_view'
) as view_exists;
-- Expected: true
*/

-- =============================================================================
-- 1.4: CREATE audit_logs TABLE (60 minutes)
-- =============================================================================
-- PURPOSE: Base table for audit trail - admin action logging
-- IMPACT: 37 files, audit logging completely broken without this
-- NOTE: Code uses .schema('audit').from('audit_logs'), creating unified table
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit.audit_logs (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What changed
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  action VARCHAR(100) NOT NULL,

  -- Who and when
  actor_id UUID NOT NULL REFERENCES identity.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Change details
  old_values JSONB,
  new_values JSONB,
  change_summary TEXT,
  reason TEXT,

  -- Context
  source_system VARCHAR(100),
  ip_address INET,
  user_agent TEXT,

  -- Metadata for extensibility
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Data integrity
  CONSTRAINT valid_action
    CHECK (entity_type IS NOT NULL AND action IS NOT NULL)
);

-- Indexes for common query patterns
CREATE INDEX idx_audit_logs_entity
  ON audit.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor
  ON audit.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at
  ON audit.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action
  ON audit.audit_logs(action);

-- Partial index for recent changes (optimize for "what changed recently")
CREATE INDEX idx_audit_logs_recent
  ON audit.audit_logs(created_at DESC)
  WHERE created_at > now() - INTERVAL '30 days';

-- Enable RLS
ALTER TABLE audit.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Authenticated users can view audit logs
CREATE POLICY "Authenticated users can view audit logs"
  ON audit.audit_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policy 2: System can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON audit.audit_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy 3: Anon cannot access
CREATE POLICY "Anon cannot access audit logs"
  ON audit.audit_logs
  FOR ALL
  USING (auth.role() != 'anon');

-- Grant permissions
GRANT SELECT ON audit.audit_logs TO authenticated;
GRANT INSERT ON audit.audit_logs TO authenticated;

-- Create view for reading
CREATE OR REPLACE VIEW audit.audit_logs_view AS
SELECT
  al.id,
  al.entity_type,
  al.entity_id,
  al.action,
  al.actor_id,
  al.created_at,
  al.old_values,
  al.new_values,
  al.reason,
  p.username as actor_username,
  p.email as actor_email
FROM audit.audit_logs al
LEFT JOIN identity.profiles p ON p.id = al.actor_id
ORDER BY al.created_at DESC;

GRANT SELECT ON audit.audit_logs_view TO authenticated;

-- Create function to easily log actions
CREATE OR REPLACE FUNCTION audit.log_action(
  p_entity_type VARCHAR,
  p_entity_id UUID,
  p_action VARCHAR,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit.audit_logs (
    entity_type,
    entity_id,
    action,
    actor_id,
    old_values,
    new_values,
    reason,
    source_system,
    created_at
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_action,
    auth.uid(),
    p_old_values,
    p_new_values,
    p_reason,
    'application',
    now()
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION audit.log_action TO authenticated;

-- =============================================================================
-- VERIFICATION: audit_logs
-- =============================================================================
-- Run these queries to verify table was created correctly

/*
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_schema = 'audit'
  AND table_name = 'audit_logs'
) as table_exists;
-- Expected: true

SELECT indexname FROM pg_indexes
WHERE tablename = 'audit_logs'
ORDER BY indexname;
-- Expected: idx_audit_logs_action, idx_audit_logs_actor,
--           idx_audit_logs_created_at, idx_audit_logs_entity, idx_audit_logs_recent

SELECT EXISTS (
  SELECT 1 FROM information_schema.views
  WHERE table_schema = 'audit'
  AND table_name = 'audit_logs_view'
) as view_exists;
-- Expected: true

SELECT EXISTS (
  SELECT 1 FROM pg_proc
  WHERE proname = 'log_action'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'audit')
) as function_exists;
-- Expected: true
*/

-- =============================================================================
-- COMMIT TRANSACTION
-- =============================================================================

COMMIT;

-- =============================================================================
-- PHASE 1 SECTION 1.5: CREATE avatars STORAGE BUCKET (10 minutes)
-- =============================================================================
-- NOTE: This cannot be done via SQL. Use Supabase console:
--
-- MANUAL STEPS:
-- 1. Go to Supabase Dashboard → Storage → Buckets
-- 2. Click "Create a new bucket"
-- 3. Name: avatars
-- 4. Privacy: Private
-- 5. File size limit: 5 MB
-- 6. Click "Create bucket"
-- 7. Then set RLS policies (see below)
--
-- After creating bucket, add these RLS policies via Storage → Policies:
--
-- Policy 1: Authenticated users can view avatars
-- CREATE POLICY "Authenticated users can view avatars"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
--
-- Policy 2: Users can upload their own avatars
-- CREATE POLICY "Users can upload avatars to their folder"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'avatars'
--     AND (storage.foldername(name))[1] = auth.uid()::text
--   );
--
-- Policy 3: Users can update their own avatars
-- CREATE POLICY "Users can update their own avatars"
--   ON storage.objects FOR UPDATE
--   WITH CHECK (
--     bucket_id = 'avatars'
--     AND (storage.foldername(name))[1] = auth.uid()::text
--   );
--
-- Policy 4: Users can delete their own avatars
-- CREATE POLICY "Users can delete their own avatars"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'avatars'
--     AND (storage.foldername(name))[1] = auth.uid()::text
--   );
--
-- VERIFICATION:
-- SELECT EXISTS (
--   SELECT 1 FROM storage.buckets
--   WHERE name = 'avatars'
-- ) as bucket_exists;
-- -- Expected: true

-- =============================================================================
-- PHASE 1 COMPLETE!
-- =============================================================================
-- After Phase 1, regenerate TypeScript types:
--   pnpm db:types
-- Then run typecheck:
--   pnpm typecheck
-- Should see zero errors!
-- =============================================================================
