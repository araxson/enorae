# Admin Portal - Implementation Tasks

## Summary
- Total database views available: 60
- Currently implemented features: 17
- Missing features: 10+
- Coverage: ~70% of admin-relevant functionality

## CRITICAL Priority Tasks

### Finance/Revenue Management
**Database View**: `admin_revenue_overview`, `manual_transactions`
**Schema**: `scheduling.manual_transactions`, analytics tables
**Missing Operations**:
- [x] Platform-wide revenue analytics
- [x] Revenue by salon/chain
- [x] Transaction monitoring
- [x] Payment processing oversight
- [x] Refund management
- [x] Financial reports/exports

**Related Database Functions**:
- N/A (view-based aggregations)

**Implementation Steps**:
1. View exists: `admin_revenue_overview`
2. Create comprehensive finance dashboard
3. Add transaction drill-down capabilities
4. Implement revenue forecasting
5. Add export functionality for accounting
6. Create refund workflow
7. Add payment gateway monitoring

**Data Relationships to Surface**:
- Salons → revenue
- Transactions → payment status
- Refunds → original transactions
- Revenue → time periods
- Platform fees → calculations

---

### Chains Management Enhanced
**Database View**: `salon_chains`, `salon_chains_view`, `salon_chains_summary`
**Schema**: `organization.salon_chains`
**Missing Operations**:
- [x] Approve/verify chains
- [x] Chain-wide analytics
- [x] Chain compliance monitoring
- [x] Manage chain hierarchies
- [x] Chain billing/subscriptions

**Related Database Functions**:
- `organization.salon_chains_insert()` - Trigger on creation
- `organization.salon_chains_update()` - Trigger on update
- `organization.salon_chains_delete()` - Trigger on deletion

**Implementation Steps**:
1. Feature exists at `features/admin/chains/` - enhance
2. Add chain verification workflow
3. Create chain-level analytics
4. Add chain compliance dashboard
5. Implement chain billing
6. Add chain health monitoring

**Data Relationships to Surface**:
- Chain → salons (one-to-many)
- Chain → owner
- Chain → verification status
- Chain → aggregate metrics

---

### Profile Management
**Database View**: `profiles`, `profiles_metadata`, `profiles_preferences`
**Schema**: `identity.profiles`
**Missing Operations**:
- [x] View user profile details
- [x] Edit user profiles (support)
- [x] Manage user metadata
- [x] View user preferences
- [x] User profile search

**Related Database Functions**:
- `identity.get_profile_summary(p_user_id)` - Get profile summary
- `identity.anonymize_user(p_user_id)` - GDPR anonymization

**Implementation Steps**:
1. Page exists: `app/(admin)/admin/profile/page.tsx`
2. Create admin profile viewer
3. Add profile editing for support
4. Implement profile search
5. Add user anonymization (GDPR)
6. Display user activity summary

**Data Relationships to Surface**:
- Profile → roles
- Profile → metadata
- Profile → preferences
- Profile → activity history

---

## HIGH Priority Tasks

### Security Monitoring Enhanced
**Database View**: `audit_logs`, `security_audit_log`
**Schema**: `identity.audit_logs`, `security.security_events`
**Missing Operations**:
- [x] Real-time security dashboard
- [x] Suspicious activity detection
- [x] Failed login tracking
- [x] Rate limit violations
- [x] IP blocking/allowlisting
- [x] Security incident response

**Related Database Functions**:
- `security.log_security_event(p_event_type, p_severity, p_description, p_metadata)` - Log events
- `security.get_security_metrics()` - Get security metrics
- `identity.detect_access_anomaly(p_user_id)` - Detect anomalies
- `public.log_security_event(p_event_type, p_severity, p_metadata)` - Public log function

**Implementation Steps**:
1. Page exists: `app/(admin)/admin/security/monitoring/page.tsx`
2. Create real-time security dashboard
3. Add anomaly detection alerts
4. Implement IP management
5. Add incident response workflows
6. Create security reports

**Data Relationships to Surface**:
- Events → severity
- Events → user/IP
- Events → timestamp
- Patterns → anomalies
- IPs → block/allow status

---

### Inventory Overview Platform-Wide
**Database View**: `admin_inventory_overview`, `stock_levels`, `stock_alerts`, `products`
**Schema**: `inventory` schema
**Missing Operations**:
- [x] Platform-wide inventory insights
- [x] Low stock alerts across salons
- [x] Product catalog management
- [x] Supplier management
- [x] Inventory valuation

**Related Database Functions**:
- `inventory.check_availability(p_product_id, p_location_id, p_quantity)` - Check availability

**Implementation Steps**:
1. Feature exists at `features/admin/inventory/` - enhance
2. Add platform-wide inventory dashboard
3. Create low stock alert system
4. Add product catalog management
5. Implement supplier oversight
6. Add inventory valuation reports

**Data Relationships to Surface**:
- Products → salons using
- Stock levels → alerts
- Products → suppliers
- Inventory → value

---

### Messages/Communication Monitoring
**Database View**: `admin_messages_overview`, `messages`, `message_threads`
**Schema**: `communication.messages`
**Missing Operations**:
- [x] Platform-wide message statistics
- [x] Spam/abuse detection
- [x] Message content moderation
- [x] User reporting resolution
- [x] Message analytics

**Related Database Functions**:
- `communication.get_unread_counts(p_user_id)` - Get counts

**Implementation Steps**:
1. Feature exists at `features/admin/messages/` - enhance
2. Add message moderation dashboard
3. Implement abuse detection
4. Create reporting system
5. Add message analytics
6. Implement content filtering

**Data Relationships to Surface**:
- Messages → flagged content
- Threads → participants
- Messages → response times
- Reports → resolution status

---

### Appointment Oversight Enhanced
**Database View**: `admin_appointments_overview`, `appointments`
**Schema**: `scheduling.appointments`
**Missing Operations**:
- [x] Platform-wide appointment analytics
- [x] Cancellation pattern analysis
- [x] No-show tracking
- [x] Appointment fraud detection
- [x] Dispute resolution

**Related Database Functions**:
- `scheduling.get_appointment_stats(p_salon_id, p_start_date, p_end_date)` - Get statistics
- `scheduling.batch_update_appointment_status(p_appointment_ids[], p_new_status, p_reason)` - Bulk updates

**Implementation Steps**:
1. Feature exists at `features/admin/appointments/` - enhance
2. Add fraud detection algorithms
3. Create dispute resolution workflow
4. Add pattern analysis for cancellations
5. Implement no-show tracking
6. Create appointment health metrics

**Data Relationships to Surface**:
- Appointments → patterns
- Cancellations → reasons
- No-shows → customer/salon
- Disputes → resolution

---

### Analytics Platform-Wide
**Database View**: `admin_analytics_overview`, multiple analytics tables
**Schema**: `analytics` schema
**Missing Operations**:
- [x] Platform growth metrics
- [x] User acquisition analytics
- [x] Retention/churn analysis
- [x] Feature usage analytics
- [x] Performance benchmarks

**Related Database Functions**:
- `analytics.calculate_daily_metrics()` - Daily metrics
- `analytics.refresh_daily_metrics()` - Refresh metrics

**Implementation Steps**:
1. Feature exists at `features/admin/analytics/`
2. Create platform growth dashboard
3. Add user acquisition funnels
4. Implement cohort analysis
5. Add feature usage tracking
6. Create performance benchmarks

**Data Relationships to Surface**:
- Platform → growth metrics
- Users → acquisition sources
- Features → usage rates
- Salons → performance tiers

---

## MEDIUM Priority Tasks

### Salon Staff Overview
**Database View**: `admin_staff_overview`, `staff`, `staff_profiles`
**Schema**: `organization.staff`
**Missing Operations**:
- [x] Platform-wide staff statistics
- [x] Staff verification/background checks
- [x] Staff performance benchmarks
- [x] Staff licensing/certification tracking
- [x] Staff compliance monitoring

**Implementation Steps**:
1. View exists: `admin_staff_overview`
2. Create staff oversight dashboard
3. Add verification workflow
4. Implement certification tracking
5. Add compliance monitoring
6. Create staff performance reports

**Data Relationships to Surface**:
- Staff → verification status
- Staff → certifications
- Staff → performance metrics
- Staff → compliance status

---

### Reviews Moderation Enhanced
**Database View**: `admin_reviews_overview`, `salon_reviews`
**Schema**: `engagement.salon_reviews`
**Missing Operations**:
- [x] Platform-wide review statistics (exists)
- [x] Fake review detection
- [x] Review sentiment analysis
- [x] Reviewer reputation tracking
- [x] Review quality scoring

**Related Database Functions**:
- `engagement.get_salon_rating_stats(p_salon_id)` - Rating statistics

**Implementation Steps**:
1. Feature exists at `features/admin/moderation/` - enhance
2. Add fake review detection
3. Implement sentiment analysis
4. Add reviewer reputation system
5. Create quality scoring
6. Add review pattern analysis

**Data Relationships to Surface**:
- Reviews → authenticity score
- Reviews → sentiment
- Reviewers → reputation
- Reviews → quality metrics

---

### Salon Verification & Compliance
**Database View**: `admin_salons_overview`, `salons`
**Schema**: `organization.salons`
**Missing Operations**:
- [x] Salon verification workflow (exists)
- [x] Compliance monitoring
- [x] License expiration tracking
- [x] Quality assurance checks
- [x] Salon health scores

**Related Database Functions**:
- `public.validate_salon_data()` - Validate salon data

**Implementation Steps**:
1. Feature exists at `features/admin/salons/` - enhance
2. Add compliance dashboard
3. Create license tracking
4. Implement quality assurance workflows
5. Add salon health scoring
6. Create verification checklists

**Data Relationships to Surface**:
- Salon → verification status
- Salon → licenses/permits
- Salon → compliance score
- Salon → health metrics

---

### User Role Management Enhanced
**Database View**: `user_roles`
**Schema**: `identity.user_roles`
**Missing Operations**:
- [x] View all user roles (exists)
- [x] Bulk role assignment
- [x] Role history/audit
- [x] Custom role creation
- [x] Permission management

**Related Database Functions**:
- `identity.update_role_active_status()` - Update role status
- `public.has_role(user_id, role_name)` - Check role
- `public.user_has_any_role(allowed_roles[])` - Check multiple roles

**Implementation Steps**:
1. Feature exists at `features/admin/roles/` - enhance
2. Add bulk role operations
3. Create role audit trail
4. Implement custom role builder
5. Add permission matrix editor
6. Create role templates

**Data Relationships to Surface**:
- User → roles (many-to-many)
- Role → permissions
- Role changes → audit log
- Roles → templates

---

## LOW Priority Tasks

### Webhooks Monitoring
**Database View**: Related to webhook system
**Schema**: `communication.webhook_*`
**Missing Operations**:
- [ ] Platform-wide webhook monitoring
- [ ] Webhook delivery statistics
- [ ] Failed webhook retry management
- [ ] Webhook endpoint health
- [ ] Webhook security auditing

**Related Database Functions**:
- `communication.process_webhook_queue()` - Process queue

**Implementation Steps**:
1. Create webhook monitoring dashboard
2. Add delivery statistics
3. Implement retry management
4. Add endpoint health checks
5. Create security audit logs

**Data Relationships to Surface**:
- Webhooks → delivery status
- Webhooks → retry attempts
- Endpoints → health status
- Webhooks → security events

---

### Settings/Configuration
**Database View**: Various settings tables
**Schema**: `security.auth_settings`, other config tables
**Missing Operations**:
- [ ] Platform configuration management
- [ ] Feature flags
- [ ] Rate limiting configuration
- [ ] Authentication settings
- [ ] System maintenance mode

**Related Database Functions**:
- `security.get_auth_setting(p_setting_name)` - Get auth setting

**Implementation Steps**:
1. Page exists: `app/(admin)/admin/settings/page.tsx`
2. Create platform config dashboard
3. Add feature flag management
4. Implement rate limit controls
5. Add auth setting management
6. Create maintenance mode toggle

**Data Relationships to Surface**:
- Settings → values
- Settings → change history
- Feature flags → enabled/disabled
- Rate limits → configuration

---

### Stock Movements Platform-Wide
**Database View**: `stock_movements`
**Schema**: `inventory.stock_movements`
**Missing Operations**:
- [ ] Platform-wide stock movement tracking
- [ ] Movement pattern analysis
- [ ] Theft/loss detection
- [ ] Inter-salon transfers oversight
- [ ] Movement audit trail

**Implementation Steps**:
1. Add to inventory feature
2. Create movement analytics
3. Add pattern detection
4. Implement anomaly alerts
5. Create movement reports

**Data Relationships to Surface**:
- Movements → type (in/out/transfer/adjust)
- Movements → salons
- Movements → patterns
- Movements → anomalies

---

### Operating Hours Platform View
**Database View**: `operating_hours`
**Schema**: `organization.operating_hours`
**Missing Operations**:
- [ ] View salon hours across platform
- [ ] Identify scheduling issues
- [ ] Holiday/special hours oversight
- [ ] Hours compliance checking

**Implementation Steps**:
1. Add to salon overview
2. Create hours summary view
3. Add compliance checks
4. Identify scheduling anomalies

**Data Relationships to Surface**:
- Salons → hours
- Special dates → overrides
- Hours → compliance

---

## Quick Wins
Tasks that are easy to implement with high impact:

- [x] **Security Metrics Widget** - Use `get_security_metrics()` for dashboard
- [x] **Revenue Summary Card** - Display total platform revenue from `admin_revenue_overview`
- [x] **Active Users Count** - Simple count of users active in last 30 days
- [x] **Low Stock Alerts Badge** - Show count of salons with low stock
- [x] **Pending Verifications Badge** - Count of salons/staff awaiting verification

---

## Database Functions Not Exposed

Admin-relevant functions available but not fully utilized:

### Security Functions
- `security.get_security_metrics()` - Comprehensive security metrics
- `security.log_security_event(p_event_type, p_severity, p_description, p_metadata)` - Log security events
- `security.require_mfa_for_operation(p_operation)` - Enforce MFA for operations
- `security.user_has_salon_access(p_salon_id)` - Check salon access
- `security.validate_and_sanitize_input(p_input, p_input_type)` - Input sanitization
- `security.secure_user_lookup(user_email)` - Secure user search
- `identity.detect_access_anomaly(p_user_id)` - Detect suspicious access
- `identity.anonymize_user(p_user_id)` - GDPR user anonymization

### Analytics Functions
- `analytics.calculate_daily_metrics(p_salon_id, p_date)` - Daily metrics (all salons)
- `analytics.refresh_daily_metrics()` - Refresh all metrics
- `public.get_salon_metrics(p_salon_id, p_date_from, p_date_to)` - Detailed metrics

### Audit Functions
- `public.audit_trigger_function()` - Generic audit logging
- `public.log_security_event(p_event_type, p_severity, p_metadata)` - Security event logging

### System Functions
- `public.refresh_materialized_views()` - Refresh views
- `public.refresh_performance_analytics()` - Refresh analytics
- `admin.check_missing_fk_indexes()` - Database optimization
- `admin.refresh_foreign_key_analysis()` - FK analysis

### Validation Functions
- `public.validate_rls_configuration()` - RLS validation
- `public.validate_normalized_data_consistency()` - Data consistency checks
- `public.check_naming_consistency()` - Schema naming checks

### Search Functions
- `public.search_salons(search_term, city, state, is_verified_filter, limit_count)` - Advanced salon search

### Communication Functions
- `communication.claim_notification_batch(p_batch_size, p_worker_id)` - Batch processing
- `communication.cleanup_stale_locks(p_timeout_minutes)` - Queue cleanup
- `communication.process_webhook_queue()` - Webhook processing

**Potential Uses**:
- Build comprehensive security dashboard using security functions
- Implement GDPR compliance tools (user anonymization)
- Add system health monitoring using validation functions
- Create database optimization dashboard
- Implement advanced search across all entities
- Add notification/webhook monitoring dashboards
- Build anomaly detection system for fraud/abuse
