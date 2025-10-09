# Staff Portal - Implementation Tasks

## Summary
- Total database views available: 60
- Currently implemented features: 11
- Missing features: 12+
- Coverage: ~55% of staff-relevant functionality

## CRITICAL Priority Tasks

### Analytics Dashboard
**Database View**: Various analytics views
**Schema**: `analytics` schema
**Missing Operations**:
- [ ] Personal performance metrics
- [ ] Earnings analytics
- [ ] Appointment completion rates
- [ ] Customer satisfaction scores
- [ ] Service efficiency tracking

**Related Database Functions**:
- `analytics.calculate_daily_metrics()` - Daily performance
- `analytics.refresh_service_performance()` - Service analytics

**Implementation Steps**:
1. Page exists: `app/(staff)/staff/analytics/page.tsx`
2. Create personal analytics dashboard
3. Show earnings trends over time
4. Display appointment statistics
5. Add customer retention metrics
6. Show service performance by type

**Data Relationships to Surface**:
- Staff → appointments completed
- Staff → revenue generated
- Staff → customer ratings
- Staff → service efficiency

---

### Notifications Center
**Database View**: None directly (communication schema)
**Schema**: `communication.notifications`
**Missing Operations**:
- [ ] View all notifications
- [ ] Mark notifications as read
- [ ] Filter by notification type
- [ ] Notification preferences
- [ ] Real-time notification updates

**Related Database Functions**:
- `communication.get_unread_count(p_user_id)` - Get unread count
- `communication.get_unread_counts(p_user_id)` - Get counts by type
- `communication.mark_notifications_read(p_user_id, p_notification_ids[])` - Mark as read

**Implementation Steps**:
1. Page exists: `app/(staff)/staff/notifications/page.tsx`
2. Create notifications list component
3. Add real-time updates (Supabase Realtime)
4. Implement mark as read functionality
5. Add filtering by type
6. Create notification preferences page

**Data Relationships to Surface**:
- User → notifications
- Notification → type (appointment, message, etc.)
- Notification → read status
- Notification → timestamp

---

### Help/Documentation
**Database View**: N/A (content-based)
**Schema**: N/A
**Missing Operations**:
- [ ] Browse help articles
- [ ] Search documentation
- [ ] View tutorials/guides
- [ ] FAQ section
- [ ] Video walkthroughs

**Implementation Steps**:
1. Page exists: `app/(staff)/staff/help/page.tsx`
2. Create help content structure
3. Add searchable help articles
4. Organize by category
5. Add video embed support
6. Create getting started guide

**Data Relationships to Surface**:
- Help articles → categories
- Articles → search indexing
- Tutorials → step-by-step guides

---

### Support/Contact
**Database View**: Message threads
**Schema**: `communication` schema
**Missing Operations**:
- [ ] Submit support tickets
- [ ] View ticket status
- [ ] Chat with support
- [ ] View ticket history
- [ ] Rate support interactions

**Implementation Steps**:
1. Page exists: `app/(staff)/staff/support/page.tsx`
2. Create support ticket system
3. Integrate with messaging feature
4. Add ticket status tracking
5. Create support contact form
6. Add priority/urgency levels

**Data Relationships to Surface**:
- Staff → support tickets
- Ticket → status
- Ticket → messages/thread
- Ticket → resolution

---

## HIGH Priority Tasks

### Staff Services Management Detail
**Database View**: `staff_services`
**Schema**: `organization.staff_services`
**Missing Operations**:
- [ ] View services assigned to me
- [ ] Request service additions
- [ ] Update service proficiency level
- [ ] Set service availability
- [ ] Track service completion metrics

**Related Database Functions**:
- `catalog.user_can_manage_service()` - Permission check

**Implementation Steps**:
1. Feature exists at `features/staff/services/` but needs enhancement
2. Add service proficiency indicators
3. Show service assignment requests
4. Display service-specific performance
5. Add availability toggles per service

**Data Relationships to Surface**:
- Staff → services (many-to-many)
- Service → completion count
- Service → average rating
- Service → average duration

---

### Time Off Requests Enhanced
**Database View**: `time_off_requests_view`
**Schema**: `scheduling.time_off_requests`
**Missing Operations**:
- [ ] Request time off (exists but needs enhancement)
- [ ] View time off balance
- [ ] See approval status history
- [ ] Cancel pending requests
- [ ] View team calendar (who's off when)

**Related Database Functions**:
- `public.can_update_time_off_request()` - Permission check
- `public.can_view_time_off_request()` - View permission

**Implementation Steps**:
1. Feature exists at `features/staff/time-off/` - enhance
2. Add time off balance tracking
3. Create team calendar view
4. Add approval workflow visualization
5. Implement request cancellation

**Data Relationships to Surface**:
- Staff → time off requests
- Request → approval chain
- Request → status history
- Team → time off calendar

---

### Schedule Management Enhanced
**Database View**: `staff_schedules`
**Schema**: `organization.staff_schedules`
**Missing Operations**:
- [ ] View personal schedule (exists)
- [ ] Request schedule changes
- [ ] Swap shifts with colleagues
- [ ] Set recurring availability
- [ ] View schedule conflicts

**Related Database Functions**:
- `public.can_manage_staff_schedule()` - Permission check
- `organization.notify_schedule_changes()` - Trigger for changes

**Implementation Steps**:
1. Feature exists at `features/staff/schedule/` - enhance
2. Add schedule change request workflow
3. Implement shift swap functionality
4. Add recurring availability templates
5. Show conflict warnings

**Data Relationships to Surface**:
- Staff → schedules
- Schedule → conflicts
- Schedule → change requests
- Staff → available for swap

---

### Commission Tracking Detailed
**Database View**: Derived from appointments and transactions
**Schema**: Multiple schemas
**Missing Operations**:
- [ ] View commission breakdown (exists but basic)
- [ ] Track commission by service type
- [ ] See commission rate details
- [ ] Export commission reports
- [ ] View payout schedule

**Implementation Steps**:
1. Feature exists at `features/staff/commission/` - enhance
2. Add detailed commission breakdown
3. Show commission rates per service
4. Create exportable reports
5. Add historical commission trends
6. Show projected earnings

**Data Relationships to Surface**:
- Staff → appointments → commission
- Service → commission rate
- Commission → payment status
- Time period → total commission

---

### Client Management Enhanced
**Database View**: Derived from appointments and customers
**Schema**: Multiple schemas
**Missing Operations**:
- [ ] View my client list (exists)
- [ ] Client service history with me
- [ ] Client preferences/notes
- [ ] Client contact information
- [ ] Client loyalty/return rate

**Implementation Steps**:
1. Feature exists at `features/staff/clients/` - enhance
2. Add client detail view
3. Show service history
4. Add private notes about clients
5. Display client preferences
6. Show client retention metrics

**Data Relationships to Surface**:
- Staff → clients (through appointments)
- Client → service history
- Client → preferences
- Client → return rate

---

## MEDIUM Priority Tasks

### Blocked Times Management
**Database View**: `blocked_times`
**Schema**: `scheduling.blocked_times`
**Missing Operations**:
- [ ] View my blocked times
- [ ] Create blocked time slots
- [ ] Edit blocked times
- [ ] Delete blocked times
- [ ] Set recurring blocked times

**Related Database Functions**:
- `public.can_manage_blocked_times()` - Permission check

**Implementation Steps**:
1. Create feature: `features/staff/blocked-times/`
2. Add blocked times calendar view
3. Create blocked time form
4. Add recurring pattern support
5. Show blocked times in schedule view

**Data Relationships to Surface**:
- Staff → blocked times
- Blocked time → reason
- Blocked time → date range
- Blocked time → recurring pattern

---

### Product Usage Recording
**Database View**: `product_usage`, `service_product_usage`
**Schema**: `catalog.service_product_usage`
**Missing Operations**:
- [ ] Record products used in services
- [ ] View product usage history
- [ ] See product stock before use
- [ ] Track product waste/spillage
- [ ] Product usage analytics

**Implementation Steps**:
1. Create feature: `features/staff/product-usage/`
2. Add product usage form during/after appointment
3. Show available stock levels
4. Create usage history view
5. Add analytics on personal product usage

**Data Relationships to Surface**:
- Service → products used
- Product → quantity used
- Product → stock level
- Usage → cost tracking

---

### Operating Hours Visibility
**Database View**: `operating_hours`
**Schema**: `organization.operating_hours`
**Missing Operations**:
- [ ] View salon operating hours
- [ ] See special hours/closures
- [ ] View my working hours vs salon hours
- [ ] Holiday schedule visibility

**Implementation Steps**:
1. Add to dashboard or schedule view
2. Display salon hours prominently
3. Highlight discrepancies with personal schedule
4. Show upcoming special dates/closures

**Data Relationships to Surface**:
- Salon → operating hours
- Special dates → hours override
- Staff schedule → salon hours comparison

---

### Messages/Communication
**Database View**: `messages`, `message_threads`
**Schema**: `communication.messages`
**Missing Operations**:
- [ ] View messages (basic implementation exists)
- [ ] Send messages to clients
- [ ] Message salon management
- [ ] Group messaging with team
- [ ] Message templates/quick replies

**Implementation Steps**:
1. Enhance shared messaging feature for staff context
2. Add message templates
3. Create team group messaging
4. Add quick replies for common questions
5. Implement message search

**Data Relationships to Surface**:
- Staff → message threads
- Thread → participants
- Messages → read status
- Messages → attachments

---

### Profile Management Enhanced
**Database View**: `profiles`, `staff_profiles`, `profiles_metadata`
**Schema**: `identity.profiles`, `organization.staff_profiles`
**Missing Operations**:
- [ ] Update profile information (exists)
- [ ] Manage portfolio/work gallery
- [ ] Add certifications/licenses
- [ ] Set specialties/skills
- [ ] Upload profile photo

**Related Database Functions**:
- `identity.get_my_profile()` - Get own profile
- `identity.get_profile_summary()` - Get profile summary

**Implementation Steps**:
1. Feature exists at `features/staff/profile/` - enhance
2. Add portfolio management
3. Create certification upload
4. Add skills/specialties editor
5. Implement photo upload
6. Surface profile metadata

**Data Relationships to Surface**:
- Profile → metadata (portfolio, certifications)
- Staff profile → specialties
- Profile → photos/media
- Staff → bio/description

---

## LOW Priority Tasks

### Settings/Preferences
**Database View**: `profiles_preferences`
**Schema**: `identity.profile_preferences`
**Missing Operations**:
- [ ] Notification preferences
- [ ] Communication preferences
- [ ] Privacy settings
- [ ] Display preferences

**Implementation Steps**:
1. Page exists: `app/(staff)/staff/settings/preferences/page.tsx`
2. Implement preference management
3. Add notification controls
4. Add privacy settings
5. Add display/theme preferences

**Data Relationships to Surface**:
- Profile → preferences
- Notification channels → enabled/disabled
- Privacy → data visibility

---

### Sessions Management
**Database View**: `sessions`
**Schema**: `identity.sessions`
**Missing Operations**:
- [ ] View active sessions
- [ ] See session details (device, location)
- [ ] Revoke sessions
- [ ] Security alerts

**Implementation Steps**:
1. Page exists: `app/(staff)/staff/settings/sessions/page.tsx`
2. Implement session list view
3. Add session revocation
4. Show security details
5. Add security alerts for suspicious activity

**Data Relationships to Surface**:
- User → sessions
- Session → device/browser
- Session → IP/location
- Session → last active

---

### Location Information
**Database View**: `salon_locations`, `location_addresses`
**Schema**: `organization.salon_locations`
**Missing Operations**:
- [ ] View salon location details
- [ ] See which location I'm assigned to
- [ ] View location-specific hours
- [ ] Access location contact info

**Implementation Steps**:
1. Add to dashboard or profile
2. Display assigned location(s)
3. Show location hours and contact
4. Add directions/map link

**Data Relationships to Surface**:
- Staff → salon location
- Location → address
- Location → contact info
- Location → hours

---

## Quick Wins
Tasks that are easy to implement with high impact:

- [ ] **Unread Notification Badge** - Use `get_unread_count()` to show badge in navigation
- [ ] **Commission This Week** - Add widget to dashboard showing weekly commission
- [ ] **Today's Appointments Count** - Simple count of today's appointments on dashboard
- [ ] **Blocked Times Calendar** - Visual calendar showing blocked times and appointments
- [ ] **Client Return Rate** - Simple metric showing % of repeat clients

---

## Database Functions Not Exposed

Staff-relevant functions available but not utilized:

### Analytics Functions
- `analytics.calculate_daily_metrics(p_salon_id, p_date)` - Can filter for staff member
- `analytics.refresh_service_performance(p_service_id)` - Service performance metrics

### Communication Functions
- `communication.get_unread_count(p_user_id)` - Unread notification count
- `communication.get_unread_counts(p_user_id)` - Unread counts by type
- `communication.mark_notifications_read(p_user_id, p_notification_ids[])` - Batch mark as read
- `communication.send_notification(p_user_id, p_type, p_title, p_message, p_data, p_channels[])` - Send notification

### Schedule/Appointment Functions
- `scheduling.check_staff_availability(p_staff_id, p_start_time, p_end_time, p_exclude_appointment_id)` - Check availability
- `scheduling.check_appointment_conflict(p_salon_id, p_staff_id, p_start_time, p_end_time, p_exclude_appointment_id)` - Detect conflicts
- `scheduling.get_appointment_stats(p_salon_id, p_start_date, p_end_date)` - Can filter by staff

### Profile Functions
- `identity.get_my_profile()` - Get own profile data
- `identity.get_profile_summary(p_user_id)` - Get profile summary

### Permission Functions
- `public.can_manage_blocked_times(p_salon_id, p_staff_id)` - Check permissions
- `public.can_manage_staff_schedule(p_staff_id)` - Check schedule permissions
- `public.can_update_time_off_request(p_request_id)` - Check time off permissions

**Potential Uses**:
- Build analytics dashboard using metrics functions
- Implement real-time notification system
- Add availability checker for schedule changes
- Use conflict detection before confirming schedule changes
- Display profile summary on dashboard
- Add permission-aware UI (show/hide features based on permissions)
