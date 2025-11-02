-- =============================================================================
-- PHASE 2: RPC FUNCTIONS (STORED PROCEDURES)
-- File: 03-PHASE-2-RPC-FUNCTIONS.sql
-- Purpose: Create 8 RPC functions for notifications and scheduling
-- Estimated Duration: 3 hours
-- Timeline: Days 2-3
-- Status: PRODUCTION READY
-- =============================================================================
--
-- PREREQUISITES: Phase 1 must be completed first
--
-- EXECUTION STEPS:
-- 1. Execute all RPC function creates (order doesn't matter)
-- 2. Run verification queries for each function
-- 3. After all functions: pnpm db:types && pnpm typecheck
--
-- RPC FUNCTIONS CREATED:
-- - communication.send_notification (CRITICAL)
-- - communication.mark_notifications_read (HIGH)
-- - communication.get_unread_count (HIGH)
-- - communication.get_unread_counts (HIGH)
-- - communication.get_notifications_page (HIGH)
-- - scheduling.calculate_business_hours (HIGH)
-- - catalog.calculate_duration_minutes (HIGH)
--
-- =============================================================================

BEGIN TRANSACTION;

-- =============================================================================
-- 2.1.1: CREATE send_notification RPC FUNCTION
-- =============================================================================
-- PURPOSE: Insert notification record and return created data
-- IMPACT: Admin notifications completely broken without this
-- FILES AFFECTED: /features/admin/salons/api/mutations/approve-salon.ts
--                 /features/admin/salons/api/mutations/reject-salon.ts
-- =============================================================================

CREATE OR REPLACE FUNCTION communication.send_notification(
  p_recipient_id UUID,
  p_message TEXT,
  p_notification_type VARCHAR,
  p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_notification RECORD;
BEGIN
  -- Validate inputs
  IF p_recipient_id IS NULL THEN
    RAISE EXCEPTION 'recipient_id is required';
  END IF;

  IF p_message IS NULL OR p_message = '' THEN
    RAISE EXCEPTION 'message is required';
  END IF;

  IF p_notification_type IS NULL THEN
    RAISE EXCEPTION 'notification_type is required';
  END IF;

  -- Insert notification
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
    COALESCE(p_metadata, '{}'::jsonb),
    now()
  )
  RETURNING * INTO v_notification;

  -- Return notification as JSON
  RETURN jsonb_build_object(
    'id', v_notification.id,
    'recipient_id', v_notification.user_id,
    'message', v_notification.message,
    'notification_type', v_notification.notification_type,
    'read_at', v_notification.read_at,
    'sent_at', v_notification.created_at
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to send notification: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION communication.send_notification IS
  'Send a notification to a user. Returns created notification as JSON.';

GRANT EXECUTE ON FUNCTION communication.send_notification TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT communication.send_notification(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Test notification',
  'test'
);
-- Expected: JSONB object with id, recipient_id, message, notification_type, read_at, sent_at
-- If error: verify communication.notifications table exists
*/

-- =============================================================================
-- 2.1.2: CREATE mark_notifications_read RPC FUNCTION
-- =============================================================================
-- PURPOSE: Mark user notifications as read (update read_at timestamp)
-- IMPACT: Users cannot mark notifications as read without this
-- FILES AFFECTED: /features/business/notifications/api/mutations/send.ts:105
-- =============================================================================

CREATE OR REPLACE FUNCTION communication.mark_notifications_read(
  p_user_id UUID,
  p_notification_ids UUID[] DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Mark all unread, or specific notification IDs
  UPDATE communication.notifications
  SET
    read_at = now(),
    updated_at = now()
  WHERE user_id = p_user_id
    AND read_at IS NULL
    AND (p_notification_ids IS NULL OR id = ANY(p_notification_ids));

  -- Get count of updated rows
  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN v_count;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to mark notifications as read: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION communication.mark_notifications_read IS
  'Mark user notifications as read. Returns count of updated notifications.';

GRANT EXECUTE ON FUNCTION communication.mark_notifications_read TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT communication.mark_notifications_read(
  '00000000-0000-0000-0000-000000000001'::uuid
);
-- Expected: INTEGER count of marked notifications (0 or greater)
*/

-- =============================================================================
-- 2.1.3: CREATE get_unread_count RPC FUNCTION
-- =============================================================================
-- PURPOSE: Get count of unread notifications for a user
-- IMPACT: Notification badge counts won't work without this
-- FILES AFFECTED: /features/business/notifications/api/queries/notification-counts.ts:25
-- =============================================================================

CREATE OR REPLACE FUNCTION communication.get_unread_count(p_user_id UUID)
RETURNS BIGINT AS $$
  SELECT COUNT(*)::BIGINT
  FROM communication.notifications
  WHERE user_id = p_user_id
    AND read_at IS NULL;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION communication.get_unread_count IS
  'Get count of unread notifications for a user.';

GRANT EXECUTE ON FUNCTION communication.get_unread_count TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT communication.get_unread_count('00000000-0000-0000-0000-000000000001'::uuid);
-- Expected: BIGINT (0 or positive integer)
*/

-- =============================================================================
-- 2.1.4: CREATE get_unread_counts RPC FUNCTION
-- =============================================================================
-- PURPOSE: Get unread count grouped by notification type
-- IMPACT: Notification categorization won't work
-- FILES AFFECTED: /features/business/notifications/api/queries/notification-counts.ts:49
-- =============================================================================

CREATE OR REPLACE FUNCTION communication.get_unread_counts(p_user_id UUID)
RETURNS TABLE(notification_type VARCHAR, unread_count BIGINT) AS $$
  SELECT
    n.notification_type::VARCHAR,
    COUNT(*)::BIGINT as unread_count
  FROM communication.notifications n
  WHERE n.user_id = p_user_id
    AND n.read_at IS NULL
  GROUP BY n.notification_type
  ORDER BY n.notification_type;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION communication.get_unread_counts IS
  'Get unread notification counts grouped by type.';

GRANT EXECUTE ON FUNCTION communication.get_unread_counts TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT * FROM communication.get_unread_counts('00000000-0000-0000-0000-000000000001'::uuid);
-- Expected: TABLE with notification_type and unread_count columns
*/

-- =============================================================================
-- 2.1.5: CREATE get_notifications_page RPC FUNCTION
-- =============================================================================
-- PURPOSE: Get paginated list of user notifications (most recent first)
-- IMPACT: Notification list won't display without this
-- FILES AFFECTED: /features/business/notifications/api/queries/notification-list.ts:40
-- =============================================================================

CREATE OR REPLACE FUNCTION communication.get_notifications_page(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  message TEXT,
  notification_type VARCHAR,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
  SELECT
    n.id,
    n.user_id,
    n.message,
    n.notification_type::VARCHAR,
    n.read_at,
    n.created_at
  FROM communication.notifications n
  WHERE n.user_id = p_user_id
  ORDER BY n.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION communication.get_notifications_page IS
  'Get paginated list of user notifications, most recent first.';

GRANT EXECUTE ON FUNCTION communication.get_notifications_page TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT * FROM communication.get_notifications_page(
  '00000000-0000-0000-0000-000000000001'::uuid,
  20,   -- limit
  0     -- offset
);
-- Expected: TABLE with id, user_id, message, notification_type, read_at, created_at
*/

-- =============================================================================
-- 2.2.1: CREATE calculate_business_hours RPC FUNCTION
-- =============================================================================
-- PURPOSE: Get business hours for a salon on a specific date
-- IMPACT: Business hours calculation won't work without this
-- FILES AFFECTED: /features/business/appointments/api/queries/business-hours.ts:19
-- =============================================================================

CREATE OR REPLACE FUNCTION scheduling.calculate_business_hours(
  p_salon_id UUID,
  p_date DATE
)
RETURNS TABLE(
  day_name VARCHAR,
  is_open BOOLEAN,
  start_time TIME WITHOUT TIME ZONE,
  end_time TIME WITHOUT TIME ZONE,
  break_start TIME WITHOUT TIME ZONE,
  break_end TIME WITHOUT TIME ZONE,
  total_working_minutes INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(p_date, 'Day')::VARCHAR as day_name,
    oh.is_open,
    oh.start_time,
    oh.end_time,
    oh.break_start,
    oh.break_end,
    CASE
      WHEN oh.is_open THEN
        (EXTRACT(HOUR FROM (oh.end_time - oh.start_time))::INTEGER * 60 +
         EXTRACT(MINUTE FROM (oh.end_time - oh.start_time))::INTEGER -
         COALESCE(EXTRACT(HOUR FROM (oh.break_end - oh.break_start))::INTEGER * 60, 0) -
         COALESCE(EXTRACT(MINUTE FROM (oh.break_end - oh.break_start))::INTEGER, 0))::INTEGER
      ELSE 0
    END as total_working_minutes
  FROM scheduling.operating_hours oh
  WHERE oh.salon_id = p_salon_id
    AND oh.day_of_week = EXTRACT(DOW FROM p_date)::INTEGER
    AND oh.is_active = TRUE
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION scheduling.calculate_business_hours IS
  'Get business hours for a salon on a specific date.';

GRANT EXECUTE ON FUNCTION scheduling.calculate_business_hours TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT * FROM scheduling.calculate_business_hours(
  '00000000-0000-0000-0000-000000000001'::uuid,
  CURRENT_DATE
);
-- Expected: TABLE with day_name, is_open, start_time, end_time, break_start, break_end, total_working_minutes
-- If no results: salon or operating_hours record doesn't exist (expected if test data missing)
*/

-- =============================================================================
-- 2.2.2: CREATE calculate_duration_minutes RPC FUNCTION
-- =============================================================================
-- PURPOSE: Calculate total duration in minutes for a list of services
-- IMPACT: Service duration calculations won't work
-- FILES AFFECTED: /features/business/appointments/api/queries/business-hours.ts:39
-- =============================================================================

CREATE OR REPLACE FUNCTION catalog.calculate_duration_minutes(
  p_service_ids UUID[]
)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(
      EXTRACT(HOUR FROM s.duration_range)::INTEGER * 60 +
      EXTRACT(MINUTE FROM s.duration_range)::INTEGER
    )::INTEGER
    FROM catalog.services s
    WHERE s.id = ANY(p_service_ids)
      AND s.is_active = TRUE),
    0
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION catalog.calculate_duration_minutes IS
  'Calculate total duration in minutes for a list of service IDs.';

GRANT EXECUTE ON FUNCTION catalog.calculate_duration_minutes TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT catalog.calculate_duration_minutes(
  ARRAY['00000000-0000-0000-0000-000000000001'::uuid]
);
-- Expected: INTEGER (0 or positive)
-- Returns 0 if services don't exist (expected if test data missing)
*/

-- =============================================================================
-- COMMIT TRANSACTION
-- =============================================================================

COMMIT;

-- =============================================================================
-- PHASE 2 COMPLETE!
-- =============================================================================
-- After Phase 2, regenerate TypeScript types:
--   pnpm db:types
-- Then run typecheck:
--   pnpm typecheck
-- Should see zero errors!
--
-- If you see errors about notifications table, verify that
-- communication.notifications table exists in the database.
-- =============================================================================
