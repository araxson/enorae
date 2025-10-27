# Configuration Module

**Central configuration management for ENORAE**

All application constants, timeouts, limits, and configuration values are defined here for consistency and maintainability.

---

## Quick Start

```typescript
// Import configuration values
import {
  TIME_MS,
  CACHE_DURATION,
  RATE_LIMITS,
  DATA_LIMITS,
  BUSINESS_THRESHOLDS,
  PLATFORM_SOCIAL_URLS,
  APP_METADATA,
  ENV,
} from '@/lib/config'

// Use in your code
setTimeout(() => setSuccess(false), TIME_MS.SUCCESS_MESSAGE_TIMEOUT)
```

---

## Available Modules

### 1. Time Constants (`TIME_MS`)

All time-related values in milliseconds.

```typescript
import { TIME_MS } from '@/lib/config'

// Available constants
TIME_MS.ONE_SECOND                // 1000ms
TIME_MS.SUCCESS_MESSAGE_TIMEOUT   // 3000ms - UI feedback duration
TIME_MS.API_REQUEST_TIMEOUT       // 10000ms - API call timeout
TIME_MS.ONE_MINUTE                // 60000ms - Cleanup intervals
TIME_MS.ONE_HOUR                  // 3600000ms - Default durations
```

**Use cases:**
- `setTimeout` for success messages
- `AbortSignal.timeout` for API calls
- `setInterval` for periodic updates

---

### 2. Cache Duration (`CACHE_DURATION`)

HTTP cache control and stale-while-revalidate settings (in seconds).

```typescript
import { CACHE_DURATION } from '@/lib/config'

// Available constants
CACHE_DURATION.DASHBOARD      // 60s - Dashboard data
CACHE_DURATION.METRICS        // 30s - Metrics data
CACHE_DURATION.USER_DATA      // 300s - User profile data
CACHE_DURATION.STATIC         // 3600s - Static content
CACHE_DURATION.SWR_DEFAULT    // 300s - Stale-while-revalidate
CACHE_DURATION.SWR_METRICS    // 120s
CACHE_DURATION.SWR_USER_DATA  // 900s
CACHE_DURATION.SWR_STATIC     // 86400s - 24 hours
```

**Use cases:**
- Next.js cache configuration
- HTTP response headers
- CDN cache settings

---

### 3. Rate Limits (`RATE_LIMITS`)

API rate limiting configuration.

```typescript
import { RATE_LIMITS } from '@/lib/config'

// Available limits
RATE_LIMITS.DASHBOARD      // 100 requests/minute
RATE_LIMITS.ADMIN          // 50 requests/minute
RATE_LIMITS.MUTATIONS      // 30 requests/minute
RATE_LIMITS.AUTH           // 5 requests per 15 minutes
RATE_LIMITS.IN_MEMORY_AUTH // 10 requests per 10 minutes
RATE_LIMITS.IN_MEMORY_API  // 100 requests/minute
```

**Use cases:**
- Middleware rate limiting
- API route protection
- DoS prevention

---

### 4. Data Limits (`DATA_LIMITS`)

Maximum values for user input and query results.

```typescript
import { DATA_LIMITS } from '@/lib/config'

// Available limits
DATA_LIMITS.MESSAGE_MAX_LENGTH    // 5000 characters
DATA_LIMITS.ADMIN_QUERY_LIMIT     // 10000 records
DATA_LIMITS.REVIEWER_SAMPLE_LIMIT // 5000 records
```

**Use cases:**
- Form validation (Zod schemas)
- Database query limits
- Input sanitization

---

### 5. Business Thresholds (`BUSINESS_THRESHOLDS`)

Business logic rules and calculations.

```typescript
import { BUSINESS_THRESHOLDS } from '@/lib/config'

// Loyalty tiers
BUSINESS_THRESHOLDS.LOYALTY_TIERS
// [
//   { min: 5000, tier: 'platinum' },
//   { min: 2000, tier: 'gold' },
//   { min: 500, tier: 'silver' },
//   { min: 0, tier: 'bronze' },
// ]

// Loyalty points calculation
BUSINESS_THRESHOLDS.LOYALTY_POINTS_DIVISOR // 10 ($1 = 0.1 points)

// Revenue scoring
BUSINESS_THRESHOLDS.REVENUE_SCORE_MAX // $150,000
```

**Use cases:**
- VIP/loyalty calculations
- Business analytics
- Salon health scores

---

### 6. Platform URLs (`PLATFORM_SOCIAL_URLS`, `PLATFORM_CONTACT`)

ENORAE platform social media and contact information.

```typescript
import { PLATFORM_SOCIAL_URLS, PLATFORM_CONTACT } from '@/lib/config'

// Social media
PLATFORM_SOCIAL_URLS.twitter    // https://twitter.com/enorae
PLATFORM_SOCIAL_URLS.facebook   // https://facebook.com/enorae
PLATFORM_SOCIAL_URLS.instagram  // https://instagram.com/enorae
PLATFORM_SOCIAL_URLS.linkedin   // https://linkedin.com/company/enorae

// Contact information
PLATFORM_CONTACT.email   // hello@enorae.com
PLATFORM_CONTACT.support // support@enorae.com
```

**Use cases:**
- Marketing footer
- SEO structured data
- Contact pages

---

### 7. App Metadata (`APP_METADATA`)

Application information and branding.

```typescript
import { APP_METADATA } from '@/lib/config'

APP_METADATA.name        // 'Enorae'
APP_METADATA.version     // '1.0.0'
APP_METADATA.description // 'Modern salon booking platform...'
```

**Use cases:**
- Page titles
- Meta tags
- About sections

---

### 8. SEO Constants (`SEO_CONSTANTS`)

Schema.org and SEO default values.

```typescript
import { SEO_CONSTANTS } from '@/lib/config'

SEO_CONSTANTS.DEFAULT_SALON_IMAGE  // '/default-salon.png'
SEO_CONSTANTS.RATING_SCALE.best    // 5
SEO_CONSTANTS.RATING_SCALE.worst   // 1
SEO_CONSTANTS.DEFAULT_PRICE_RANGE  // '$$'
```

**Use cases:**
- Structured data generation
- Default image fallbacks
- Rating display

---

### 9. Social Media Platforms (`SOCIAL_MEDIA_PLATFORMS`)

Form field configuration for social media inputs.

```typescript
import { SOCIAL_MEDIA_PLATFORMS } from '@/lib/config'

// Array of platform configurations
// [
//   { id: 'facebook', label: 'Facebook', placeholder: '...', icon: 'Facebook' },
//   { id: 'instagram', label: 'Instagram', placeholder: '...', icon: 'Instagram' },
//   // ...
// ]
```

**Use cases:**
- Social profile forms
- Consistent placeholder text
- Icon mapping

---

### 10. Environment Variables (`ENV`, `SERVER_ENV`)

Validated environment variables with type safety.

```typescript
import { ENV, SERVER_ENV } from '@/lib/config'

// Public variables (client + server)
ENV.NEXT_PUBLIC_SITE_URL
ENV.NEXT_PUBLIC_SUPABASE_URL
ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY // optional

// Server-only variables
// (Add to SERVER_ENV schema as needed)
```

**Use cases:**
- API client configuration
- Database connections
- External service integrations

---

### 11. External APIs (`EXTERNAL_APIS`)

External API endpoint configuration.

```typescript
import { EXTERNAL_APIS } from '@/lib/config'

// Google Maps
EXTERNAL_APIS.GOOGLE_MAPS.GEOCODE_URL
EXTERNAL_APIS.GOOGLE_MAPS.AUTOCOMPLETE_URL
EXTERNAL_APIS.GOOGLE_MAPS.EMBED_URL
EXTERNAL_APIS.GOOGLE_MAPS.getApiKey()
EXTERNAL_APIS.GOOGLE_MAPS.isEnabled()
```

**Use cases:**
- Address autocomplete
- Geocoding
- Map embedding

---

### 12. Time Conversions (`TIME_CONVERSIONS`)

Utility functions for time calculations.

```typescript
import { TIME_CONVERSIONS } from '@/lib/config'

// Convert to milliseconds
TIME_CONVERSIONS.minutesToMs(5)  // 300000
TIME_CONVERSIONS.secondsToMs(30) // 30000
TIME_CONVERSIONS.hoursToMs(1)    // 3600000
TIME_CONVERSIONS.daysToMs(7)     // 604800000

// Convert from milliseconds
TIME_CONVERSIONS.msToMinutes(60000) // 1
```

**Use cases:**
- Time calculations
- Duration formatting
- Interval conversions

---

## Usage Examples

### Success Message Timeout

```typescript
import { TIME_MS } from '@/lib/config'

function MyForm() {
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    // ... submit logic
    setSuccess(true)
    setTimeout(() => setSuccess(false), TIME_MS.SUCCESS_MESSAGE_TIMEOUT)
  }
}
```

### API Request Timeout

```typescript
import { TIME_MS } from '@/lib/config'

async function fetchData() {
  const timeoutSignal = AbortSignal.timeout(TIME_MS.API_REQUEST_TIMEOUT)
  const response = await fetch('/api/data', { signal: timeoutSignal })
  return response.json()
}
```

### Rate Limiting

```typescript
import { RATE_LIMITS } from '@/lib/config'

export const rateLimiter = new RateLimiter(
  RATE_LIMITS.MUTATIONS.limit,
  RATE_LIMITS.MUTATIONS.windowSeconds
)
```

### Form Validation

```typescript
import { z } from 'zod'
import { DATA_LIMITS } from '@/lib/config'

export const messageSchema = z.object({
  content: z.string().max(DATA_LIMITS.MESSAGE_MAX_LENGTH),
})
```

### VIP Tier Calculation

```typescript
import { BUSINESS_THRESHOLDS } from '@/lib/config'

function calculateTier(lifetimeSpend: number) {
  return BUSINESS_THRESHOLDS.LOYALTY_TIERS.find(
    (tier) => lifetimeSpend >= tier.min
  )?.tier
}
```

---

## Best Practices

### ✅ Do

- **Import from `/lib/config`** - Single source of truth
- **Use named constants** - Self-documenting code
- **Add comments** - Explain business context when needed
- **Use type-safe access** - TypeScript will catch errors

### ❌ Don't

- **Don't hardcode values** - Use constants instead
- **Don't duplicate constants** - Import from central config
- **Don't use magic numbers** - Always name and document
- **Don't bypass env validation** - Use `ENV` exports

---

## Adding New Configuration

### Step 1: Determine Category

Is your value:
- Time-related? → Add to `TIME_MS`
- A limit/threshold? → Add to `DATA_LIMITS` or `BUSINESS_THRESHOLDS`
- A URL? → Consider if platform-wide or feature-specific
- Environment-specific? → Add to `env.ts` schemas

### Step 2: Add to Constants

```typescript
// lib/config/constants.ts

export const TIME_MS = {
  // ... existing constants
  /** Clear description with units */
  YOUR_NEW_CONSTANT: 5000, // 5 seconds
} as const
```

### Step 3: Export from Index

```typescript
// lib/config/index.ts

export {
  // ... existing exports
  YOUR_NEW_CATEGORY,
} from './constants'
```

### Step 4: Import and Use

```typescript
import { TIME_MS } from '@/lib/config'

const value = TIME_MS.YOUR_NEW_CONSTANT
```

---

## Migration from Old Patterns

### Old Pattern (Deprecated)

```typescript
import { APP_NAME, SOCIAL_LINKS } from '@/lib/constants/app'

const appName = APP_NAME
const twitter = SOCIAL_LINKS.twitter
```

### New Pattern (Preferred)

```typescript
import { APP_METADATA, PLATFORM_SOCIAL_URLS } from '@/lib/config'

const appName = APP_METADATA.name
const twitter = PLATFORM_SOCIAL_URLS.twitter
```

**Note:** Old imports still work for backward compatibility but are deprecated.

---

## TypeScript Support

All configuration is fully typed with TypeScript:

```typescript
import { TIME_MS, BUSINESS_THRESHOLDS } from '@/lib/config'

// Type-safe access
const timeout: number = TIME_MS.SUCCESS_MESSAGE_TIMEOUT

// Type inference for complex objects
type Tier = typeof BUSINESS_THRESHOLDS.LOYALTY_TIERS[number]['tier']
// 'bronze' | 'silver' | 'gold' | 'platinum'
```

---

## Testing

Configuration values are easy to mock in tests:

```typescript
import { TIME_MS } from '@/lib/config'

// Mock in tests
jest.mock('@/lib/config', () => ({
  TIME_MS: {
    SUCCESS_MESSAGE_TIMEOUT: 0, // Instant timeout for testing
  },
}))
```

---

## Files in This Module

- **`index.ts`** - Central export point
- **`constants.ts`** - Application constants
- **`env.ts`** - Environment variable validation
- **`google-maps-schema.ts`** - External API schemas
- **`README.md`** - This documentation

---

## Related Documentation

- [Configuration Management Fix Report](../../CONFIGURATION_MANAGEMENT_FIX_REPORT.md)
- [Stack Patterns - Architecture](../../docs/ruls/architecture-patterns.md)
- [Environment Variables Guide](../../docs/environment-variables.md) _(if exists)_

---

**Last Updated:** 2025-10-26
**Maintained By:** Development Team
