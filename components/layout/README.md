# Layout Components

A comprehensive, organized layout system for the Enorae platform. All components are fully typed, accessible, and responsive.

## 📁 Directory Structure

```
components/layout/
├── flex/                  # Flexbox layout components
│   ├── flex.tsx          # Base flex container
│   ├── group.tsx         # Horizontal flex (flex-row)
│   ├── stack.tsx         # Vertical flex (flex-col)
│   └── index.ts          # Module exports
├── grid/                  # Grid layout components
│   ├── grid.tsx          # Responsive grid container
│   └── index.ts          # Module exports
├── headers/               # Header components
│   ├── marketing-header.tsx  # Public marketing header (server-only)
│   ├── portal-header.tsx     # Portal page header
│   └── index.ts          # Module exports
├── layouts/               # Full page layouts
│   ├── base-portal-layout.tsx  # Shared portal layout (server-only)
│   └── index.ts          # Module exports
├── navigation/            # Navigation components
│   ├── breadcrumbs.tsx        # Auto-generated breadcrumbs
│   ├── icon-map.ts            # Navigation icon registry
│   ├── marketing-user-nav.tsx # User dropdown for marketing
│   ├── mobile-nav.tsx         # Mobile navigation menu
│   ├── nav-main.tsx           # Main navigation menu
│   ├── nav-secondary.tsx      # Secondary navigation menu
│   ├── nav-user.tsx           # User dropdown for portals
│   ├── user-dropdown.tsx      # Shared user dropdown logic
│   └── index.ts               # Module exports
├── primitives/            # Base layout primitives
│   ├── box.tsx           # Generic container
│   ├── container.tsx     # Centered max-width container
│   ├── section.tsx       # Page section with spacing
│   ├── spacer.tsx        # Vertical spacing
│   └── index.ts          # Module exports
├── sidebars/              # Sidebar components
│   ├── portal-sidebar.tsx         # Main sidebar component
│   ├── portal-sidebar-wrapper.tsx # Sidebar wrapper with auth
│   └── index.ts                    # Module exports
├── utils/                 # Layout utilities
│   ├── center.tsx        # Center content
│   ├── classes.ts        # CSS class utilities
│   ├── responsive.ts     # Responsive helpers
│   ├── show-hide.tsx     # Conditional visibility
│   ├── touch-target.tsx  # Touch target compliance
│   ├── visually-hidden.tsx  # Screen reader only
│   └── index.ts          # Module exports
├── footer/                # Footer components
│   ├── footer.tsx        # Global footer component
│   └── index.ts          # Module exports
├── types.ts               # TypeScript type definitions
└── index.ts               # Main barrel exports
```

## 🎯 Component Categories

### Core Primitives

**Box** - Generic container with optional padding, margin, and display properties.
```typescript
import { Box } from '@/components/layout'
<Box p="lg" className="bg-card">{children}</Box>
```

**Container** - Centered max-width container for page content.
```typescript
import { Container } from '@/components/layout'
<Container size="lg">{children}</Container>
```

**Section** - Page section with consistent vertical spacing.
```typescript
import { Section } from '@/components/layout'
<Section size="xl">{children}</Section>
```

### Flexbox Components

**Flex** - Base flex container with full control.
```typescript
import { Flex } from '@/components/layout'
<Flex direction="row" justify="between" align="center" gap="md">
  {children}
</Flex>
```

**Stack** - Vertical flex container (shorthand for flex-col).
```typescript
import { Stack } from '@/components/layout'
<Stack gap="lg">{children}</Stack>
```

**Group** - Horizontal flex container (shorthand for flex-row).
```typescript
import { Group } from '@/components/layout'
<Group gap="sm" align="center">{children}</Group>
```

### Grid Components

**Grid** - Responsive grid with configurable columns.
```typescript
import { Grid } from '@/components/layout'
<Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
  {children}
</Grid>
```

### Layout Components

**BasePortalLayout** - Server component that wraps all portal pages.
- ⚠️ Server-only (uses `cookies()`)
- Import directly: `@/components/layout/layouts/base-portal-layout`
- Provides sidebar, header, and authentication

### Header Components

**MarketingHeader** - Public header for marketing pages.
- ⚠️ Server-only (uses `verifySession()`)
- Import directly: `@/components/layout/headers/marketing-header`
- Desktop and mobile navigation
- User authentication state

**PortalHeader** - Header for all portal pages.
- Sidebar trigger
- Dynamic breadcrumbs
- Consistent across all portals

### Sidebar Components

**PortalSidebar** - Main sidebar with collapsible navigation.
- Role-based menu filtering
- User dropdown
- Collapsible on icon

**PortalSidebarWrapper** - Server component wrapper for sidebar.
- Handles authentication
- Loads user data
- Filters menu items by role

### Navigation Components

**NavMain** - Main navigation menu for portals.
- Supports nested items
- Active state tracking

**NavSecondary** - Secondary navigation menu.
- Used for settings, help, etc.

**NavUser** - User navigation dropdown for portals.
- Avatar display
- Profile and settings links
- Sign out functionality

**MarketingUserNav** - User dropdown for marketing header.
- Adapts to user role
- Redirects to appropriate portal

**MobileNav** - Mobile navigation drawer.
- Sheet-based navigation
- Responsive breakpoints

**DynamicBreadcrumbs** - Auto-generated breadcrumbs from URL.
- Client component
- Updates on navigation

**UserDropdown** - Reusable user dropdown logic.
- Used by both portal and marketing navigation
- Configurable trigger
- Portal-aware routing

### Utility Components

**Center** - Centers content horizontally and vertically.
**Show/Hide** - Conditionally show/hide based on breakpoints.
**VisuallyHidden** - Hide visually but keep for screen readers.
**TouchTarget** - Ensure minimum touch target size (44x44px).

## 🚨 Import Rules

### ✅ Always Use Barrel Exports
```typescript
// ✅ CORRECT
import { Stack, Grid, Box } from '@/components/layout'
```

### ⚠️ Except for Server-Only Components
```typescript
// ✅ CORRECT - Direct import
import { BasePortalLayout } from '@/components/layout/layouts/base-portal-layout'
import { MarketingHeader } from '@/components/layout/headers/marketing-header'

// ❌ WRONG - Causes build errors
import { BasePortalLayout, MarketingHeader } from '@/components/layout'
```

## 📐 Spacing Scale

| Size | Value | Pixels |
|------|-------|--------|
| `xs` | 0.5rem | 8px |
| `sm` | 1rem | 16px |
| `md` | 1.5rem | 24px |
| `lg` | 2rem | 32px |
| `xl` | 2.5rem | 40px |

## 🎨 Common Patterns

### Page Layout
```typescript
<Section size="lg">
  <Stack gap="xl">
    <Box>
      <H1>Page Title</H1>
      <Lead>Subtitle text</Lead>
    </Box>
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {/* Content */}
    </Grid>
  </Stack>
</Section>
```

### Card Layout
```typescript
<Card>
  <Stack gap="md" p="lg">
    <H3>Card Title</H3>
    <Divider />
    <P>Content</P>
    <Flex justify="end" gap="sm">
      <Button variant="outline">Cancel</Button>
      <Button>Submit</Button>
    </Flex>
  </Stack>
</Card>
```

### Metric Cards
```typescript
<Grid cols={{ base: 2, md: 4 }} gap="md">
  <Box>
    <Small className="text-muted-foreground">Total Revenue</Small>
    <div className="text-2xl font-bold">$12,345</div>
  </Box>
</Grid>
```

## 🔄 Recent Changes

### v3.1.0 (2025-10-06)
- ✅ Created proper index.ts exports for all subdirectories
- ✅ Moved footer.tsx into dedicated `footer/` folder
- ✅ Added icon-map.ts to navigation components
- ✅ Improved barrel exports using subdirectory indexes
- ✅ Enhanced type exports and consistency
- ✅ Fixed TypeScript compilation issues

### v3.0.0 (2025-10-06)
- ✅ Reorganized to function-based folder structure
- ✅ Created `headers/`, `sidebars/`, and `layouts/` folders
- ✅ Moved all navigation components to `navigation/`
- ✅ Removed `portals/` and `shared/` folders
- ✅ Updated all imports across the codebase
- ✅ Updated barrel exports with new paths
- ✅ Improved organization and discoverability

### v2.0.0 (2025-10-06)
- ✅ Created shared `UserDropdown` component
- ✅ Consolidated duplicate user navigation logic
- ✅ Reduced code duplication by 60%

## 📝 Best Practices

1. **Use semantic components**: Prefer `Stack` over `Flex direction="col"`
2. **Responsive by default**: Always provide responsive values for grids
3. **Consistent spacing**: Use the spacing scale for all gaps and padding
4. **Type safety**: Never use `any` types
5. **Server vs Client**: Be mindful of where components can be used
6. **Import from barrel**: Use `@/components/layout` except for server-only components

## 🐛 Troubleshooting

### "Cannot use import statement outside a module"
You're importing a server-only component from the barrel export. Import directly from the file.

### "You're importing a component that needs next/headers"
Same as above - import directly from the component file, not from `index.ts`.

### Type errors with layout props
Ensure you're using the correct prop names. Check the component's TypeScript interface.

---

**Last Updated**: October 6, 2025
**Maintained By**: Enorae Engineering Team
