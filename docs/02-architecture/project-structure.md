# 🌳 COMPLETE PROJECT TREE - ENORAE

> **Navigation**: [📘 Docs Index](./INDEX.md) | [🏠 README](../README.md) | [🤖 CLAUDE.md](../CLAUDE.md)

> **Generated from actual database.types.ts analysis**
> **Database**: 42 tables, 8 business domains, 108 functions
> **Architecture**: Single Next.js 15 app with 4 portals
> **Last Updated**: 2025-10-01

---

## 📊 DATABASE FOUNDATION (42 Tables)

### Business Domain Tables:

```
organization (8 tables):        catalog (5 tables):
├── salons                      ├── services
├── staff_profiles              ├── service_categories
├── salon_locations             ├── service_pricing
├── salon_chains                ├── service_booking_rules
├── operating_hours             └── staff_services
├── salon_settings
├── salon_media                 engagement (1 table):
└── salon_metrics               └── customer_favorites

scheduling (5 tables):          inventory (11 tables):
├── appointments                ├── products
├── appointment_services        ├── product_categories
├── blocked_times               ├── suppliers
├── staff_schedules             ├── purchase_orders
└── time_off_requests           ├── purchase_order_items
                                ├── stock_levels
identity (5 tables):            ├── stock_locations
├── profiles                    ├── stock_movements
├── profiles_metadata           ├── stock_alerts
├── profiles_preferences        ├── product_usage
├── user_roles                  └── service_product_usage
└── sessions
                                communication (3 tables):
analytics (3 tables):           ├── messages
├── daily_metrics               ├── message_threads
├── operational_metrics         └── webhook_queue
└── manual_transactions
```

---

## 🏗️ COMPLETE PROJECT STRUCTURE

```
enorae/
│
├── 📁 app/                                    # Next.js 15 App Router
│   ├── layout.tsx                             # Root layout with providers
│   ├── page.tsx                               # Root redirect to /explore
│   ├── globals.css                            # Tailwind CSS + global styles
│   ├── not-found.tsx                          # 404 page
│   ├── error.tsx                              # Global error boundary
│   │
│   ├── 📁 (marketing)/                        # 🌐 PUBLIC ROUTES (No auth)
│   │   ├── layout.tsx                         # Marketing layout (header + footer)
│   │   ├── page.tsx                           # Homepage (/)
│   │   ├── about/
│   │   │   └── page.tsx                       # About us
│   │   ├── pricing/
│   │   │   └── page.tsx                       # Pricing plans
│   │   ├── contact/
│   │   │   └── page.tsx                       # Contact form
│   │   ├── blog/
│   │   │   ├── page.tsx                       # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx                   # Blog post
│   │   └── careers/
│   │       └── page.tsx                       # Careers page
│   │
│   ├── 📁 auth/                               # 🔐 AUTHENTICATION ROUTES
│   │   ├── login/
│   │   │   └── page.tsx                       # Login page
│   │   ├── signup/
│   │   │   └── page.tsx                       # Signup page
│   │   ├── forgot-password/
│   │   │   └── page.tsx                       # Password reset request
│   │   ├── reset-password/
│   │   │   └── page.tsx                       # Password reset confirm
│   │   ├── verify-email/
│   │   │   └── page.tsx                       # Email verification
│   │   ├── callback/
│   │   │   └── route.ts                       # OAuth callback handler
│   │   └── error/
│   │       └── page.tsx                       # Auth error page
│   │
│   ├── 📁 (customer)/                         # 👤 CUSTOMER PORTAL
│   │   │                                      # Roles: customer, vip_customer, guest
│   │   ├── layout.tsx                         # Customer layout (navbar + search)
│   │   │
│   │   ├── 📁 explore/                        # [organization.salons]
│   │   │   ├── page.tsx                       # Browse all salons (grid view)
│   │   │   └── [city]/
│   │   │       └── page.tsx                   # Salons by city
│   │   │
│   │   ├── 📁 salons/                         # [organization.salons + catalog.services]
│   │   │   └── [slug]/
│   │   │       ├── page.tsx                   # Salon detail page
│   │   │       ├── loading.tsx                # Skeleton loader
│   │   │       ├── services/
│   │   │       │   └── page.tsx               # Services list
│   │   │       ├── gallery/
│   │   │       │   └── page.tsx               # [organization.salon_media]
│   │   │       ├── reviews/
│   │   │       │   └── page.tsx               # Reviews (future)
│   │   │       └── book/
│   │   │           ├── page.tsx               # Booking flow step 1 (service selection)
│   │   │           ├── time/
│   │   │           │   └── page.tsx           # Step 2: Date/time picker
│   │   │           └── confirm/
│   │   │               └── page.tsx           # Step 3: Confirmation
│   │   │
│   │   ├── 📁 appointments/                   # [scheduling.appointments]
│   │   │   ├── page.tsx                       # My appointments (upcoming + past)
│   │   │   ├── loading.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx                   # Appointment detail
│   │   │       ├── reschedule/
│   │   │       │   └── page.tsx               # Reschedule appointment
│   │   │       └── cancel/
│   │   │           └── page.tsx               # Cancel appointment
│   │   │
│   │   ├── 📁 favorites/                      # [engagement.customer_favorites]
│   │   │   ├── page.tsx                       # Favorite salons & staff
│   │   │   └── loading.tsx
│   │   │
│   │   ├── 📁 messages/                       # [communication.messages]
│   │   │   ├── page.tsx                       # Inbox
│   │   │   └── [threadId]/
│   │   │       └── page.tsx                   # Message thread
│   │   │
│   │   └── 📁 profile/                        # [identity.profiles]
│   │       ├── page.tsx                       # Profile overview
│   │       ├── edit/
│   │       │   └── page.tsx                   # Edit profile
│   │       ├── settings/
│   │       │   └── page.tsx                   # Account settings
│   │       ├── preferences/
│   │       │   └── page.tsx                   # [identity.profiles_preferences]
│   │       ├── history/
│   │       │   └── page.tsx                   # Booking history
│   │       └── security/
│   │           └── page.tsx                   # Password & 2FA
│   │
│   ├── 📁 (staff)/                            # 💼 STAFF PORTAL
│   │   │                                      # Roles: senior_staff, staff, junior_staff
│   │   ├── layout.tsx                         # Staff layout (simple top nav)
│   │   ├── page.tsx                           # Today's schedule dashboard
│   │   │
│   │   ├── 📁 schedule/                       # [scheduling.staff_schedules]
│   │   │   ├── page.tsx                       # My schedule (week view)
│   │   │   ├── loading.tsx
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx                   # Calendar view
│   │   │   └── time-off/
│   │   │       ├── page.tsx                   # [scheduling.time_off_requests]
│   │   │       ├── new/
│   │   │       │   └── page.tsx               # Request time off
│   │   │       └── [id]/
│   │   │           └── page.tsx               # Time off detail
│   │   │
│   │   ├── 📁 appointments/                   # [scheduling.appointments]
│   │   │   ├── page.tsx                       # Today's appointments
│   │   │   ├── upcoming/
│   │   │   │   └── page.tsx                   # Upcoming appointments
│   │   │   ├── past/
│   │   │   │   └── page.tsx                   # Completed appointments
│   │   │   └── [id]/
│   │   │       ├── page.tsx                   # Appointment detail
│   │   │       └── check-in/
│   │   │           └── page.tsx               # Check-in customer
│   │   │
│   │   ├── 📁 customers/                      # [identity.profiles + scheduling.appointments]
│   │   │   ├── page.tsx                       # My customers list
│   │   │   └── [id]/
│   │   │       ├── page.tsx                   # Customer detail
│   │   │       └── history/
│   │   │           └── page.tsx               # Appointment history with me
│   │   │
│   │   ├── 📁 performance/                    # [analytics.daily_metrics]
│   │   │   ├── page.tsx                       # My performance dashboard
│   │   │   ├── services/
│   │   │   │   └── page.tsx                   # Service breakdown
│   │   │   └── ratings/
│   │   │       └── page.tsx                   # Customer ratings
│   │   │
│   │   ├── 📁 commissions/                    # [analytics.manual_transactions]
│   │   │   ├── page.tsx                       # My commissions overview
│   │   │   └── history/
│   │   │       └── page.tsx                   # Commission history
│   │   │
│   │   └── 📁 profile/                        # [identity.profiles + organization.staff_profiles]
│   │       ├── page.tsx                       # My staff profile
│   │       ├── edit/
│   │       │   └── page.tsx                   # Edit profile
│   │       ├── services/
│   │       │   └── page.tsx                   # [catalog.staff_services] My services
│   │       └── settings/
│   │           └── page.tsx                   # Personal settings
│   │
│   ├── 📁 (business)/                         # 🏢 BUSINESS MANAGEMENT
│   │   │                                      # Roles: tenant_owner, salon_owner, salon_manager
│   │   ├── layout.tsx                         # Business sidebar layout
│   │   ├── page.tsx                           # Dashboard home
│   │   │
│   │   ├── 📁 dashboard/                      # [analytics.daily_metrics + analytics.operational_metrics]
│   │   │   ├── page.tsx                       # Overview dashboard
│   │   │   ├── loading.tsx
│   │   │   ├── revenue/
│   │   │   │   └── page.tsx                   # Revenue analytics
│   │   │   ├── appointments/
│   │   │   │   └── page.tsx                   # Appointment analytics
│   │   │   └── customers/
│   │   │       └── page.tsx                   # Customer analytics
│   │   │
│   │   ├── 📁 appointments/                   # [scheduling.appointments + scheduling.appointment_services]
│   │   │   ├── page.tsx                       # All appointments (list view)
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx                   # Calendar view
│   │   │   ├── new/
│   │   │   │   └── page.tsx                   # Create appointment (admin booking)
│   │   │   └── [id]/
│   │   │       ├── page.tsx                   # Appointment detail
│   │   │       └── edit/
│   │   │           └── page.tsx               # Edit appointment
│   │   │
│   │   ├── 📁 customers/                      # [identity.profiles + scheduling.appointments]
│   │   │   ├── page.tsx                       # All customers (table view)
│   │   │   ├── loading.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx                   # Customer detail
│   │   │       ├── appointments/
│   │   │       │   └── page.tsx               # Customer appointment history
│   │   │       └── notes/
│   │   │           └── page.tsx               # Customer notes
│   │   │
│   │   ├── 📁 staff/                          # [organization.staff_profiles + identity.user_roles]
│   │   │   ├── page.tsx                       # All staff members
│   │   │   ├── loading.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx                   # Add staff member
│   │   │   └── [id]/
│   │   │       ├── page.tsx                   # Staff detail
│   │   │       ├── edit/
│   │   │       │   └── page.tsx               # Edit staff profile
│   │   │       ├── schedule/
│   │   │       │   └── page.tsx               # [scheduling.staff_schedules] Staff schedule
│   │   │       ├── services/
│   │   │       │   └── page.tsx               # [catalog.staff_services] Assign services
│   │   │       └── performance/
│   │   │           └── page.tsx               # Staff performance
│   │   │
│   │   ├── 📁 schedule/                       # [scheduling.staff_schedules + scheduling.blocked_times]
│   │   │   ├── page.tsx                       # Master schedule (all staff)
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx                   # Calendar view
│   │   │   ├── blocked-times/
│   │   │   │   ├── page.tsx                   # Blocked time slots
│   │   │   │   └── new/
│   │   │   │       └── page.tsx               # Create blocked time
│   │   │   └── time-off/
│   │   │       ├── page.tsx                   # [scheduling.time_off_requests] Manage requests
│   │   │       └── [id]/
│   │   │           └── page.tsx               # Approve/deny time off
│   │   │
│   │   ├── 📁 services/                       # [catalog.services + catalog.service_categories]
│   │   │   ├── page.tsx                       # All services (table view)
│   │   │   ├── loading.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx                   # Create service
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx                   # Service categories
│   │   │   │   └── new/
│   │   │   │       └── page.tsx               # Create category
│   │   │   └── [id]/
│   │   │       ├── page.tsx                   # Service detail
│   │   │       ├── edit/
│   │   │       │   └── page.tsx               # Edit service
│   │   │       ├── pricing/
│   │   │       │   └── page.tsx               # [catalog.service_pricing] Pricing rules
│   │   │       └── booking-rules/
│   │   │           └── page.tsx               # [catalog.service_booking_rules] Booking constraints
│   │   │
│   │   ├── 📁 inventory/                      # [inventory.* - 11 tables]
│   │   │   ├── page.tsx                       # Inventory dashboard
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                   # [inventory.products] All products
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx               # Add product
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx               # [inventory.product_categories]
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx               # Product detail
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx           # Edit product
│   │   │   │
│   │   │   ├── stock/
│   │   │   │   ├── page.tsx                   # [inventory.stock_levels] Stock overview
│   │   │   │   ├── alerts/
│   │   │   │   │   └── page.tsx               # [inventory.stock_alerts] Low stock alerts
│   │   │   │   ├── locations/
│   │   │   │   │   └── page.tsx               # [inventory.stock_locations] Storage locations
│   │   │   │   └── movements/
│   │   │   │       ├── page.tsx               # [inventory.stock_movements] Movement history
│   │   │   │       └── new/
│   │   │   │           └── page.tsx           # Record movement
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                   # [inventory.purchase_orders] All orders
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx               # Create order
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx               # [inventory.purchase_order_items] Order detail
│   │   │   │       └── receive/
│   │   │   │           └── page.tsx           # Receive order
│   │   │   │
│   │   │   ├── suppliers/
│   │   │   │   ├── page.tsx                   # [inventory.suppliers] All suppliers
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx               # Add supplier
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx               # Supplier detail
│   │   │   │
│   │   │   └── usage/
│   │   │       ├── page.tsx                   # [inventory.product_usage] Usage reports
│   │   │       └── service-usage/
│   │   │           └── page.tsx               # [inventory.service_product_usage] By service
│   │   │
│   │   ├── 📁 analytics/                      # [analytics.daily_metrics + analytics.operational_metrics]
│   │   │   ├── page.tsx                       # Analytics dashboard
│   │   │   ├── revenue/
│   │   │   │   ├── page.tsx                   # Revenue reports
│   │   │   │   └── breakdown/
│   │   │   │       └── page.tsx               # Revenue breakdown
│   │   │   ├── staff/
│   │   │   │   └── page.tsx                   # Staff performance
│   │   │   ├── services/
│   │   │   │   └── page.tsx                   # Service performance
│   │   │   ├── customers/
│   │   │   │   └── page.tsx                   # Customer insights
│   │   │   └── reports/
│   │   │       ├── page.tsx                   # Custom reports
│   │   │       └── export/
│   │   │           └── page.tsx               # Export reports
│   │   │
│   │   ├── 📁 messages/                       # [communication.messages + communication.message_threads]
│   │   │   ├── page.tsx                       # All conversations
│   │   │   └── [threadId]/
│   │   │       └── page.tsx                   # Message thread
│   │   │
│   │   ├── 📁 settings/                       # [organization.salon_settings]
│   │   │   ├── page.tsx                       # Settings home
│   │   │   │
│   │   │   ├── general/
│   │   │   │   └── page.tsx                   # [organization.salons] General info
│   │   │   │
│   │   │   ├── locations/
│   │   │   │   ├── page.tsx                   # [organization.salon_locations] All locations
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx               # Add location
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx               # Edit location
│   │   │   │
│   │   │   ├── hours/
│   │   │   │   └── page.tsx                   # [organization.operating_hours] Business hours
│   │   │   │
│   │   │   ├── media/
│   │   │   │   └── page.tsx                   # [organization.salon_media] Photos & videos
│   │   │   │
│   │   │   ├── chain/
│   │   │   │   └── page.tsx                   # [organization.salon_chains] Chain management
│   │   │   │
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx                   # Notification preferences
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   └── page.tsx                   # Payment settings
│   │   │   │
│   │   │   ├── integrations/
│   │   │   │   └── page.tsx                   # Third-party integrations
│   │   │   │
│   │   │   └── billing/
│   │   │       ├── page.tsx                   # [analytics.manual_transactions] Subscription
│   │   │       └── history/
│   │   │           └── page.tsx               # Billing history
│   │   │
│   │   └── 📁 webhooks/                       # [communication.webhook_queue]
│   │       ├── page.tsx                       # Webhook endpoints
│   │       ├── new/
│   │       │   └── page.tsx                   # Create webhook
│   │       └── [id]/
│   │           ├── page.tsx                   # Webhook detail
│   │           └── logs/
│   │               └── page.tsx               # Webhook delivery logs
│   │
│   └── 📁 (admin)/                            # 👑 PLATFORM ADMIN
│       │                                      # Roles: super_admin, platform_admin
│       ├── layout.tsx                         # Admin layout (full sidebar)
│       ├── page.tsx                           # Platform dashboard
│       │
│       ├── 📁 dashboard/                      # Platform-wide analytics
│       │   └── page.tsx
│       │
│       ├── 📁 salons/                         # [organization.salons] All salons
│       │   ├── page.tsx                       # Salon list
│       │   ├── new/
│       │   │   └── page.tsx                   # Onboard salon
│       │   └── [id]/
│       │       ├── page.tsx                   # Salon detail
│       │       └── impersonate/
│       │           └── page.tsx               # Impersonate salon owner
│       │
│       ├── 📁 users/                          # [identity.profiles + identity.user_roles]
│       │   ├── page.tsx                       # All users
│       │   └── [id]/
│       │       ├── page.tsx                   # User detail
│       │       └── roles/
│       │           └── page.tsx               # Manage roles
│       │
│       ├── 📁 analytics/                      # Platform-wide analytics
│       │   └── page.tsx
│       │
│       ├── 📁 audit-logs/                     # [audit.audit_logs]
│       │   └── page.tsx                       # Audit log viewer
│       │
│       └── 📁 settings/
│           ├── page.tsx                       # Platform settings
│           ├── feature-flags/
│           │   └── page.tsx                   # Feature flags
│           └── system/
│               └── page.tsx                   # System health
│
├── 📁 features/                               # Feature modules (domain-driven)
│   │
│   ├── 📁 salon-discovery/                    # [organization.salons + catalog.services]
│   │   ├── components/
│   │   │   ├── salon-card.tsx
│   │   │   ├── salon-grid.tsx
│   │   │   ├── salon-filters.tsx
│   │   │   └── search-bar.tsx
│   │   ├── hooks/
│   │   │   ├── use-salon-search.ts
│   │   │   └── use-salon-filters.ts
│   │   ├── actions/
│   │   │   └── salon.actions.ts
│   │   ├── dal/
│   │   │   ├── salon.queries.ts               # getSalons, getSalonBySlug, searchSalons
│   │   │   └── salon.mutations.ts             # (admin only)
│   │   ├── types/
│   │   │   └── salon.types.ts
│   │   └── utils/
│   │       └── salon-helpers.ts
│   │
│   ├── 📁 booking/                            # [scheduling.appointments + scheduling.appointment_services]
│   │   ├── components/
│   │   │   ├── booking-form.tsx
│   │   │   ├── date-time-picker.tsx
│   │   │   ├── service-selector.tsx
│   │   │   ├── staff-selector.tsx
│   │   │   └── booking-summary.tsx
│   │   ├── hooks/
│   │   │   ├── use-booking-form.ts
│   │   │   ├── use-available-slots.ts
│   │   │   └── use-booking-validation.ts
│   │   ├── actions/
│   │   │   ├── booking.actions.ts             # createBooking, cancelBooking, rescheduleBooking
│   │   │   └── payment.actions.ts             # processPayment, refundBooking
│   │   ├── dal/
│   │   │   ├── booking.queries.ts             # getAvailableSlots, getBooking, getUserBookings
│   │   │   └── booking.mutations.ts           # createBooking, updateBookingStatus
│   │   ├── types/
│   │   │   └── booking.types.ts
│   │   ├── utils/
│   │   │   ├── time-slots.ts
│   │   │   └── price-calculator.ts
│   │   └── constants/
│   │       └── booking-rules.constants.ts
│   │
│   ├── 📁 appointments-management/            # [scheduling.appointments] (business view)
│   │   ├── components/
│   │   │   ├── appointments-table.tsx
│   │   │   ├── appointment-card.tsx
│   │   │   ├── appointments-calendar.tsx
│   │   │   └── appointments-filters.tsx
│   │   ├── hooks/
│   │   │   ├── use-appointments.ts
│   │   │   └── use-appointment-stats.ts
│   │   ├── actions/
│   │   │   └── appointments.actions.ts        # batchUpdateStatus, adminCreateBooking
│   │   ├── dal/
│   │   │   ├── appointments.queries.ts        # getSalonAppointments, getAppointmentsByDate
│   │   │   └── appointments.mutations.ts      # updateAppointmentStatus, assignStaff
│   │   └── types/
│   │       └── appointments.types.ts
│   │
│   ├── 📁 staff-management/                   # [organization.staff_profiles + identity.user_roles]
│   │   ├── components/
│   │   │   ├── staff-list.tsx
│   │   │   ├── staff-card.tsx
│   │   │   ├── staff-form.tsx
│   │   │   └── role-selector.tsx
│   │   ├── hooks/
│   │   │   └── use-staff-data.ts
│   │   ├── actions/
│   │   │   └── staff.actions.ts               # createStaff, updateStaff, deleteStaff, assignRole
│   │   ├── dal/
│   │   │   ├── staff.queries.ts               # getSalonStaff, getStaffById, getStaffServices
│   │   │   └── staff.mutations.ts             # createStaffProfile, updateStaffRole
│   │   └── types/
│   │       └── staff.types.ts
│   │
│   ├── 📁 staff-schedule/                     # [scheduling.staff_schedules + scheduling.blocked_times]
│   │   ├── components/
│   │   │   ├── schedule-calendar.tsx
│   │   │   ├── schedule-grid.tsx
│   │   │   ├── blocked-time-form.tsx
│   │   │   └── availability-editor.tsx
│   │   ├── hooks/
│   │   │   └── use-staff-schedule.ts
│   │   ├── actions/
│   │   │   └── schedule.actions.ts            # updateSchedule, createBlockedTime
│   │   ├── dal/
│   │   │   ├── schedule.queries.ts            # getStaffSchedule, getBlockedTimes
│   │   │   └── schedule.mutations.ts          # updateStaffSchedule, createBlockedTime
│   │   └── types/
│   │       └── schedule.types.ts
│   │
│   ├── 📁 services-management/                # [catalog.services + catalog.service_categories]
│   │   ├── components/
│   │   │   ├── services-grid.tsx
│   │   │   ├── service-card.tsx
│   │   │   ├── service-form.tsx
│   │   │   ├── category-selector.tsx
│   │   │   └── pricing-editor.tsx
│   │   ├── hooks/
│   │   │   └── use-services.ts
│   │   ├── actions/
│   │   │   └── services.actions.ts            # createService, updateService, deleteService
│   │   ├── dal/
│   │   │   ├── services.queries.ts            # getSalonServices, getServiceById, getCategories
│   │   │   └── services.mutations.ts          # createService, updatePricing
│   │   └── types/
│   │       └── services.types.ts
│   │
│   ├── 📁 customer-profile/                   # [identity.profiles + identity.profiles_metadata]
│   │   ├── components/
│   │   │   ├── profile-header.tsx
│   │   │   ├── profile-form.tsx
│   │   │   ├── appointments-list.tsx
│   │   │   └── favorites-list.tsx
│   │   ├── hooks/
│   │   │   └── use-profile.ts
│   │   ├── actions/
│   │   │   └── profile.actions.ts             # updateProfile, uploadAvatar
│   │   ├── dal/
│   │   │   ├── profile.queries.ts             # getUserProfile, getProfileMetadata
│   │   │   └── profile.mutations.ts           # updateProfile, updatePreferences
│   │   └── types/
│   │       └── profile.types.ts
│   │
│   ├── 📁 favorites/                          # [engagement.customer_favorites]
│   │   ├── components/
│   │   │   ├── favorites-grid.tsx
│   │   │   └── favorite-button.tsx
│   │   ├── hooks/
│   │   │   └── use-favorites.ts
│   │   ├── actions/
│   │   │   └── favorites.actions.ts           # addFavorite, removeFavorite
│   │   ├── dal/
│   │   │   ├── favorites.queries.ts           # getUserFavorites, isFavorite
│   │   │   └── favorites.mutations.ts         # toggleFavorite
│   │   └── types/
│   │       └── favorites.types.ts
│   │
│   ├── 📁 messaging/                          # [communication.messages + communication.message_threads]
│   │   ├── components/
│   │   │   ├── message-list.tsx
│   │   │   ├── message-input.tsx
│   │   │   ├── thread-list.tsx
│   │   │   └── message-bubble.tsx
│   │   ├── hooks/
│   │   │   ├── use-messages.ts
│   │   │   └── use-realtime-messages.ts
│   │   ├── actions/
│   │   │   └── messaging.actions.ts           # sendMessage, markAsRead
│   │   ├── dal/
│   │   │   ├── messages.queries.ts            # getUserThreads, getThreadMessages
│   │   │   └── messages.mutations.ts          # createMessage, updateReadStatus
│   │   └── types/
│   │       └── messaging.types.ts
│   │
│   ├── 📁 analytics/                          # [analytics.daily_metrics + analytics.operational_metrics]
│   │   ├── components/
│   │   │   ├── metrics-cards.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   ├── appointments-chart.tsx
│   │   │   └── analytics-dashboard.tsx
│   │   ├── hooks/
│   │   │   └── use-analytics.ts
│   │   ├── dal/
│   │   │   └── analytics.queries.ts           # getDailyMetrics, getOperationalMetrics
│   │   └── types/
│   │       └── analytics.types.ts
│   │
│   ├── 📁 inventory/                          # [inventory.* - 11 tables]
│   │   ├── components/
│   │   │   ├── products-list.tsx
│   │   │   ├── product-form.tsx
│   │   │   ├── stock-alerts.tsx
│   │   │   ├── purchase-order-form.tsx
│   │   │   └── inventory-dashboard.tsx
│   │   ├── hooks/
│   │   │   ├── use-inventory.ts
│   │   │   └── use-stock-alerts.ts
│   │   ├── actions/
│   │   │   └── inventory.actions.ts           # createProduct, updateStock, createOrder
│   │   ├── dal/
│   │   │   ├── inventory.queries.ts           # getProducts, getStockLevels, getOrders
│   │   │   └── inventory.mutations.ts         # recordMovement, updateStockLevel
│   │   └── types/
│   │       └── inventory.types.ts
│   │
│   ├── 📁 time-off-requests/                  # [scheduling.time_off_requests]
│   │   ├── components/
│   │   │   ├── time-off-form.tsx
│   │   │   ├── time-off-list.tsx
│   │   │   └── approval-modal.tsx
│   │   ├── hooks/
│   │   │   └── use-time-off.ts
│   │   ├── actions/
│   │   │   └── time-off.actions.ts            # requestTimeOff, approveRequest, denyRequest
│   │   ├── dal/
│   │   │   ├── time-off.queries.ts            # getStaffTimeOff, getPendingRequests
│   │   │   └── time-off.mutations.ts          # createRequest, updateRequestStatus
│   │   └── types/
│   │       └── time-off.types.ts
│   │
│   ├── 📁 auth/                               # [identity.user_roles + identity.sessions]
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   ├── signup-form.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   └── social-auth-buttons.tsx
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   └── use-current-user.ts
│   │   ├── actions/
│   │   │   └── auth.actions.ts                # signIn, signUp, signOut, resetPassword
│   │   ├── dal/
│   │   │   └── auth.queries.ts                # getCurrentUser, getUserRole
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── 📁 navigation/                         # Shared navigation components
│   │   ├── components/
│   │   │   ├── main-nav.tsx
│   │   │   ├── business-sidebar.tsx
│   │   │   ├── staff-nav.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   └── mobile-nav.tsx
│   │   └── utils/
│   │       └── navigation.constants.ts
│   │
│   ├── 📁 dashboard/                          # Dashboard widgets
│   │   ├── components/
│   │   │   ├── metrics-cards.tsx
│   │   │   ├── recent-bookings.tsx
│   │   │   ├── upcoming-appointments.tsx
│   │   │   └── quick-actions.tsx
│   │   ├── hooks/
│   │   │   └── use-dashboard-data.ts
│   │   └── dal/
│   │       └── dashboard.queries.ts
│   │
│   ├── 📁 notifications/                      # Notification system
│   │   ├── components/
│   │   │   ├── notification-bell.tsx
│   │   │   ├── notification-list.tsx
│   │   │   └── notification-item.tsx
│   │   ├── hooks/
│   │   │   └── use-notifications.ts
│   │   ├── actions/
│   │   │   └── notification.actions.ts
│   │   └── types/
│   │       └── notification.types.ts
│   │
│   └── 📁 admin-panel/                        # Admin-specific features
│       ├── components/
│       │   ├── salon-stats.tsx
│       │   ├── user-list.tsx
│       │   └── audit-log-viewer.tsx
│       ├── dal/
│       │   ├── admin.queries.ts
│       │   └── admin.mutations.ts
│       └── types/
│           └── admin.types.ts
│
├── 📁 components/                             # Shared UI components
│   │
│   ├── 📁 ui/                                 # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── calendar.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── popover.tsx
│   │   └── form.tsx
│   │
│   ├── 📁 layout/                             # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   ├── container.tsx
│   │   ├── page-header.tsx
│   │   └── section.tsx
│   │
│   └── 📁 shared/                             # Shared business components
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       ├── empty-state.tsx
│       ├── data-table.tsx
│       ├── pagination.tsx
│       ├── search-input.tsx
│       ├── filter-dropdown.tsx
│       ├── date-range-picker.tsx
│       ├── avatar-upload.tsx
│       ├── image-upload.tsx
│       └── confirmation-dialog.tsx
│
├── 📁 lib/                                    # Utilities & helpers
│   │
│   ├── 📁 supabase/                           # Supabase clients
│   │   ├── client.ts                          # Browser client
│   │   ├── server.ts                          # Server-side client
│   │   └── middleware.ts                      # Middleware client
│   │
│   ├── 📁 types/                              # TypeScript types
│   │   ├── database.types.ts                  # Generated from Supabase (10,566 lines)
│   │   ├── common.types.ts                    # Common app types
│   │   └── api.types.ts                       # API response types
│   │
│   ├── 📁 utils/                              # Utility functions
│   │   ├── cn.ts                              # className utility (clsx + tailwind-merge)
│   │   ├── date.ts                            # Date formatting & manipulation
│   │   ├── format.ts                          # Number, currency, etc. formatters
│   │   ├── validation.ts                      # Validation helpers
│   │   ├── errors.ts                          # Error handling utilities
│   │   ├── auth.ts                            # Auth helper functions
│   │   └── seo.ts                             # SEO metadata utilities
│   │
│   ├── 📁 hooks/                              # Global React hooks
│   │   ├── use-auth.ts                        # Authentication hook
│   │   ├── use-current-user.ts                # Get current user
│   │   ├── use-media-query.ts                 # Responsive breakpoints
│   │   ├── use-debounce.ts                    # Debounce values
│   │   ├── use-local-storage.ts               # LocalStorage hook
│   │   ├── use-toast.ts                       # Toast notifications
│   │   └── use-form-state.ts                  # Form state management
│   │
│   ├── 📁 constants/                          # App-wide constants
│   │   ├── routes.constants.ts                # Route definitions
│   │   ├── api.constants.ts                   # API endpoints
│   │   ├── config.constants.ts                # App configuration
│   │   └── roles.constants.ts                 # Role definitions & hierarchy
│   │
│   └── 📁 schemas/                            # Zod validation schemas
│       ├── auth.schemas.ts                    # Auth form schemas
│       ├── booking.schemas.ts                 # Booking form schemas
│       ├── profile.schemas.ts                 # Profile form schemas
│       └── salon.schemas.ts                   # Salon form schemas
│
├── 📁 public/                                 # Static assets
│   ├── 📁 images/
│   │   ├── logo.svg
│   │   ├── logo-dark.svg
│   │   ├── placeholder-salon.jpg
│   │   └── placeholder-avatar.jpg
│   ├── 📁 icons/
│   │   ├── favicon.ico
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── 📁 fonts/
│       └── (if using custom fonts)
│
├── 📁 docs/                                   # Documentation
│   ├── FINAL_ARCHITECTURE.md                  # Complete architecture (28KB)
│   ├── ROLE_BASED_ROUTING.md                  # Roles & routing (12KB)
│   ├── FRONTEND_BEST_PRACTICES.md             # Frontend patterns (49KB)
│   ├── SUPABASE_BEST_PRACTICES.md             # Database best practices (23KB)
│   ├── NAMING_CONVENTIONS.md                  # File/folder naming (18KB)
│   └── COMPLETE_PROJECT_TREE.md               # This file
│
├── 📁 scripts/                                # Utility scripts
│   ├── generate-types.py                      # Generate database types from Supabase
│   └── seed-data.ts                           # (future) Seed test data
│
├── 📁 supabase/                               # Supabase configuration
│   ├── 📁 migrations/                         # Database migrations
│   │   └── [timestamp]_[description].sql
│   ├── 📁 functions/                          # Edge functions
│   │   └── [function-name]/
│   │       └── index.ts
│   └── config.toml                            # Supabase config
│
├── middleware.ts                              # Next.js middleware (auth & routing)
├── next.config.mjs                            # Next.js configuration
├── tailwind.config.ts                         # Tailwind CSS config
├── tsconfig.json                              # TypeScript config
├── components.json                            # shadcn/ui config
├── package.json                               # Dependencies
├── pnpm-lock.yaml                             # Lock file
├── .env.local                                 # Environment variables (git-ignored)
├── .env.example                               # Environment template
├── .eslintrc.json                             # ESLint config
├── .prettierrc                                # Prettier config
├── .gitignore                                 # Git ignore rules
├── CLAUDE.md                                  # AI development guidelines (11KB)
└── README.md                                  # Project overview (9KB)
```

---

## 📋 FEATURE MODULES TO DATABASE MAPPING

| Feature Module | Primary Tables | Functions Used | Complexity |
|----------------|----------------|----------------|------------|
| **salon-discovery** | `organization.salons`, `catalog.services`, `organization.salon_media` | - | Medium |
| **booking** | `scheduling.appointments`, `scheduling.appointment_services` | `check_staff_availability`, `check_appointment_conflict` | High |
| **appointments-management** | `scheduling.appointments`, `scheduling.appointment_services` | `batch_update_appointment_status`, `get_appointment_stats` | High |
| **staff-management** | `organization.staff_profiles`, `identity.user_roles`, `catalog.staff_services` | - | Medium |
| **staff-schedule** | `scheduling.staff_schedules`, `scheduling.blocked_times` | `check_staff_availability` | High |
| **services-management** | `catalog.services`, `catalog.service_categories`, `catalog.service_pricing`, `catalog.service_booking_rules` | `calculate_service_price`, `calculate_service_duration` | Medium |
| **customer-profile** | `identity.profiles`, `identity.profiles_metadata`, `identity.profiles_preferences` | - | Low |
| **favorites** | `engagement.customer_favorites` | - | Low |
| **messaging** | `communication.messages`, `communication.message_threads` | `get_or_create_thread`, `get_unread_count` | Medium |
| **analytics** | `analytics.daily_metrics`, `analytics.operational_metrics` | `calculate_daily_metrics_v2`, `refresh_daily_metrics` | High |
| **inventory** | `inventory.*` (11 tables) | - | High |
| **time-off-requests** | `scheduling.time_off_requests` | - | Low |
| **auth** | `identity.user_roles`, `identity.sessions` | `get_user_role`, `user_has_salon_access` | Medium |
| **navigation** | All (role-based) | `get_user_role_for_salon` | Low |
| **dashboard** | `analytics.daily_metrics`, `scheduling.appointments` | `get_appointment_stats` | Medium |
| **notifications** | (future - using Supabase Realtime) | `send_notification`, `mark_notifications_read` | Medium |
| **admin-panel** | All tables | `audit_logs` functions, admin analytics | High |

**Total Feature Modules**: 17

---

## 🎯 FILE NAMING SUMMARY

### Folders: `kebab-case`
```
✅ features/salon-discovery/
✅ components/ui/
✅ app/(customer)/
```

### Files by Type:
```typescript
✅ Components:          salon-card.tsx
✅ Pages:               page.tsx, layout.tsx, loading.tsx
✅ DAL Queries:         salon.queries.ts
✅ DAL Mutations:       salon.mutations.ts
✅ Server Actions:      salon.actions.ts
✅ React Hooks:         use-salon-search.ts
✅ Types:               salon.types.ts
✅ Utils:               date.ts, format.ts
✅ Constants:           routes.constants.ts
✅ Tests:               salon.test.ts
```

---

## 📊 PROJECT STATISTICS

### Code Organization:
- **45 Database Tables** across 8 business domains
- **62 Database Functions** for business logic
- **4 Route Groups** (marketing, customer, staff, business, admin)
- **11 User Roles** (super_admin → guest)
- **17 Feature Modules** (domain-driven architecture)
- **50+ Page Routes** across all portals

### File Count Estimate:
- **App Routes**: ~80 files (pages + layouts)
- **Feature Modules**: ~200 files (components + hooks + DAL + actions)
- **Shared Components**: ~40 files (ui + layout + shared)
- **Lib Utilities**: ~30 files (utils + hooks + constants)
- **Total TypeScript/TSX Files**: ~350 files

### Lines of Code Estimate:
- **Database Types**: 10,566 lines (generated)
- **Feature Code**: ~15,000 lines
- **App Routes**: ~5,000 lines
- **Components**: ~8,000 lines
- **Total (excluding node_modules)**: ~40,000 lines

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Foundation
- [ ] Initialize Next.js 15 project
- [ ] Configure Tailwind CSS 4
- [ ] Install shadcn/ui components
- [ ] Set up Supabase clients (browser, server, middleware)
- [ ] Create middleware with role-based routing
- [ ] Set up database types generation script

### Phase 2: Core Features
- [ ] Implement auth module (login, signup, password reset)
- [ ] Create navigation components (4 portal layouts)
- [ ] Build salon-discovery feature
- [ ] Build booking feature
- [ ] Build customer-profile feature

### Phase 3: Business Features
- [ ] Implement appointments-management
- [ ] Build staff-management
- [ ] Create staff-schedule feature
- [ ] Build services-management
- [ ] Add analytics dashboard

### Phase 4: Advanced Features
- [ ] Implement inventory management (11 tables)
- [ ] Build messaging system
- [ ] Add time-off-requests
- [ ] Create notifications system
- [ ] Build admin panel

### Phase 5: Polish
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Create empty states
- [ ] Add SEO metadata
- [ ] Optimize images
- [ ] Add analytics tracking

---

## 🚀 GETTING STARTED

1. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Fill in Supabase URL and keys
   ```

2. **Generate database types**:
   ```bash
   python3 scripts/generate-types.py
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Run development server**:
   ```bash
   pnpm dev
   ```

5. **Start building features** (recommended order):
   - Auth → Navigation → Salon Discovery → Booking → Profile

---

## 📚 DOCUMENTATION QUICK LINKS

| Document | Purpose | Size |
|----------|---------|------|
| [FINAL_ARCHITECTURE.md](./FINAL_ARCHITECTURE.md) | Complete architecture explanation | 28KB |
| [ROLE_BASED_ROUTING.md](./ROLE_BASED_ROUTING.md) | Roles, routes, middleware implementation | 12KB |
| [FRONTEND_BEST_PRACTICES.md](./FRONTEND_BEST_PRACTICES.md) | Component patterns, DAL, state management | 49KB |
| [SUPABASE_BEST_PRACTICES.md](./SUPABASE_BEST_PRACTICES.md) | RLS, auth, query optimization | 23KB |
| [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) | File/folder naming rules | 18KB |
| [CLAUDE.md](../CLAUDE.md) | AI development guidelines | 11KB |
| [README.md](../README.md) | Project overview | 9KB |

---

**🎯 This is your complete project blueprint. Follow this structure exactly.**

**⚠️ IMPORTANT**: This tree is based on your **actual 45-table database structure**. Every feature maps to real tables in your database.types.ts file.

---

*Generated*: 2025-10-01
*Database*: 45 tables, 8 schemas, 62 functions
*Architecture*: Single Next.js 15 App
*Status*: Production-Ready Blueprint
