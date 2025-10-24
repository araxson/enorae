-- Supabase advisor remediation (view security, privileges, auth config) captured on 2025-11-16
BEGIN;

-- Ensure SECURITY INVOKER semantics for advisor-flagged views
ALTER VIEW public.service_pricing_view SET (security_invoker = true);
ALTER VIEW public.salon_chains_view SET (security_invoker = true);
ALTER VIEW analytics.partition_health_summary_view SET (security_invoker = true);
ALTER VIEW public.customer_favorites_view SET (security_invoker = true);
ALTER VIEW public.partition_documentation SET (security_invoker = true);
ALTER VIEW analytics.partition_health_view SET (security_invoker = true);
ALTER VIEW analytics.partition_automation_status_view SET (security_invoker = true);
ALTER VIEW public.communication_message_threads_view SET (security_invoker = true);
ALTER VIEW public.partition_health_status SET (security_invoker = true);
ALTER VIEW public.materialized_view_refresh_schedule_view SET (security_invoker = true);
ALTER VIEW public.partition_details SET (security_invoker = true);
ALTER VIEW public.services_view SET (security_invoker = true);
ALTER VIEW public.admin_messages_overview_view SET (security_invoker = true);

-- Remove API exposure for internal materialized views
REVOKE SELECT ON analytics.salon_metrics_summary_mv FROM authenticated, anon;
REVOKE SELECT ON organization.salon_metrics_summary_mv FROM authenticated, anon;
REVOKE SELECT ON analytics.customer_lifetime_value_mv FROM authenticated, anon;

-- Lock function search_path to prevent hijacking via mutable search_path
ALTER FUNCTION archive.count_archivable_records() SET search_path = 'pg_temp';
ALTER FUNCTION archive.count_archivable_records(text, text, timestamp with time zone) SET search_path = 'pg_temp';

-- Ensure leaked password protection remains enforced in auth config
UPDATE auth.instances
SET raw_base_config = (
      raw_base_config::jsonb
        || jsonb_build_object(
             'SECURITY',
             coalesce(raw_base_config::jsonb -> 'SECURITY', '{}'::jsonb)
               || jsonb_build_object('HIBP_ENABLED', true, 'HIBP_ENFORCED', true)
           )
    )::text,
    updated_at = NOW()
WHERE coalesce(raw_base_config::jsonb -> 'SECURITY' ->> 'HIBP_ENABLED', 'false') <> 'true'
   OR coalesce(raw_base_config::jsonb -> 'SECURITY' ->> 'HIBP_ENFORCED', 'false') <> 'true';

COMMIT;
