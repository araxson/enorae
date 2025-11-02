# Database Gap Analysis - Priority Action Plan

**Document:** Priority and Timeline for Fixing Database Schema Mismatches
**Last Updated:** October 29, 2025
**Status:** ACTION REQUIRED

---

## Quick Reference - What's Broken

| Issue | Count | Severity | Impact |
|-------|-------|----------|--------|
| Missing Tables | 14 | CRITICAL | App will crash |
| Missing RPCs | 8 | CRITICAL | Features won't work |
| Affected Features | 6 | CRITICAL | Booking, Messaging, Favorites, Avatars, Notifications, Audit |
| Total Code Files Affected | 140+ | HIGH | Multiple systems broken |

---

## PHASE 1: Immediate Fixes (Week 1)

### Must Fix Before App Can Run

#### 1.1 Create `appointment_services` Table

**Status:** BLOCKING - Appointment booking system won't work
**Affected Files:** 10 files
**Priority:** CRITICAL (P0)
**Estimated Time:** 30 minutes

**Where it's used:**
- Booking creation (customer side)
- Appointment availability checks
- Analytics/reporting

**Suggested Table Structure:**
```sql
CREATE TABLE scheduling.appointment_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES scheduling.appointments(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES catalog.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_id UUID,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_by_id UUID
);

CREATE INDEX idx_appointment_services_appointment_id ON scheduling.appointment_services(appointment_id);
CREATE INDEX idx_appointment_services_service_id ON scheduling.appointment_services(service_id);
```

**Code That Will Fix:**
- `/features/customer/booking/api/mutations/create.ts` - Lines 136-140
- `/features/shared/appointments/api/queries/availability.ts` - Line 153
- `/features/business/analytics/api/queries/top-performers.ts` - Line 36

---

#### 1.2 Create `message_threads` Table

**Status:** BLOCKING - Messaging system won't work
**Affected Files:** 22 files
**Priority:** CRITICAL (P0)
**Estimated Time:** 45 minutes

**Suggested Table Structure:**
```sql
CREATE TABLE communication.message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by_id UUID NOT NULL REFERENCES identity.profiles(id),
  recipient_id UUID NOT NULL,
  subject VARCHAR,
  last_message_at TIMESTAMP WITH TIME ZONE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

CREATE INDEX idx_message_threads_created_by ON communication.message_threads(created_by_id);
CREATE INDEX idx_message_threads_recipient ON communication.message_threads(recipient_id);
CREATE INDEX idx_message_threads_created_at ON communication.message_threads(created_at);
```

**Code Affected:** 22 locations across messaging, appointments, and notifications

---

#### 1.3 Create `customer_favorites` Table

**Status:** BLOCKING - Favorites feature completely broken
**Affected Files:** 5 files
**Priority:** CRITICAL (P0)
**Estimated Time:** 25 minutes

**Suggested Table Structure:**
```sql
CREATE TABLE organization.customer_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES identity.profiles(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES organization.salons(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_id UUID,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_by_id UUID
);

CREATE UNIQUE INDEX idx_customer_favorites_unique ON organization.customer_favorites(customer_id, salon_id);
CREATE INDEX idx_customer_favorites_customer ON organization.customer_favorites(customer_id);
```

**Code Affected:**
- `/features/customer/favorites/api/mutations/favorites.ts` (multiple lines)
- `/features/customer/favorites/api/queries/favorites.ts`

---

#### 1.4 Create `audit_logs` Base Table

**Status:** BLOCKING - Audit logging completely broken
**Affected Files:** 37 files
**Priority:** CRITICAL (P0)
**Estimated Time:** 60 minutes

**Current Issue:** Code tries to insert into `audit_logs` but only partition variants exist

**Suggested Fix (if using partitions):**
```sql
-- Create base table
CREATE TABLE audit.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR NOT NULL,
  entity_id VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  actor_id UUID REFERENCES identity.profiles(id),
  old_values JSONB,
  new_values JSONB,
  reason TEXT,
  created_at TIMESTAMP DEFAULT now()
) PARTITION BY RANGE (DATE_TRUNC('month', created_at));

-- Create default partition for new data
CREATE TABLE audit.audit_logs_default PARTITION OF audit.audit_logs DEFAULT;
```

**OR: Create unified table:**
```sql
CREATE TABLE audit.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR NOT NULL,
  entity_id UUID,
  action VARCHAR NOT NULL,
  actor_id UUID REFERENCES identity.profiles(id),
  old_values JSONB,
  new_values JSONB,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_audit_logs_entity ON audit.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit.audit_logs(created_at);
```

**Code Affected:** 37 locations throughout admin system

---

#### 1.5 Create `avatars` Storage Bucket

**Status:** BLOCKING - Profile avatars won't upload
**Affected Files:** 2 files
**Priority:** CRITICAL (P0)
**Estimated Time:** 10 minutes

**Supabase Storage Action:**
```javascript
// In Supabase console: Storage > New Bucket
// Bucket name: avatars
// Private/Public: Private with authenticated read access
// File size limit: 5MB
```

**Code Pattern Affected:**
```typescript
// /features/shared/profile/api/mutations.ts:120-129
const { data: uploadData } = await supabase.storage.from('avatars').upload(...)
const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(...)
```

---

### Phase 1 Summary

**Time Estimate:** ~2.5 hours
**Impact:** Unblocks core features (booking, messaging, favorites, avatars)

After Phase 1:
- App can start without crashing
- Core customer journeys work
- Admin audit logging functional

---

## PHASE 2: RPC Functions (Week 1-2)

### Create Missing RPC Functions

All 8 functions should be created in the database. Here are the functions needed:

#### 2.1 Notification RPCs (CRITICAL)

**Files Affected:** 4 files
**Impact:** Notifications completely broken

**Create these functions:**

```sql
-- Send notification
CREATE OR REPLACE FUNCTION communication.send_notification(
  p_recipient_id UUID,
  p_message TEXT,
  p_notification_type VARCHAR,
  p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO communication.notifications (
    recipient_id, message, notification_type, metadata, created_at
  ) VALUES (
    p_recipient_id, p_message, p_notification_type, p_metadata, now()
  )
  RETURNING id INTO v_notification_id;

  RETURN jsonb_build_object('id', v_notification_id, 'sent_at', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark notifications as read
CREATE OR REPLACE FUNCTION communication.mark_notifications_read(
  p_user_id UUID,
  p_notification_ids UUID[] DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
  v_count INT;
BEGIN
  UPDATE communication.notifications
  SET read_at = now()
  WHERE user_id = p_user_id
    AND read_at IS NULL
    AND (p_notification_ids IS NULL OR id = ANY(p_notification_ids))
  RETURNING COUNT(*) INTO v_count;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get unread count
CREATE OR REPLACE FUNCTION communication.get_unread_count(p_user_id UUID)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM communication.notifications
    WHERE user_id = p_user_id AND read_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get unread counts by type
CREATE OR REPLACE FUNCTION communication.get_unread_counts(p_user_id UUID)
RETURNS TABLE(notification_type VARCHAR, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.notification_type,
    COUNT(*)
  FROM communication.notifications n
  WHERE n.user_id = p_user_id
    AND n.read_at IS NULL
  GROUP BY n.notification_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get notifications page
CREATE OR REPLACE FUNCTION communication.get_notifications_page(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE(
  id UUID, recipient_id UUID, message TEXT,
  notification_type VARCHAR, read_at TIMESTAMP, created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT n.id, n.recipient_id, n.message, n.notification_type, n.read_at, n.created_at
  FROM communication.notifications n
  WHERE n.user_id = p_user_id
  ORDER BY n.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

#### 2.2 Scheduling RPCs (HIGH)

**Files Affected:** 2 files
**Impact:** Business hours and duration calculations won't work

```sql
-- Calculate business hours
CREATE OR REPLACE FUNCTION scheduling.calculate_business_hours(
  p_salon_id UUID,
  p_date DATE
)
RETURNS TABLE(
  start_time TIME,
  end_time TIME,
  break_start TIME,
  break_end TIME
) AS $$
BEGIN
  RETURN QUERY
  SELECT oh.start_time, oh.end_time, oh.break_start, oh.break_end
  FROM scheduling.operating_hours oh
  WHERE oh.salon_id = p_salon_id
    AND oh.day_of_week = EXTRACT(DOW FROM p_date)
    AND oh.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate duration in minutes
CREATE OR REPLACE FUNCTION catalog.calculate_duration_minutes(p_service_ids UUID[])
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(CAST(EXTRACT(MINUTE FROM duration_range) AS INT)), 0)
    FROM catalog.services
    WHERE id = ANY(p_service_ids)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### Phase 2 Summary

**Time Estimate:** ~3 hours
**Impact:** Enables all notification and scheduling features

---

## PHASE 3: Views and Secondary Tables (Week 2)

### Create Missing Views

#### 3.1 `audit_logs_view` - View for Reading Audit History

**Affected Files:** 4 files
**Priority:** HIGH

```sql
CREATE OR REPLACE VIEW audit.audit_logs_view AS
SELECT
  id,
  entity_type,
  entity_id,
  action,
  actor_id,
  old_values,
  new_values,
  reason,
  created_at
FROM audit.audit_logs
ORDER BY created_at DESC;

GRANT SELECT ON audit.audit_logs_view TO authenticated;
```

---

#### 3.2 `salon_reviews_with_counts_view` - Reviews with Statistics

**Affected Files:** 9 files
**Priority:** HIGH

```sql
CREATE OR REPLACE VIEW engagement.salon_reviews_with_counts_view AS
SELECT
  sr.id,
  sr.salon_id,
  sr.customer_id,
  sr.rating,
  sr.content,
  sr.status,
  sr.created_at,
  sr.updated_at,
  COUNT(*) OVER (PARTITION BY sr.salon_id) as total_reviews,
  AVG(sr.rating::INT)::NUMERIC(3,2) OVER (PARTITION BY sr.salon_id) as average_rating
FROM engagement.salon_reviews sr;

GRANT SELECT ON engagement.salon_reviews_with_counts_view TO authenticated;
```

---

### Create Missing Tables

#### 3.3 `service_booking_rules` Table

**Affected Files:** 5 files
**Priority:** HIGH

```sql
CREATE TABLE catalog.service_booking_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES catalog.services(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES organization.salons(id) ON DELETE CASCADE,
  min_notice_minutes INT DEFAULT 0,
  max_advance_days INT DEFAULT 90,
  requires_deposit BOOLEAN DEFAULT FALSE,
  max_concurrent_bookings INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX idx_service_booking_rules_unique
  ON catalog.service_booking_rules(service_id, salon_id);
```

---

### Phase 3 Summary

**Time Estimate:** ~1.5 hours
**Impact:** Enables view-based reporting and booking rule management

---

## PHASE 4: Pending Implementation (Week 3-4)

### Views to Create When Ready

These are commented out in code pending implementation:

1. **`view_blocked_times_with_relations`** - Blocked times with staff info
2. **`view_notifications`** - User notifications view
3. **`view_profile_metadata`** - Profile metadata view
4. **`view_user_preferences`** - User preferences view

**Action:** Keep commented until implementation is needed

---

## Summary Table

| Phase | Item | Type | Effort | Priority | Timeline |
|-------|------|------|--------|----------|----------|
| 1 | appointment_services | Table | 30m | P0 | Day 1 |
| 1 | message_threads | Table | 45m | P0 | Day 1 |
| 1 | customer_favorites | Table | 25m | P0 | Day 1 |
| 1 | audit_logs (base table) | Table | 60m | P0 | Day 1-2 |
| 1 | avatars | Bucket | 10m | P0 | Day 1 |
| 2 | RPC Functions (8 total) | RPC | 3h | P1 | Week 1-2 |
| 3 | Views (2 critical) | View | 1.5h | P2 | Week 2 |
| 3 | service_booking_rules | Table | 30m | P2 | Week 2 |
| 4 | Pending views (4 total) | View | 1h | P3 | Week 3-4 |

**Total Time:** ~8.5 hours
**Critical Path:** Phases 1-2 (5.5 hours)

---

## Testing Checklist After Fixes

After implementing each phase, run these checks:

```bash
# Phase 1 - After tables created
pnpm db:types                    # Regenerate types
pnpm typecheck                   # Should pass with no errors
pnpm build                       # Build should succeed

# Phase 1 Functional Tests
npm run test -- booking          # Booking creation
npm run test -- messaging        # Message creation
npm run test -- favorites        # Favorite operations
npm run test -- audit            # Audit logging
```

---

## Database Team Handoff

Share this document with database team along with Phase 1 SQL scripts. They should:

1. Review table structures
2. Add appropriate RLS policies
3. Create indexes as specified
4. Verify constraints and relationships
5. Run type regeneration: `pnpm db:types`

---

**Status:** Ready for implementation
**Next Step:** Share SQL with database team and begin Phase 1
