# 🏗️ ENORAE ARCHITECTURE - Simplified & Production-Ready

## 📌 Executive Summary

Enorae follows a **Modular Monolith** architecture pattern - the sweet spot between simplicity and scalability. This document outlines the complete system architecture based on our clean database structure.

## 🎯 Architecture Principles

1. **KISS (Keep It Simple)** - Don't over-engineer
2. **DRY (Don't Repeat Yourself)** - Reuse components
3. **YAGNI (You Aren't Gonna Need It)** - Build only what's needed
4. **Convention over Configuration** - Follow established patterns
5. **Database-First Design** - Leverage existing 101 tables

## 🏛️ System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
├──────────────┬──────────────┬──────────────────────────┤
│   Customer   │   Business   │         Admin            │
│  (enorae.com)│(business.*)  │      (admin.*)           │
└──────┬───────┴──────┬───────┴──────────┬───────────────┘
       │              │                   │
       └──────────────┼───────────────────┘
                      │
              ┌───────▼────────┐
              │   Next.js 15   │
              │   App Router   │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │  Server Actions│
              │   & API Routes │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │    Supabase    │
              │  (PostgreSQL)  │
              │   101 Tables   │
              └────────────────┘
```

## 📁 Project Structure

### Monorepo Layout
```
enorae/
├── apps/
│   └── web/                    # Single Next.js application
│       ├── app/                # App router
│       ├── features/           # Feature modules
│       ├── components/         # Shared UI components
│       └── lib/               # Utilities
│
├── packages/
│   ├── database/              # Database client & types
│   ├── ui/                    # Design system (shadcn/ui)
│   └── core/                  # Business logic
│
├── supabase/
│   ├── migrations/            # SQL migrations
│   └── functions/             # Edge functions
│
└── infrastructure/
    ├── docker/                # Container configs
    └── scripts/               # Deployment scripts
```

## 🗄️ Database Architecture

### Schema Organization (101 Tables)
```
┌────────────────────────────────────────────────────┐
│                  PUBLIC SCHEMA                      │
│         (Views for simplified access)               │
├────────────────────────────────────────────────────┤
│ • salons        • services      • appointments     │
│ • staff         • profiles      • reviews          │
└────────────────────────────────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────┐
│              BUSINESS SCHEMAS                       │
├──────────────┬─────────────┬───────────────────────┤
│ organization │   catalog   │    scheduling         │
│  (8 tables)  │ (5 tables)  │    (7 tables)         │
├──────────────┼─────────────┼───────────────────────┤
│  inventory   │  identity   │   communication       │
│ (10 tables)  │ (8 tables)  │    (3 tables)         │
├──────────────┼─────────────┼───────────────────────┤
│  analytics   │ engagement  │     security          │
│  (3 tables)  │ (1 table)   │    (8 tables)         │
└──────────────┴─────────────┴───────────────────────┘
```

## 🔄 Data Flow Architecture

### Request Lifecycle
```
1. User Action
   └─> 2. Next.js Page/Component
       └─> 3. Server Action / API Route
           └─> 4. Feature Module (DAL)
               └─> 5. Supabase Client
                   └─> 6. PostgreSQL (RLS)
                       └─> 7. Response
```

### Authentication Flow
```
1. User Login
   └─> 2. Supabase Auth
       └─> 3. JWT Token
           └─> 4. Session Cookie
               └─> 5. Server Validation
                   └─> 6. RLS Enforcement
```

## 🧩 Feature Module Architecture

### Module Structure
```
features/
├── booking/
│   ├── components/       # UI Components
│   │   ├── booking-form.tsx
│   │   ├── time-slot-picker.tsx
│   │   └── service-selector.tsx
│   ├── dal/              # Data Access Layer
│   │   ├── booking.queries.ts
│   │   └── booking.mutations.ts
│   ├── actions/          # Server Actions
│   │   └── booking.actions.ts
│   ├── hooks/            # React Hooks
│   │   └── use-available-slots.ts
│   └── types/            # Type Definitions
│       └── booking.types.ts
│
├── salon-management/
├── customer-portal/
├── staff-portal/
└── analytics/
```

### Module Dependencies
```
┌─────────────────────────────────────────┐
│            Feature Module               │
├─────────────────────────────────────────┤
│ Imports From:                           │
│ • @/packages/database (types & client)  │
│ • @/components/ui (shadcn components)   │
│ • @/lib (utilities)                     │
├─────────────────────────────────────────┤
│ Exports:                                │
│ • Components (for pages)                │
│ • Actions (for forms)                   │
│ • Hooks (for client logic)              │
└─────────────────────────────────────────┘
```

## 🔐 Security Architecture

### Multi-Layer Security
```
Layer 1: Client Validation
   └─> Layer 2: Server Validation
       └─> Layer 3: API Authentication
           └─> Layer 4: Database RLS
               └─> Layer 5: Audit Logging
```

### Row Level Security (RLS) Strategy
```sql
-- Example: Salons can only be viewed by owner
CREATE POLICY "Users can view own salons" ON salons
  FOR SELECT USING (auth.uid() = owner_id);

-- Example: Staff can view their salon
CREATE POLICY "Staff can view their salon" ON salons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_profiles
      WHERE staff_profiles.salon_id = salons.id
      AND staff_profiles.user_id = auth.uid()
    )
  );
```

## 🚀 Deployment Architecture

### Production Environment
```
┌──────────────────────────────────────┐
│         Vercel (Frontend)            │
│     • Next.js App                    │
│     • Edge Functions                 │
│     • CDN Distribution               │
└──────────────┬───────────────────────┘
               │
               │ HTTPS
               │
┌──────────────▼───────────────────────┐
│      Supabase Cloud (Backend)        │
│     • PostgreSQL Database            │
│     • Authentication                 │
│     • Realtime Subscriptions         │
│     • File Storage                   │
└──────────────────────────────────────┘
```

### Environment Strategy
```
Development:
  └─> localhost:3000 + Local Supabase

Staging:
  └─> staging.enorae.com + Staging Supabase

Production:
  └─> enorae.com + Production Supabase
```

## 📊 Scalability Path

### Current: MVP Phase (0-100 salons)
```
• Single Next.js app
• Single Supabase instance
• Monolithic deployment
```

### Growth: Scale Phase (100-1,000 salons)
```
• Add Redis caching
• Database read replicas
• CDN for static assets
```

### Future: Enterprise Phase (1,000+ salons)
```
• Consider microservices split
• Multi-region deployment
• Database sharding
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **State**: React Server Components
- **Forms**: Server Actions

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **Functions**: Edge Functions

### DevOps
- **Hosting**: Vercel (Frontend)
- **Database**: Supabase Cloud
- **Monitoring**: Vercel Analytics
- **CI/CD**: GitHub Actions

## 📋 Development Workflow

### Feature Development Process
```
1. Design → Create UI mockups
2. Schema → Verify database tables exist
3. Types → Generate TypeScript types
4. DAL → Create data access layer
5. Actions → Implement server actions
6. Components → Build UI components
7. Pages → Integrate into app routes
8. Test → Manual and automated testing
9. Deploy → Push to production
```

### Git Branch Strategy
```
main
├── develop
│   ├── feature/booking-system
│   ├── feature/staff-management
│   └── feature/analytics-dashboard
└── hotfix/critical-bug
```

## 🎯 MVP Roadmap

### Week 1-2: Foundation
- [x] Database cleanup (COMPLETED)
- [x] Architecture design (COMPLETED)
- [ ] Authentication setup
- [ ] Basic UI scaffolding

### Week 3-4: Core Features
- [ ] Salon discovery
- [ ] Service catalog
- [ ] Appointment booking
- [ ] Customer profiles

### Week 5-6: Business Features
- [ ] Business dashboard
- [ ] Staff management
- [ ] Schedule management
- [ ] Basic analytics

### Week 7-8: Polish
- [ ] Email notifications
- [ ] Payment integration
- [ ] Mobile optimization
- [ ] Performance tuning

## 📐 Design Patterns

### Pattern Usage
```typescript
// 1. Repository Pattern (DAL)
class SalonRepository {
  async findById(id: string) { ... }
  async findByOwner(ownerId: string) { ... }
}

// 2. Factory Pattern (Object Creation)
class AppointmentFactory {
  static create(data: AppointmentData) { ... }
}

// 3. Observer Pattern (Realtime)
supabase.channel('appointments')
  .on('INSERT', handleNewAppointment)
  .subscribe()

// 4. Singleton Pattern (Database Client)
let client: SupabaseClient | null = null
export function getClient() {
  if (!client) client = createClient()
  return client
}
```

## 🔍 Monitoring & Observability

### Key Metrics
- **Performance**: Core Web Vitals (LCP, FID, CLS)
- **Availability**: Uptime monitoring
- **Errors**: Sentry error tracking
- **Usage**: Analytics events
- **Database**: Query performance

### Logging Strategy
```typescript
// Structured logging
logger.info('Appointment created', {
  appointmentId: id,
  salonId: salon.id,
  userId: user.id,
  timestamp: new Date()
})
```

## 📚 API Design

### RESTful Endpoints
```
GET    /api/salons              # List salons
GET    /api/salons/:id          # Get salon
POST   /api/appointments        # Create appointment
PATCH  /api/appointments/:id    # Update appointment
DELETE /api/appointments/:id    # Cancel appointment
```

### Server Actions
```typescript
// Preferred over API routes for mutations
async function createAppointment(data: FormData) {
  'use server'
  // Direct database interaction
  // Automatic revalidation
  // Type-safe
}
```

## 🎨 UI/UX Architecture

### Design System
```
Foundation:
├── Colors (Semantic tokens)
├── Typography (System fonts)
├── Spacing (8px grid)
└── Shadows (Elevation system)

Components:
├── Primitives (Button, Input, Card)
├── Patterns (Forms, Lists, Modals)
└── Templates (Layouts, Pages)
```

### Responsive Strategy
```
Mobile First:
320px  → Mobile
768px  → Tablet
1024px → Desktop
1440px → Wide screen
```

## 🔧 Configuration Management

### Environment Variables
```bash
# Public (exposed to client)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Private (server only)
SUPABASE_SERVICE_KEY=
DATABASE_URL=
SMTP_HOST=
STRIPE_SECRET_KEY=
```

## 📝 Documentation Structure

```
docs/
├── architecture/      # System design
├── api/              # API documentation
├── database/         # Schema documentation
├── deployment/       # Deployment guides
└── development/      # Development guides
```

## ✅ Success Metrics

### Technical KPIs
- Page Load Time: < 2s
- Time to Interactive: < 3s
- API Response Time: < 200ms
- Database Query Time: < 50ms
- Uptime: > 99.9%

### Business KPIs
- User Sign-ups
- Bookings per day
- Salon onboarding rate
- Customer satisfaction score
- Revenue per salon

---

*Architecture Version: 2.0*
*Last Updated: 2025-09-30*
*Status: Production-Ready*
*Database: 101 tables optimized*