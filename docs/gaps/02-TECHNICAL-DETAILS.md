# Technical Details - Database Gap Analysis

**Document:** Detailed analysis of each gap with code locations
**Last Updated:** October 29, 2025

---

## Table of Contents

1. [Critical Tables Missing](#critical-tables-missing)
2. [RPC Functions Missing](#rpc-functions-missing)
3. [Property Access Issues](#property-access-issues)
4. [Schema Usage Patterns](#schema-usage-patterns)

---

## Critical Tables Missing

### 1. `appointment_services` Table

**Status:** CRITICAL
**Code Files Affected:** 10
**Total Code References:** 10

#### Locations Where Used

**1.1 Customer Booking - Creating Appointment**

File: `/features/customer/booking/api/mutations/create.ts`
Lines: 136-140

```typescript
const { data: appointmentServices, error: serviceInsertError } = await supabase
  .from('appointment_services')
  .insert(appointmentServiceData)

if (serviceInsertError) {
  // Rollback appointment creation
}
```

**What it does:** Attaches services to appointment after booking

**Expected Data Structure:**
```typescript
interface AppointmentService {
  appointment_id: string
  service_id: string
  staff_id?: string
  duration_minutes?: number
}
```

---

**1.2 Availability Checking - Services for Staff**

File: `/features/shared/appointments/api/queries/availability.ts`
Line: 153

```typescript
const { data: appointmentServices } = await supabase
  .from('appointment_services')
  .select('id')
  .eq('staff_id', staffId)
  .neq('status', 'cancelled')
```

**What it does:** Checks which services staff member is booked for during time range

---

**1.3 Analytics - Top Performers by Service**

File: `/features/business/analytics/api/queries/top-performers.ts`
Line: 36

```typescript
const { data: appointmentServices } = await supabase
  .from('appointment_services')
  .select('id, staff_id, service_id')
  .in('appointment_id', appointmentIds)
```

**What it does:** Analyzes which staff perform which services

---

**Other Locations:**
- `/features/admin/appointments/api/queries/snapshot.ts` - Line 234
- `/features/business/appointments/api/queries/appointment-services.ts` - Line 34
- `/features/staff/appointments/api/mutations.ts` - Line 283
- `/features/business/appointments/components/appointment-services-manager.tsx` - Line 89
- 3 additional files

#### Recommended Table Schema

```sql
CREATE TABLE scheduling.appointment_services (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys
  appointment_id UUID NOT NULL REFERENCES scheduling.appointments(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES catalog.services(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES identity.staff_profiles(id),

  -- Service info
  service_name VARCHAR(255),
  duration_minutes INT,
  price_at_time NUMERIC(10, 2),

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_id UUID REFERENCES identity.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_by_id UUID REFERENCES identity.profiles(id),

  -- Indexes
  CONSTRAINT valid_appointment_service CHECK (appointment_id IS NOT NULL AND service_id IS NOT NULL)
);

-- Essential indexes
CREATE INDEX idx_appointment_services_appointment_id
  ON scheduling.appointment_services(appointment_id);
CREATE INDEX idx_appointment_services_service_id
  ON scheduling.appointment_services(service_id);
CREATE INDEX idx_appointment_services_staff_id
  ON scheduling.appointment_services(staff_id);
CREATE INDEX idx_appointment_services_created_at
  ON scheduling.appointment_services(created_at);
```

#### RLS Policy Suggestion

```sql
CREATE POLICY "Users can view appointment services for their appointments"
  ON scheduling.appointment_services FOR SELECT
  USING (
    appointment_id IN (
      SELECT a.id FROM scheduling.appointments a
      WHERE a.customer_id = auth.uid()
         OR a.salon_id IN (
           SELECT s.id FROM organization.salons s
           WHERE s.organization_id = (
             SELECT organization_id FROM identity.staff_profiles
             WHERE user_id = auth.uid()
           )
         )
    )
  );
```

---

### 2. `message_threads` Table

**Status:** CRITICAL
**Code Files Affected:** 22
**Total Code References:** 22

#### Overview

This table is the backbone of the messaging system. Without it, no messaging functionality works at all.

#### Locations Where Used

**2.1 Creating Message Thread**

File: `/features/shared/messaging/api/mutations/create.ts`
Line: 74

```typescript
const { data: threadData, error: threadError } = await supabase
  .schema('communication')
  .from('message_threads')
  .insert({
    created_by_id: session.user.id,
    recipient_id: recipientId,
    subject: threadSubject,
  })
```

---

**2.2 Getting Thread List**

File: `/features/shared/messaging/api/queries.ts`
Line: 35

```typescript
const { data: threads } = await supabase
  .from('message_threads')
  .select('*')
  .eq('created_by_id', userId)
  .order('last_message_at', { ascending: false })
```

---

**2.3 Appointment Messages**

File: `/features/customer/appointments/api/mutations/appointments.ts`
Line: 203

```typescript
const { data: threadData, error: threadError } = await supabase
  .schema('communication')
  .from('message_threads')
  .select('id')
  .eq('created_by_id', customerId)
  .eq('recipient_id', salonId)
  .maybeSingle()
```

**What it does:** Creates message thread for appointment questions

---

**2.4 Staff Appointments Messages**

File: `/features/staff/appointments/api/mutations.ts`
Lines: 169, 186

```typescript
const { data: existingThread } = await supabase
  .schema('communication')
  .from('message_threads')
  .select('id')
  .eq('created_by_id', salonId)
  .eq('recipient_id', session.user.id)
  .maybeSingle()
```

---

**Other High-Impact Locations:**
- `/features/shared/messaging/api/mutations/` (5 files)
- `/features/business/notifications/api/mutations/send.ts` - Line 200
- `/features/staff/messages/` (multiple files)

#### Recommended Table Schema

```sql
CREATE TABLE communication.message_threads (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants
  created_by_id UUID NOT NULL REFERENCES identity.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES identity.profiles(id) ON DELETE CASCADE,

  -- Thread info
  subject VARCHAR(500),
  description TEXT,

  -- Status
  is_archived BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count INT DEFAULT 0,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,

  -- Relationships
  salon_id UUID REFERENCES organization.salons(id),
  appointment_id UUID REFERENCES scheduling.appointments(id),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Essential indexes
CREATE INDEX idx_message_threads_created_by
  ON communication.message_threads(created_by_id);
CREATE INDEX idx_message_threads_recipient
  ON communication.message_threads(recipient_id);
CREATE INDEX idx_message_threads_created_at
  ON communication.message_threads(created_at);
CREATE INDEX idx_message_threads_last_message_at
  ON communication.message_threads(last_message_at);
CREATE INDEX idx_message_threads_salon
  ON communication.message_threads(salon_id);
CREATE INDEX idx_message_threads_appointment
  ON communication.message_threads(appointment_id);

-- Unique constraint to prevent duplicate threads
CREATE UNIQUE INDEX idx_message_threads_unique_pair
  ON communication.message_threads(
    LEAST(created_by_id, recipient_id),
    GREATEST(created_by_id, recipient_id)
  )
  WHERE is_deleted IS FALSE;
```

---

### 3. `customer_favorites` Table

**Status:** CRITICAL
**Code Files Affected:** 5
**Total Code References:** 5

#### Overview

Stores which salons customers have marked as favorites, including personal notes.

#### Key Locations

**3.1 Toggle Favorite**

File: `/features/customer/favorites/api/mutations/favorites.ts`
Lines: 58, 89, 116

```typescript
// Update notes
const { error } = await supabase
  .from('customer_favorites')
  .update({
    notes: validatedNotes,
    updated_at: new Date().toISOString(),
  })
  .eq('id', typedExisting.id)

// Delete favorite
const { error } = await supabase
  .from('customer_favorites')
  .delete()
  .eq('id', typedExisting.id)
  .eq('customer_id', session.user.id)

// Add favorite
const { data, error } = await supabase
  .from('customer_favorites')
  .insert({
    customer_id: session.user.id,
    salon_id: validatedSalonId,
    notes: validatedNotes || null,
  })
```

---

**3.2 Reading Favorites**

File: `/features/customer/favorites/api/queries/favorites.ts`
Line: 18

```typescript
const { data: favorites } = await supabase
  .from('customer_favorites_view')
  .select('*')
  .eq('customer_id', session.user.id)
```

---

#### Recommended Schema

```sql
CREATE TABLE engagement.customer_favorites (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys
  customer_id UUID NOT NULL REFERENCES identity.profiles(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES organization.salons(id) ON DELETE CASCADE,

  -- Personal data
  notes TEXT,
  rating INT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  is_favorite BOOLEAN DEFAULT TRUE,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_id UUID REFERENCES identity.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_by_id UUID REFERENCES identity.profiles(id)
);

-- Essential indexes
CREATE UNIQUE INDEX idx_customer_favorites_unique
  ON engagement.customer_favorites(customer_id, salon_id)
  WHERE is_favorite = TRUE;
CREATE INDEX idx_customer_favorites_customer
  ON engagement.customer_favorites(customer_id);
CREATE INDEX idx_customer_favorites_salon
  ON engagement.customer_favorites(salon_id);

-- View for easier querying
CREATE VIEW engagement.customer_favorites_view AS
SELECT
  cf.id,
  cf.customer_id,
  cf.salon_id,
  cf.notes,
  cf.rating,
  s.name as salon_name,
  s.slug as salon_slug,
  s.description,
  cf.created_at,
  cf.updated_at
FROM engagement.customer_favorites cf
LEFT JOIN organization.salons s ON s.id = cf.salon_id
WHERE cf.is_favorite = TRUE;
```

---

### 4. `audit_logs` Table

**Status:** CRITICAL
**Code Files Affected:** 37
**Total Code References:** 37+

#### Overview

Core audit trail for admin actions. Current code attempts to insert into `audit_logs` but the base table doesn't exist (only partitioned variants do).

#### Key Operations

**4.1 Recording Audit Entry**

File: `/features/admin/admin-common/api/audit.ts`
Line: 26

```typescript
const { error } = await supabase
  .schema('audit')
  .from('audit_logs')
  .insert({
    entity_type: 'salon',
    entity_id: salonId,
    action: 'approved',
    actor_id: session.user.id,
    old_values: oldState,
    new_values: newState,
    reason: approvalReason,
  })
```

---

**4.2 Reading Audit History**

File: `/features/admin/profile/api/queries/data.ts`
Line: 95

```typescript
const { data: auditEntries } = await supabase
  .from('audit_logs_view')
  .select('*')
  .eq('entity_id', profileId)
  .order('created_at', { ascending: false })
```

---

#### Affected Admin Actions (Sample)

These admin mutations all need audit logging:
- Salon approval/rejection
- User ban/reactivate
- Role assignment
- Staff management
- Financial adjustments
- Review moderation
- And 30+ more

#### Recommended Schema

```sql
-- Option 1: Simple unified table (if not using partitions)
CREATE TABLE audit.audit_logs (
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

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for common queries
CREATE INDEX idx_audit_logs_entity
  ON audit.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor
  ON audit.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at
  ON audit.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action
  ON audit.audit_logs(action);

-- View for reading
CREATE VIEW audit.audit_logs_view AS
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
  p.username as actor_username
FROM audit.audit_logs al
LEFT JOIN identity.profiles p ON p.id = al.actor_id
ORDER BY al.created_at DESC;

GRANT SELECT ON audit.audit_logs_view TO authenticated;
```

**Option 2: With Partitioning (if high volume expected)**

```sql
-- Create partitioned base table
CREATE TABLE audit.audit_logs (
  id BIGSERIAL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  action VARCHAR(100) NOT NULL,
  actor_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  old_values JSONB,
  new_values JSONB,
  reason TEXT,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (DATE_TRUNC('month', created_at));

-- Create partitions for current and next 6 months
CREATE TABLE audit.audit_logs_2025_10 PARTITION OF audit.audit_logs
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE audit.audit_logs_2025_11 PARTITION OF audit.audit_logs
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- ... create more as needed
```

---

### 5. `avatars` Storage Bucket

**Status:** CRITICAL
**Code Files Affected:** 2
**Total Code References:** 2

#### Overview

Supabase Storage bucket for user profile avatars. This is NOT a database table but a storage resource.

#### Key Locations

**5.1 Upload Avatar**

File: `/features/shared/profile/api/mutations.ts`
Line: 120

```typescript
const { data: uploadData, error: uploadError } = await supabase
  .storage
  .from('avatars')
  .upload(fileName, file, {
    upsert: true,
  })
```

---

**5.2 Get Public URL**

File: `/features/shared/profile/api/mutations.ts`
Line: 129

```typescript
const { data: publicData } = supabase
  .storage
  .from('avatars')
  .getPublicUrl(uploadData.path)
```

---

#### Setup Instructions (Supabase Console)

1. Navigate to Storage in Supabase Console
2. Create new bucket named `avatars`
3. Configure policies:
   - **SELECT (Read):** Authenticated users can view
   - **INSERT (Upload):** Users can upload to `${auth.uid()}/` prefix
   - **UPDATE (Update):** Users can update their own uploads
   - **DELETE (Delete):** Users can delete their own uploads

4. Set file size limit: 5MB

#### RLS Policies

```sql
-- Allow authenticated users to view avatars
CREATE POLICY "Authenticated users can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow users to upload to their own folder
CREATE POLICY "Users can upload avatars to their folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## RPC Functions Missing

### 1. Notification Functions (CRITICAL)

#### `communication.send_notification`

**Status:** CRITICAL - Will cause notification failures
**Accessed:** `/features/admin/salons/api/mutations/approve-salon.ts:91`

**Current Code:**
```typescript
await supabase.rpc('communication.send_notification', {
  recipient_id: ownerId,
  message: `Your salon has been approved`,
  notification_type: 'salon_approval',
})
```

**Recommended Implementation:**
```sql
CREATE OR REPLACE FUNCTION communication.send_notification(
  p_recipient_id UUID,
  p_message TEXT,
  p_notification_type VARCHAR,
  p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_notification_id UUID;
  v_notification RECORD;
BEGIN
  -- Insert into notifications table
  INSERT INTO communication.notifications (
    user_id,
    message,
    notification_type,
    metadata,
    created_at
  ) VALUES (
    p_recipient_id,
    p_message,
    p_notification_type,
    p_metadata,
    now()
  )
  RETURNING * INTO v_notification;

  -- Could also trigger email/push here
  RETURN jsonb_build_object(
    'id', v_notification.id,
    'recipient_id', v_notification.user_id,
    'sent_at', now(),
    'message', p_message,
    'type', p_notification_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
ROWS 1
SET search_path = public;
```

---

#### `send_notification`

**Status:** CRITICAL
**Accessed:** `/features/business/notifications/api/mutations/send.ts:52`

Similar to above but different naming convention.

---

#### `mark_notifications_read`

**Status:** HIGH
**Accessed:** `/features/business/notifications/api/mutations/send.ts:105`

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION communication.mark_notifications_read(
  p_user_id UUID,
  p_notification_ids UUID[] DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
  v_count INT := 0;
BEGIN
  UPDATE communication.notifications
  SET
    read_at = now(),
    updated_at = now()
  WHERE user_id = p_user_id
    AND read_at IS NULL
    AND (p_notification_ids IS NULL OR id = ANY(p_notification_ids));

  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

#### `get_unread_count`

**Status:** HIGH
**Accessed:** `/features/business/notifications/api/queries/notification-counts.ts:25`

```sql
CREATE OR REPLACE FUNCTION communication.get_unread_count(p_user_id UUID)
RETURNS BIGINT AS $$
  SELECT COUNT(*)::BIGINT
  FROM communication.notifications
  WHERE user_id = p_user_id
    AND read_at IS NULL;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
```

---

#### `get_unread_counts`

**Status:** HIGH
**Accessed:** `/features/business/notifications/api/queries/notification-counts.ts:49`

```sql
CREATE OR REPLACE FUNCTION communication.get_unread_counts(p_user_id UUID)
RETURNS TABLE(notification_type VARCHAR, unread_count BIGINT) AS $$
  SELECT
    notification_type::VARCHAR,
    COUNT(*)::BIGINT as unread_count
  FROM communication.notifications
  WHERE user_id = p_user_id
    AND read_at IS NULL
  GROUP BY notification_type;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
```

---

#### `get_notifications_page`

**Status:** HIGH
**Accessed:** `/features/business/notifications/api/queries/notification-list.ts:40`

```sql
CREATE OR REPLACE FUNCTION communication.get_notifications_page(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  message TEXT,
  notification_type VARCHAR,
  read_at TIMESTAMP,
  created_at TIMESTAMP
) AS $$
  SELECT
    n.id,
    n.user_id,
    n.message,
    n.notification_type,
    n.read_at,
    n.created_at
  FROM communication.notifications n
  WHERE n.user_id = p_user_id
  ORDER BY n.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
```

---

### 2. Scheduling Functions (HIGH)

#### `calculate_business_hours`

**Status:** HIGH
**Accessed:** `/features/business/appointments/api/queries/business-hours.ts:19`

```sql
CREATE OR REPLACE FUNCTION scheduling.calculate_business_hours(
  p_salon_id UUID,
  p_date DATE
)
RETURNS TABLE(
  day_name VARCHAR,
  is_open BOOLEAN,
  start_time TIME,
  end_time TIME,
  break_start TIME,
  break_end TIME,
  total_working_minutes INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(p_date, 'Day')::VARCHAR,
    oh.is_open,
    oh.start_time,
    oh.end_time,
    oh.break_start,
    oh.break_end,
    (EXTRACT(HOUR FROM oh.end_time - oh.start_time)::INT * 60 +
     EXTRACT(MINUTE FROM oh.end_time - oh.start_time)::INT -
     COALESCE(EXTRACT(HOUR FROM oh.break_end - oh.break_start)::INT * 60, 0) -
     COALESCE(EXTRACT(MINUTE FROM oh.break_end - oh.break_start)::INT, 0))::INT
  FROM scheduling.operating_hours oh
  WHERE oh.salon_id = p_salon_id
    AND oh.day_of_week = EXTRACT(DOW FROM p_date)::INT
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

---

#### `calculate_duration_minutes`

**Status:** HIGH
**Accessed:** `/features/business/appointments/api/queries/business-hours.ts:39`

```sql
CREATE OR REPLACE FUNCTION catalog.calculate_duration_minutes(
  p_service_ids UUID[]
)
RETURNS INT AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(
      EXTRACT(HOUR FROM s.duration_range)::INT * 60 +
      EXTRACT(MINUTE FROM s.duration_range)::INT
    )::INT
    FROM catalog.services s
    WHERE s.id = ANY(p_service_ids)
    AND s.is_active = TRUE),
    0
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

---

## Property Access Issues

### Overview

Beyond missing tables/views, there are property access patterns that could cause runtime errors if columns don't exist in the database.

### Common Patterns Found

**Pattern 1: Direct Property Access**
```typescript
const status = row.status
const name = row.name
const created = row.created_at
```

**Pattern 2: Nullish Coalescing**
```typescript
const value = row.column_name ?? defaultValue
const safe = row.property || 'fallback'
```

**Pattern 3: Optional Chaining**
```typescript
const nested = row.metadata?.field
const safe = row?.optional_column
```

### High-Risk Files for Property Access Issues

File: `/features/admin/security-incidents/api/queries/data.ts`
Lines: 35-50

```typescript
// This file accesses many properties without null checks
const metadata = (row.metadata as Record<string, unknown> | null) ?? {}
const description: row.error_message ?? (metadata['description'] as string) ?? ''

// These properties may not exist:
// - error_message
// - severity
// - entity_id
// - impacted_resources
```

---

**File: `/features/admin/statistics-freshness/api/queries/data.ts`**
Lines: 40-60

```typescript
// Property access on view results
const schemaname = String(row.schemaname ?? 'public')
const tablename = String(row.tablename ?? 'unknown')
const last_analyze: row.last_analyze ?? new Date().toISOString()
const row_estimate: row.live_rows ?? 0
const dead_rows: row.rows_modified_since_analyze ?? 0

// Risky - what if these views don't return these columns?
```

---

## Schema Usage Patterns

### Schemas in Use

| Schema | Purpose | Usage Count | Status |
|--------|---------|------------|--------|
| `identity` | Auth, users, profiles | 93 files | Core - WORKING |
| `organization` | Salons, staff, locations | 82 files | Core - MOSTLY WORKING |
| `scheduling` | Appointments, schedules | 71 files | Core - MISSING appointment_services |
| `communication` | Messaging, notifications | 54 files | BROKEN - Missing message_threads & RPCs |
| `audit` | Audit logging | 36 files | BROKEN - Missing audit_logs base table |
| `catalog` | Services, pricing | 31 files | Core - MOSTLY WORKING |
| `engagement` | Reviews, ratings | 30 files | Core - needs salon_reviews_with_counts_view |
| `security` | Monitoring, rate limits | 9 files | Secondary - WORKING |
| `analytics` | Metrics | 7 files | Secondary - WORKING |
| `public` | Public data | 4 files | Limited use - WORKING |

---

**Report Generated:** October 29, 2025
**Next Action:** Review with database team and begin Phase 1 implementation
