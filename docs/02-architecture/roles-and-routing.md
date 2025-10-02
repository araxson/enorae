# 🔐 ROLE-BASED ROUTING & ACCESS CONTROL

> **Navigation**: [📘 Docs Index](./INDEX.md) | [🏠 README](../README.md) | [🤖 CLAUDE.md](../CLAUDE.md)

> **Enorae Platform - 11 Roles, 4 Portals**
> **Last Updated**: 2025-10-01

---

## 🎭 ROLE HIERARCHY (11 Roles)

### Platform Level (2 roles)
```typescript
'super_admin'      // Full system access, database access, user management
'platform_admin'   // Platform management, analytics, salon oversight
```

### Business Level (3 roles)
```typescript
'tenant_owner'     // Multi-salon chain owner (full access to all salons)
'salon_owner'      // Single salon owner (full access to one salon)
'salon_manager'    // Salon manager (limited admin access)
```

### Staff Level (3 roles)
```typescript
'senior_staff'     // Senior stylist/technician (lead staff)
'staff'            // Regular staff member (stylist, technician)
'junior_staff'     // Junior/trainee staff
```

### Customer Level (3 roles)
```typescript
'vip_customer'     // VIP/premium customer (special perks)
'customer'         // Regular customer
'guest'            // Guest/anonymous user (browse only)
```

---

## 🗺️ ROUTE GROUPS TO ROLES MAPPING

### 1. **(marketing)** - Public Routes
**URL**: `/`, `/about`, `/pricing`, `/contact`
**Access**: Everyone (no auth required)
**Roles**: All + unauthenticated users

```typescript
// No auth required
export const config = {
  matcher: [
    '/((?!_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}
```

---

### 2. **(customer)** - Customer Portal
**URL**: `/explore`, `/salons`, `/appointments`, `/favorites`, `/profile`
**Access**: Authenticated customers only
**Roles**: `customer`, `vip_customer`, `guest` (limited)

```typescript
const CUSTOMER_ROUTES = ['/explore', '/salons', '/appointments', '/favorites', '/profile']
const CUSTOMER_ROLES = ['customer', 'vip_customer', 'guest']
```

**Features**:
- Browse salons
- Book appointments
- Manage favorites
- View booking history
- Customer profile
- Messages with salon

---

### 3. **(staff)** - Staff Portal
**URL**: `/staff/*`
**Access**: Staff members only
**Roles**: `senior_staff`, `staff`, `junior_staff`

```typescript
const STAFF_ROUTES = ['/staff']
const STAFF_ROLES = ['senior_staff', 'staff', 'junior_staff']
```

**Features**:
- View today's schedule
- Manage appointments (check-in, complete)
- Request time off
- View customer history
- Track performance/commissions
- Personal profile

**Staff-Specific Permissions**:
- `senior_staff`: Can manage junior staff schedules
- `staff`: Standard access
- `junior_staff`: Read-only on some features

---

### 4. **(business)** - Business Management
**URL**: `/business/*`
**Access**: Business owners and managers
**Roles**: `tenant_owner`, `salon_owner`, `salon_manager`

```typescript
const BUSINESS_ROUTES = ['/business']
const BUSINESS_ROLES = ['tenant_owner', 'salon_owner', 'salon_manager']
```

**Features**:
- Analytics dashboard
- Appointment management
- Customer management
- Staff management
- Service management
- Inventory management
- Financial reports
- Salon settings

**Business-Specific Permissions**:
- `tenant_owner`: Access to ALL salons in chain
- `salon_owner`: Access to owned salon(s)
- `salon_manager`: Limited access to assigned salon

---

### 5. **(admin)** - Platform Admin
**URL**: `/admin/*`
**Access**: Platform administrators only
**Roles**: `super_admin`, `platform_admin`

```typescript
const ADMIN_ROUTES = ['/admin']
const ADMIN_ROLES = ['super_admin', 'platform_admin']
```

**Features**:
- Platform analytics
- All salons management
- All users management
- Audit logs
- System settings
- Feature flags
- Database monitoring

**Admin-Specific Permissions**:
- `super_admin`: Full access including database
- `platform_admin`: Platform management (no database access)

---

## 🛡️ MIDDLEWARE IMPLEMENTATION

### `middleware.ts` (Root Level)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/types/database.types'

type Role = Database['public']['Enums']['role_type']

// Route to roles mapping
const ROUTE_ROLES: Record<string, Role[]> = {
  '/staff': ['senior_staff', 'staff', 'junior_staff'],
  '/business': ['tenant_owner', 'salon_owner', 'salon_manager'],
  '/admin': ['super_admin', 'platform_admin'],
  '/explore': ['customer', 'vip_customer', 'guest', 'senior_staff', 'staff', 'junior_staff'],
  '/appointments': ['customer', 'vip_customer', 'senior_staff', 'staff', 'junior_staff'],
  '/profile': ['customer', 'vip_customer', 'senior_staff', 'staff', 'junior_staff', 'tenant_owner', 'salon_owner', 'salon_manager'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth for public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/pricing' ||
    pathname === '/contact'
  ) {
    return NextResponse.next()
  }

  // Create Supabase client
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
      },
    }
  )

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Get user role
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!userRole) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const role = userRole.role as Role

  // Check if user has access to this route
  const routePrefix = '/' + pathname.split('/')[1]
  const allowedRoles = ROUTE_ROLES[routePrefix]

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    return NextResponse.redirect(new URL(getDefaultRoute(role), request.url))
  }

  return NextResponse.next()
}

// Get default route based on role
function getDefaultRoute(role: Role): string {
  // Admin roles
  if (role === 'super_admin' || role === 'platform_admin') {
    return '/admin'
  }

  // Business roles
  if (role === 'tenant_owner' || role === 'salon_owner' || role === 'salon_manager') {
    return '/business'
  }

  // Staff roles
  if (role === 'senior_staff' || role === 'staff' || role === 'junior_staff') {
    return '/staff'
  }

  // Customer roles
  return '/explore'
}

export const config = {
  matcher: [
    '/((?!_next|_static|_vercel|api|auth|favicon.ico).*)',
  ],
}
```

---

## 🔑 AUTHENTICATION FLOW

### 1. **Login** (`/auth/login`)
```typescript
// After successful login
const { data: userRole } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .single()

// Redirect based on role
const redirectUrl = getDefaultRoute(userRole.role)
router.push(redirectUrl)
```

### 2. **Signup** (`/auth/signup`)
```typescript
// After signup, assign default role
await supabase.from('user_roles').insert({
  user_id: user.id,
  role: 'customer', // Default role
  salon_id: null
})

// Redirect to customer portal
router.push('/explore')
```

### 3. **Role Change**
```typescript
// When admin changes user role
await supabase
  .from('user_roles')
  .update({ role: 'staff' })
  .eq('user_id', userId)

// User must re-login to get new permissions
```

---

## 🎨 LAYOUT DIFFERENCES BY PORTAL

### Marketing Layout (`(marketing)/layout.tsx`)
```typescript
- Public header (no auth)
- CTA buttons (Sign up, Log in)
- Footer with links
```

### Customer Layout (`(customer)/layout.tsx`)
```typescript
- Customer navbar
- Search bar
- Notifications bell
- User avatar dropdown
```

### Staff Layout (`(staff)/layout.tsx`)
```typescript
- Simple top navbar
- Today's date & schedule indicator
- Quick actions (Check-in, Time off)
- Minimal design (tablet-friendly)
```

### Business Layout (`(business)/layout.tsx`)
```typescript
- Full sidebar navigation
- Dashboard, Analytics, Management
- Notification center
- Multi-salon switcher (for tenant_owner)
```

### Admin Layout (`(admin)/layout.tsx`)
```typescript
- Admin sidebar
- System health indicator
- Quick search (users, salons)
- Impersonate user feature
```

---

## 🔒 PERMISSION MATRIX

| Feature | Guest | Customer | VIP | Staff | Senior | Manager | Owner | Tenant | Admin |
|---------|-------|----------|-----|-------|--------|---------|-------|--------|-------|
| **Browse salons** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Book appointment** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Cancel booking** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **View own schedule** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manage staff schedule** | ❌ | ❌ | ❌ | ❌ | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| **View analytics** | ❌ | ❌ | ❌ | ⚠️ | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| **Manage services** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Manage inventory** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **View all salons** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Manage users** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Audit logs** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

✅ = Full Access | ⚠️ = Limited Access | ❌ = No Access

---

## 🚀 IMPLEMENTATION CHECKLIST

- [ ] Create `middleware.ts` with role-based routing
- [ ] Create 5 layout files (marketing, customer, staff, business, admin)
- [ ] Implement `getDefaultRoute()` helper
- [ ] Create role check utility (`lib/utils/auth.ts`)
- [ ] Add role-based navigation menus
- [ ] Implement permission checks in components
- [ ] Add "Access Denied" pages for each portal
- [ ] Test all role transitions
- [ ] Add role switcher for testing (dev only)
- [ ] Document role assignment process

---

## 🎯 HELPER UTILITIES

### `lib/utils/auth.ts`

```typescript
import type { Database } from '@/lib/types/database.types'

type Role = Database['public']['Enums']['role_type']

export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 100,
  platform_admin: 90,
  tenant_owner: 80,
  salon_owner: 70,
  salon_manager: 60,
  senior_staff: 50,
  staff: 40,
  junior_staff: 30,
  vip_customer: 20,
  customer: 10,
  guest: 0,
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function canAccessRoute(userRole: Role, route: string): boolean {
  const ROUTE_MIN_ROLES: Record<string, Role> = {
    '/admin': 'platform_admin',
    '/business': 'salon_manager',
    '/staff': 'junior_staff',
    '/explore': 'guest',
  }

  const routePrefix = '/' + route.split('/')[1]
  const minRole = ROUTE_MIN_ROLES[routePrefix]

  if (!minRole) return true

  return hasRole(userRole, minRole)
}

export function isAdmin(role: Role): boolean {
  return role === 'super_admin' || role === 'platform_admin'
}

export function isBusinessUser(role: Role): boolean {
  return ['tenant_owner', 'salon_owner', 'salon_manager'].includes(role)
}

export function isStaff(role: Role): boolean {
  return ['senior_staff', 'staff', 'junior_staff'].includes(role)
}

export function isCustomer(role: Role): boolean {
  return ['customer', 'vip_customer', 'guest'].includes(role)
}
```

---

## 📚 SUMMARY

- **4 Route Groups**: (marketing), (customer), (staff), (business), (admin)
- **11 Roles**: Super admin → Guest
- **Role-Based Middleware**: Automatic redirects
- **Permission Matrix**: Granular access control
- **Helper Utilities**: Easy role checks

**Next**: Implement middleware and create layouts! 🚀
