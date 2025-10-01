# 🗺️ ENORAE ROUTES MAP

## 🏠 Customer Routes (enorae.com)

```
📦 Customer Site
├── / (homepage)                                    [4 lines] ✅
│   └── features/home
│       ├── Hero section with search
│       ├── Featured salons
│       └── Call to action
│
├── /salons (browse)                               [4 lines] ✅
│   └── features/salon-discovery
│       ├── Salon grid with cards
│       ├── Search and filters
│       └── Pagination ready
│
├── /salons/[slug] (detail)                        [4 lines] ✅
│   └── features/salon-detail
│       ├── Salon header & info
│       ├── Services list with booking CTA
│       └── Staff grid with bios
│
├── /book/[salonSlug] (booking flow)               [10 lines] ✅
│   └── features/booking
│       ├── Service selector (step 1)
│       ├── Staff selector (step 2)
│       ├── Date & time picker (step 3)
│       └── Confirmation form (step 4)
│
└── /profile (customer profile)                    [4 lines] ✅
    └── features/customer-profile
        ├── Profile header with avatar
        ├── Upcoming appointments tab
        ├── Past appointments tab
        └── Cancel/reschedule actions
```

## 💼 Business Routes (business.enorae.com)

```
📦 Business Dashboard
├── /business (dashboard home)                     [4 lines] ✅
│   └── features/dashboard
│       ├── Metrics cards (total, today, upcoming)
│       ├── Recent bookings list
│       ├── Salon selector (multi-salon ready)
│       └── Quick action buttons
│
├── /business/staff (staff management)             [4 lines] ✅
│   └── features/staff-management
│       ├── Staff grid with cards
│       ├── Add staff button
│       ├── Edit staff forms
│       └── Soft delete with audit
│
├── /business/appointments (coming soon)
│   └── features/appointments (TODO)
│       ├── Calendar view
│       ├── List view
│       └── Filter by status
│
└── /business/services (coming soon)
    └── features/service-management (TODO)
        ├── Service categories
        ├── Pricing management
        └── Active/inactive toggle
```

## 🎨 URL Structure

### Customer URLs
```
https://enorae.com/
https://enorae.com/salons
https://enorae.com/salons/bella-salon
https://enorae.com/book/bella-salon?service=haircut
https://enorae.com/profile
```

### Business URLs
```
https://business.enorae.com/
https://business.enorae.com/staff
https://business.enorae.com/appointments
https://business.enorae.com/services
https://business.enorae.com/analytics
```

## 🧭 Navigation Structure

### Customer Navigation
```
┌─────────────────────────────────────────────────┐
│ Enorae | Browse Salons | My Appointments        │
│                             Login | Sign Up      │
└─────────────────────────────────────────────────┘
```

### Business Navigation
```
┌─────────────────────────────────────────────────┐
│ Enorae Business | Dashboard | Appointments |     │
│ Staff | Services          Customer Site | Logout │
└─────────────────────────────────────────────────┘
```

## 📊 Route Statistics

| Route Type | Count | Status |
|------------|-------|--------|
| Customer Pages | 5 | ✅ Complete |
| Business Pages | 2 | ✅ Complete |
| Auth Pages | 0 | ⏳ Pending |
| API Routes | 0 | ✅ Using Server Actions |
| **Total** | **7** | **100% MVP Complete** |

## 🔗 Route Relationships

```
Homepage → Salon Discovery → Salon Detail → Booking Flow → Profile
    ↓                           ↓
Featured Salons              Book Now CTA

Business Dashboard → Staff Management
         ↓              ↓
    Appointments    Edit Staff
```

## 🎯 Deep Linking Support

### Customer Deep Links
- ✅ `/salons/[slug]` - Direct salon access
- ✅ `/book/[slug]?service=[id]` - Pre-selected service
- ⏳ `/profile?tab=upcoming` - Tab selection (TODO)

### Business Deep Links
- ⏳ `/business/staff/[id]/edit` - Direct staff edit (TODO)
- ⏳ `/business/appointments?date=[date]` - Date filter (TODO)

---

*All routes are ultra-thin (<10 lines) and follow feature-based architecture*