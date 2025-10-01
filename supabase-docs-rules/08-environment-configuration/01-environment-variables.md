# 01. Environment Variables Rules

## 1.1 Standard Environment Variables

### Rule 1.1.1: Next.js environment variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-side only (no NEXT_PUBLIC prefix)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

### Rule 1.1.2: SvelteKit environment variables
```env
# .env
VITE_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Private variables (no VITE_PUBLIC prefix)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rule 1.1.3: React (Vite) environment variables
```env
# .env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rule 1.1.4: Vue.js environment variables
```env
# .env
VUE_APP_SUPABASE_URL=https://your-project-id.supabase.co
VUE_APP_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 1.2 Local Development Variables

### Rule 1.2.1: Local development environment
```env
# .env.local
# Local Supabase instance
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Local anon key

# Local database connection
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Local service role key
```

### Rule 1.2.2: Environment-specific configuration
```javascript
// utils/supabase.js
const supabaseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:54321'
  : process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseKey = process.env.NODE_ENV === 'development'
  ? process.env.NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY
  : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 1.3 Production Environment Variables

### Rule 1.3.1: Secure production variables
```env
# Production .env (never commit to version control)
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Additional production configs
NODE_ENV=production
NEXTAUTH_URL=https://yourapp.com
NEXTAUTH_SECRET=your-nextauth-secret
```

### Rule 1.3.2: Environment validation
```javascript
// lib/env.js
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
]

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  nodeEnv: process.env.NODE_ENV
}
```

## 1.4 Edge Function Environment Variables

### Rule 1.4.1: Edge function environment setup
```bash
# Set secrets for edge functions
supabase secrets set OPENAI_API_KEY=your-openai-api-key
supabase secrets set CUSTOM_API_URL=https://api.example.com
supabase secrets set JWT_SECRET=your-jwt-secret
```

### Rule 1.4.2: Access secrets in edge functions
```typescript
// supabase/functions/my-function/index.ts
Deno.serve(async (req) => {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  const customApiUrl = Deno.env.get('CUSTOM_API_URL')
  const jwtSecret = Deno.env.get('JWT_SECRET')
  
  // Supabase automatically provides these
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  if (!openaiApiKey) {
    return new Response(JSON.stringify({ 
      error: 'Missing OPENAI_API_KEY' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Use environment variables...
  return new Response(JSON.stringify({ 
    message: 'Environment variables loaded successfully' 
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## 1.5 Mobile App Environment Variables

### Rule 1.5.1: React Native environment variables
```javascript
// config/supabase.js
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = __DEV__ 
  ? 'http://10.0.2.2:54321'  // Android emulator
  : 'https://your-project.supabase.co'

const supabaseAnonKey = __DEV__
  ? 'your-local-anon-key'
  : 'your-production-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### Rule 1.5.2: Flutter environment configuration
```dart
// lib/supabase_config.dart
class SupabaseConfig {
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://your-project.supabase.co',
  );
  
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'your-anon-key',
  );
}

// Initialize in main.dart
await Supabase.initialize(
  url: SupabaseConfig.supabaseUrl,
  anonKey: SupabaseConfig.supabaseAnonKey,
);
```

## 1.6 Environment Variable Security

### Rule 1.6.1: Separate public and private keys
```env
# ✅ Public keys (can be exposed to client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJI... # anon key

# ❌ Private keys (server-side only, never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI... # service role key
DATABASE_URL=postgresql://postgres:...
API_SECRET_KEY=secret-key
```

### Rule 1.6.2: Use environment validation
```typescript
// lib/env-validation.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const env = envSchema.parse(process.env)
```

## 1.7 CI/CD Environment Variables

### Rule 1.7.1: GitHub Actions environment variables
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup environment
        run: |
          echo "NEXT_PUBLIC_SUPABASE_URL=${{ secrets.SUPABASE_URL }}" >> $GITHUB_ENV
          echo "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${{ secrets.SUPABASE_ANON_KEY }}" >> $GITHUB_ENV
          
      - name: Build and deploy
        run: |
          npm install
          npm run build
          npm run deploy
```

### Rule 1.7.2: Vercel environment variables
```bash
# Set via Vercel CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Or via Vercel dashboard:
# Project Settings > Environment Variables
```

## 1.8 Environment Variable Best Practices

### Rule 1.8.1: Environment variable naming conventions
```env
# ✅ Good naming conventions
NEXT_PUBLIC_SUPABASE_URL=...           # Public, descriptive
SUPABASE_SERVICE_ROLE_KEY=...          # Private, descriptive
APP_ENVIRONMENT=production             # Clear purpose
DATABASE_MAX_CONNECTIONS=20            # Specific configuration

# ❌ Avoid these patterns
SUPABASE_KEY=...                       # Ambiguous - which key?
KEY=...                                # Too generic
supabase_url=...                       # Use UPPER_CASE
```

### Rule 1.8.2: Environment file organization
```
project/
├── .env                    # Default values
├── .env.local             # Local overrides (gitignored)
├── .env.development       # Development-specific
├── .env.staging           # Staging-specific
├── .env.production        # Production-specific
└── .env.example           # Template for other developers
```

### Rule 1.8.3: Environment variable documentation
```env
# .env.example
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional: Service role key for server-side operations
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
# DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# External API Keys
# OPENAI_API_KEY=your-openai-api-key
# STRIPE_SECRET_KEY=your-stripe-secret-key

# Application Settings
NODE_ENV=development
# APP_DEBUG=true
```