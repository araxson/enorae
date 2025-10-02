# 📝 NAMING CONVENTIONS & FILE PATTERNS

> **Navigation**: [📘 Docs Index](./INDEX.md) | [🏠 README](../README.md) | [🤖 CLAUDE.md](../CLAUDE.md)

> **Enorae Platform - Consistent Naming Rules**
> **Last Updated**: 2025-10-01

---

## 🎯 GOLDEN RULE

**One naming pattern per file type. Zero exceptions.**

---

## 📁 FOLDER NAMING

### Rule: `kebab-case` (all lowercase with hyphens)

```
✅ CORRECT:
features/
├── salon-discovery/
├── appointment-booking/
├── staff-management/
├── time-off-requests/
└── customer-profile/

❌ WRONG:
├── salonDiscovery/          # camelCase - NO
├── SalonDiscovery/          # PascalCase - NO
├── salon_discovery/         # snake_case - NO
├── Salon-Discovery/         # Mixed case - NO
```

### Special Cases:
```
✅ Route groups use parentheses:
app/
├── (marketing)/
├── (customer)/
├── (staff)/
├── (business)/
└── (admin)/

✅ Private folders use underscore prefix:
├── _components/             # Private to parent folder
├── _utils/                  # Not accessible via URL
└── _types/                  # Internal only
```

---

## 📄 FILE NAMING BY TYPE

### 1. **React Components** → `kebab-case.tsx`

```typescript
✅ CORRECT:
components/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   └── dialog.tsx
├── layout/
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── mobile-nav.tsx
└── shared/
    ├── salon-card.tsx
    ├── appointment-card.tsx
    └── booking-form.tsx

❌ WRONG:
├── Button.tsx               # PascalCase - NO
├── SalonCard.tsx            # PascalCase - NO
├── appointmentCard.tsx      # camelCase - NO
```

**Why kebab-case?**
- Matches HTML custom elements convention
- Better for URL routing
- Easier to read at a glance
- Consistent with CSS file naming

---

### 2. **Page Routes** → `page.tsx`, `layout.tsx`, `loading.tsx`

```typescript
✅ CORRECT (Next.js 15 convention):
app/
├── (customer)/
│   ├── page.tsx             # /customer
│   ├── layout.tsx           # Layout wrapper
│   ├── loading.tsx          # Loading UI
│   ├── error.tsx            # Error boundary
│   └── salons/
│       ├── page.tsx         # /customer/salons
│       └── [slug]/
│           └── page.tsx     # /customer/salons/[slug]

❌ WRONG:
├── index.tsx                # Not Next.js 15 pattern
├── salons.tsx               # Not Next.js 15 pattern
├── [slug].tsx               # Must be in folder
```

**Next.js 15 Special Files:**
- `page.tsx` - Route page
- `layout.tsx` - Shared layout
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page
- `route.ts` - API route

---

### 3. **Data Access Layer (DAL)** → `[feature].queries.ts`

```typescript
✅ CORRECT:
features/
├── salon-discovery/
│   └── dal/
│       ├── salon.queries.ts      # GET queries
│       ├── salon.mutations.ts    # INSERT/UPDATE/DELETE
│       └── salon.subscriptions.ts # Realtime subscriptions
│
├── booking/
│   └── dal/
│       ├── booking.queries.ts
│       └── booking.mutations.ts
│
└── staff-management/
    └── dal/
        ├── staff.queries.ts
        └── schedule.queries.ts

❌ WRONG:
├── queries.ts               # Too generic
├── dal.ts                   # Too generic
├── getSalons.ts            # Action name - use for actions/
├── salonQueries.ts         # camelCase - NO
```

**Pattern Explanation:**
- `[feature].queries.ts` - Read operations (SELECT)
- `[feature].mutations.ts` - Write operations (INSERT/UPDATE/DELETE)
- `[feature].subscriptions.ts` - Realtime listeners

---

### 4. **Server Actions** → `[feature].actions.ts`

```typescript
✅ CORRECT:
features/
├── booking/
│   └── actions/
│       ├── booking.actions.ts
│       ├── payment.actions.ts
│       └── cancellation.actions.ts
│
└── staff-management/
    └── actions/
        ├── staff.actions.ts
        └── schedule.actions.ts

❌ WRONG:
├── actions.ts               # Too generic
├── createBooking.ts        # Function name - NO
├── bookingActions.ts       # camelCase - NO
```

**File Content Pattern:**
```typescript
// booking.actions.ts
'use server'

export async function createBooking(formData: FormData) { }
export async function cancelBooking(id: string) { }
export async function rescheduleBooking(id: string, date: Date) { }
```

---

### 5. **React Hooks** → `use-[name].ts`

```typescript
✅ CORRECT:
features/booking/hooks/
├── use-booking-form.ts
├── use-available-slots.ts
└── use-booking-validation.ts

lib/hooks/
├── use-auth.ts
├── use-current-user.ts
└── use-debounce.ts

❌ WRONG:
├── useBookingForm.ts        # camelCase - NO
├── bookingForm.ts           # Missing 'use-' prefix
├── booking-form-hook.ts     # Redundant '-hook'
```

**Pattern Explanation:**
- Always prefix with `use-`
- Describes what the hook does
- Follows React conventions

---

### 6. **TypeScript Types** → `[feature].types.ts`

```typescript
✅ CORRECT:
features/booking/types/
├── booking.types.ts
├── payment.types.ts
└── availability.types.ts

lib/types/
├── database.types.ts        # Generated from Supabase
├── api.types.ts
└── common.types.ts

❌ WRONG:
├── types.ts                 # Too generic
├── bookingTypes.ts         # camelCase - NO
├── booking-interfaces.ts   # Use .types.ts suffix
├── IBooking.ts            # Hungarian notation - NO
```

**File Content Pattern:**
```typescript
// booking.types.ts
import type { Database } from '@/lib/types/database.types'

export type Booking = Database['public']['Views']['appointments']['Row']
export type CreateBookingInput = Pick<Booking, 'salon_id' | 'service_id' | 'start_time'>
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
```

---

### 7. **Utilities** → `[purpose].ts`

```typescript
✅ CORRECT:
lib/utils/
├── cn.ts                    # className utility
├── date.ts                  # Date helpers
├── format.ts                # Formatters
├── validation.ts            # Validators
└── auth.ts                  # Auth helpers

features/booking/utils/
├── time-slots.ts
├── price-calculator.ts
└── booking-validation.ts

❌ WRONG:
├── utils.ts                 # Too generic
├── helpers.ts               # Too generic
├── dateUtils.ts            # camelCase - NO
├── utils/index.ts          # Don't barrel export utils
```

---

### 8. **Constants** → `[category].constants.ts`

```typescript
✅ CORRECT:
lib/constants/
├── routes.constants.ts
├── api.constants.ts
└── config.constants.ts

features/booking/constants/
├── booking-rules.constants.ts
└── time-slots.constants.ts

❌ WRONG:
├── constants.ts             # Too generic
├── CONSTANTS.ts            # All caps - NO
├── bookingRules.ts         # Missing .constants.ts suffix
```

**File Content Pattern:**
```typescript
// routes.constants.ts
export const ROUTES = {
  CUSTOMER: {
    HOME: '/',
    SALONS: '/salons',
    BOOKING: '/book',
  },
  STAFF: {
    SCHEDULE: '/staff/schedule',
    APPOINTMENTS: '/staff/appointments',
  },
} as const
```

---

### 9. **Test Files** → `[filename].test.ts` or `[filename].spec.ts`

```typescript
✅ CORRECT:
features/booking/
├── actions/
│   ├── booking.actions.ts
│   └── booking.actions.test.ts
├── utils/
│   ├── price-calculator.ts
│   └── price-calculator.test.ts

❌ WRONG:
├── __tests__/
│   └── booking.ts           # Test suffix missing
├── booking.spec.tsx         # Use .test.ts for non-components
```

**Patterns:**
- `.test.ts` for unit tests
- `.spec.ts` for integration tests (optional)
- `.e2e.ts` for end-to-end tests

---

### 10. **Configuration Files** → `[tool].config.[ext]`

```typescript
✅ CORRECT (Root level):
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── prettier.config.js

❌ WRONG:
├── next.config.js           # Use .mjs for ESM
├── tailwindConfig.ts        # camelCase - NO
├── .eslintrc               # Old format
```

---

## 🗂️ FEATURE MODULE STRUCTURE

### Complete Pattern:

```
features/
└── [feature-name]/              # kebab-case
    ├── components/              # Feature-specific components
    │   ├── [component].tsx      # kebab-case
    │   └── [component].test.tsx
    │
    ├── hooks/                   # Feature-specific hooks
    │   └── use-[name].ts        # use- prefix
    │
    ├── actions/                 # Server actions
    │   └── [feature].actions.ts
    │
    ├── dal/                     # Data access layer
    │   ├── [feature].queries.ts
    │   └── [feature].mutations.ts
    │
    ├── types/                   # Feature types
    │   └── [feature].types.ts
    │
    ├── utils/                   # Feature utilities
    │   └── [purpose].ts
    │
    ├── constants/               # Feature constants
    │   └── [category].constants.ts
    │
    └── index.tsx                # Public API (optional)
```

### Example: `features/booking/`

```
features/booking/
├── components/
│   ├── booking-form.tsx
│   ├── date-time-picker.tsx
│   ├── service-selector.tsx
│   └── payment-summary.tsx
│
├── hooks/
│   ├── use-booking-form.ts
│   ├── use-available-slots.ts
│   └── use-booking-validation.ts
│
├── actions/
│   ├── booking.actions.ts
│   └── payment.actions.ts
│
├── dal/
│   ├── booking.queries.ts
│   └── booking.mutations.ts
│
├── types/
│   └── booking.types.ts
│
├── utils/
│   ├── time-slots.ts
│   └── price-calculator.ts
│
└── constants/
    └── booking-rules.constants.ts
```

---

## 🚫 FORBIDDEN PATTERNS

### Never Use These Suffixes:
```
❌ -fixed.tsx
❌ -v2.tsx
❌ -new.tsx
❌ -old.tsx
❌ -temp.tsx
❌ -backup.tsx
❌ -copy.tsx
❌ -updated.tsx
❌ -revised.tsx
❌ -final.tsx
```

**Why?** These indicate poor version control and planning.

**Solution:** Use git branches and proper naming from the start.

---

### Never Use These Naming Styles:

```typescript
❌ PascalCase for files:
├── SalonCard.tsx            # Use salon-card.tsx
├── BookingForm.tsx          # Use booking-form.tsx

❌ camelCase for files:
├── salonCard.tsx            # Use salon-card.tsx
├── bookingForm.tsx          # Use booking-form.tsx

❌ snake_case for files:
├── salon_card.tsx           # Use salon-card.tsx
├── booking_form.tsx         # Use booking-form.tsx

❌ Hungarian notation:
├── ISalon.ts                # Use salon.types.ts
├── TSalonProps.ts           # Use salon.types.ts
├── strSalonName.ts          # TypeScript has types!

❌ Abbreviations (unless standard):
├── btn.tsx                  # Use button.tsx
├── nav.tsx                  # OK - standard abbreviation
├── appt.tsx                 # Use appointment.tsx
├── msg.tsx                  # Use message.tsx
```

---

## 📊 VARIABLE & FUNCTION NAMING

### Inside TypeScript/JavaScript Files:

```typescript
// ✅ CORRECT PATTERNS:

// 1. React Components - PascalCase
export function SalonCard({ salon }: Props) { }
export const BookingForm = () => { }

// 2. Functions - camelCase
function calculatePrice(service: Service) { }
async function fetchSalons() { }

// 3. Variables - camelCase
const salonData = await getSalons()
let isLoading = false

// 4. Constants - UPPER_SNAKE_CASE
const MAX_BOOKING_DAYS = 90
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// 5. Types & Interfaces - PascalCase
type SalonCardProps = { salon: Salon }
interface BookingFormData { }

// 6. Enums - PascalCase (keys UPPER_SNAKE_CASE)
enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
}

// 7. Private/Internal - _camelCase (prefix with underscore)
function _internalHelper() { }
const _privateData = { }

// 8. Boolean variables - is/has/should prefix
const isLoading = false
const hasPermission = true
const shouldShowModal = false
```

---

## 🎨 CSS/SCSS NAMING

### Tailwind CSS (Primary):
```typescript
// Use Tailwind utilities directly
<div className="flex items-center gap-4 rounded-lg border p-4">
```

### Custom CSS (if needed) - BEM Pattern:
```css
/* Block - kebab-case */
.salon-card { }

/* Element - double underscore */
.salon-card__title { }
.salon-card__image { }

/* Modifier - double hyphen */
.salon-card--featured { }
.salon-card--large { }
```

---

## 📁 COMPLETE PROJECT STRUCTURE WITH NAMING

```
enorae/
├── app/                           # Next.js App Router
│   ├── (marketing)/              # Route group
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx            # Marketing layout
│   │   └── about/
│   │       └── page.tsx
│   │
│   ├── (customer)/               # Route group
│   │   ├── layout.tsx            # Customer layout
│   │   ├── salons/
│   │   │   ├── page.tsx          # /salons
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # /salons/[slug]
│   │   └── book/
│   │       └── page.tsx
│   │
│   ├── (staff)/                  # Route group
│   │   ├── layout.tsx
│   │   └── schedule/
│   │       └── page.tsx
│   │
│   ├── (business)/               # Route group
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   │
│   └── (admin)/                  # Route group
│       ├── layout.tsx
│       └── salons/
│           └── page.tsx
│
├── features/                      # Feature modules
│   ├── salon-discovery/
│   │   ├── components/
│   │   │   ├── salon-card.tsx
│   │   │   ├── salon-grid.tsx
│   │   │   └── search-filters.tsx
│   │   ├── hooks/
│   │   │   └── use-salon-search.ts
│   │   ├── actions/
│   │   │   └── salon.actions.ts
│   │   ├── dal/
│   │   │   └── salon.queries.ts
│   │   └── types/
│   │       └── salon.types.ts
│   │
│   ├── booking/
│   │   ├── components/
│   │   │   ├── booking-form.tsx
│   │   │   ├── date-time-picker.tsx
│   │   │   └── service-selector.tsx
│   │   ├── actions/
│   │   │   └── booking.actions.ts
│   │   └── dal/
│   │       ├── booking.queries.ts
│   │       └── booking.mutations.ts
│   │
│   └── [18 more feature modules...]
│
├── components/                    # Shared components
│   ├── ui/                       # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── input.tsx
│   │
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   │
│   └── shared/                   # Shared business components
│       ├── loading-spinner.tsx
│       └── error-boundary.tsx
│
├── lib/                          # Utilities & helpers
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   │
│   ├── types/
│   │   ├── database.types.ts     # Generated from Supabase
│   │   └── common.types.ts
│   │
│   ├── utils/
│   │   ├── cn.ts                 # className utility
│   │   ├── date.ts
│   │   └── format.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-media-query.ts
│   │
│   └── constants/
│       ├── routes.constants.ts
│       └── api.constants.ts
│
├── public/                        # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── docs/                          # Documentation
│   ├── FINAL_ARCHITECTURE.md
│   ├── ROLE_BASED_ROUTING.md
│   ├── FRONTEND_BEST_PRACTICES.md
│   ├── SUPABASE_BEST_PRACTICES.md
│   └── NAMING_CONVENTIONS.md     # This file
│
├── scripts/                       # Utility scripts
│   └── generate-types.py
│
├── next.config.mjs               # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── CLAUDE.md                     # AI guidelines
└── README.md                     # Project overview
```

---

## ✅ NAMING CHECKLIST

Before creating any file or folder, verify:

- [ ] Folder name is `kebab-case`
- [ ] File name matches its type pattern
- [ ] No version suffixes (-v2, -new, etc.)
- [ ] No mixed naming styles
- [ ] Component files are `kebab-case.tsx`
- [ ] DAL files are `[feature].queries.ts`
- [ ] Action files are `[feature].actions.ts`
- [ ] Hook files are `use-[name].ts`
- [ ] Type files are `[feature].types.ts`
- [ ] Inside files: Components are PascalCase, functions are camelCase
- [ ] Constants are UPPER_SNAKE_CASE
- [ ] Boolean variables have is/has/should prefix

---

## 🎯 QUICK REFERENCE

| File Type | Pattern | Example |
|-----------|---------|---------|
| **Component** | `kebab-case.tsx` | `salon-card.tsx` |
| **Page** | `page.tsx` | `app/(customer)/salons/page.tsx` |
| **Layout** | `layout.tsx` | `app/(customer)/layout.tsx` |
| **DAL Query** | `[feature].queries.ts` | `salon.queries.ts` |
| **DAL Mutation** | `[feature].mutations.ts` | `booking.mutations.ts` |
| **Server Action** | `[feature].actions.ts` | `booking.actions.ts` |
| **Hook** | `use-[name].ts` | `use-booking-form.ts` |
| **Type** | `[feature].types.ts` | `booking.types.ts` |
| **Util** | `[purpose].ts` | `date.ts`, `format.ts` |
| **Constant** | `[category].constants.ts` | `routes.constants.ts` |
| **Test** | `[filename].test.ts` | `booking.actions.test.ts` |

---

## 📚 REASONING BEHIND PATTERNS

### Why kebab-case for files?
1. **URL-friendly**: Matches URL slugs naturally
2. **Case-insensitive filesystems**: No issues on macOS vs Linux
3. **Better readability**: `salon-card.tsx` vs `SalonCard.tsx`
4. **Industry standard**: Used by Vue, Angular, Web Components

### Why PascalCase for components inside files?
1. **React convention**: JSX requires PascalCase for custom components
2. **Clear distinction**: `<SalonCard />` vs `<div />`
3. **TypeScript compatibility**: Aligns with type naming

### Why `[feature].queries.ts` pattern?
1. **Descriptive**: Immediately know what the file contains
2. **Grouping**: All DAL files grouped by feature in autocomplete
3. **Scalable**: Easy to add `.mutations.ts`, `.subscriptions.ts`

### Why `use-` prefix for hooks?
1. **React Rules of Hooks**: Linter recognizes the pattern
2. **Clear intent**: Immediately know it's a hook
3. **Standard convention**: Matches React's built-in hooks

---

**REMEMBER**: Consistency is more important than perfection. Pick one pattern and stick to it across the entire codebase.

---

*Last Updated: 2025-10-01*
*Total Patterns: 10 file types, 8 folder rules*
*Status: Production-Ready*
