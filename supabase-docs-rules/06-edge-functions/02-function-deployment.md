# 02. Edge Function Deployment Rules

## 2.1 CLI Deployment

### Rule 2.1.1: Deploy function via CLI
```bash
# Deploy specific function
supabase functions deploy hello-world

# Deploy all functions
supabase functions deploy

# Deploy with custom import map
supabase functions deploy hello-world --import-map=import_map.json
```

### Rule 2.1.2: Deploy with environment secrets
```bash
# Set environment secrets before deployment
supabase secrets set CUSTOM_API_KEY=your-api-key
supabase secrets set DATABASE_URL=your-database-url

# Deploy function (secrets automatically available)
supabase functions deploy hello-world
```

### Rule 2.1.3: Verify deployment
```bash
# List deployed functions
supabase functions list

# Download function source (for verification)
supabase functions download hello-world

# Test deployed function
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/hello-world \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Production Test"}'
```

## 2.2 Dashboard Deployment

### Rule 2.2.1: Create function via Supabase Dashboard
```typescript
// Navigate to Functions section in dashboard
// Click "Create a new function"
// Use this template:

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

console.log("Functions collaborator listening on http://0.0.0.0:8000");

serve(async (req) => {
  const { name } = await req.json();
  return new Response(JSON.stringify({ message: `Hello ${name}!` }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### Rule 2.2.2: Edit and deploy from dashboard
```bash
# After editing function code in dashboard:
# 1. Click "Save" to save changes
# 2. Click "Deploy" to deploy to production
# 3. Monitor logs in the "Logs" tab
```

## 2.3 Deployment Configuration

### Rule 2.3.1: Import map configuration
```json
// import_map.json
{
  "imports": {
    "std/": "https://deno.land/std@0.177.0/",
    "cors": "https://deno.land/x/cors@v1.2.2/mod.ts",
    "supabase": "https://esm.sh/@supabase/supabase-js@2"
  }
}
```

### Rule 2.3.2: Function with multiple files
```
supabase/functions/
└── complex-function/
    ├── index.ts        # Main entry point
    ├── utils.ts        # Utility functions
    ├── types.ts        # Type definitions
    └── import_map.json # Local import map
```

```typescript
// index.ts
import { processData } from "./utils.ts"
import { ApiResponse } from "./types.ts"

Deno.serve(async (req): Promise<Response> => {
  try {
    const data = await req.json()
    const result = processData(data)
    
    const response: ApiResponse = {
      success: true,
      data: result
    }
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

## 2.4 Environment Management

### Rule 2.4.1: Manage secrets securely
```bash
# List current secrets
supabase secrets list

# Set secrets for production
supabase secrets set API_KEY=prod-key-here
supabase secrets set DATABASE_URL=prod-db-url

# Unset secrets
supabase secrets unset OLD_SECRET_KEY
```

### Rule 2.4.2: Environment-specific deployment
```typescript
Deno.serve(async (req) => {
  const environment = Deno.env.get('ENVIRONMENT') || 'production'
  const apiKey = Deno.env.get('API_KEY')
  const isDevelopment = environment === 'development'
  
  // Different behavior based on environment
  if (isDevelopment) {
    console.log('Running in development mode')
  }
  
  return new Response(JSON.stringify({
    environment,
    hasApiKey: !!apiKey,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## 2.5 Function Invocation

### Rule 2.5.1: Invoke function from client
```javascript
// JavaScript client invocation
const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'JavaScript Client' },
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});

if (error) {
  console.error('Function invocation error:', error);
} else {
  console.log('Function response:', data);
}
```

### Rule 2.5.2: Invoke with authentication
```javascript
// Invoke function with user authentication
const { data, error } = await supabase.functions.invoke('protected-function', {
  body: { action: 'getUserData' },
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  }
});
```

### Rule 2.5.3: Direct HTTP invocation
```bash
# Public function (no auth required)
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/hello-world \
  -H "Content-Type: application/json" \
  -d '{"name":"Direct HTTP"}'

# Authenticated function
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/protected-function \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"getData"}'
```

## 2.6 Monitoring and Logs

### Rule 2.6.1: Monitor function execution
```bash
# View function logs via CLI
supabase functions logs hello-world

# Follow logs in real-time
supabase functions logs hello-world --follow
```

### Rule 2.6.2: Structured logging in functions
```typescript
Deno.serve(async (req) => {
  const requestId = crypto.randomUUID()
  
  // Structured logging
  console.log(JSON.stringify({
    level: 'info',
    message: 'Function invocation started',
    requestId,
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  }))
  
  try {
    const data = await req.json()
    
    console.log(JSON.stringify({
      level: 'info',
      message: 'Processing request',
      requestId,
      dataKeys: Object.keys(data),
      timestamp: new Date().toISOString()
    }))
    
    // Process request...
    const result = { message: `Hello ${data.name}!` }
    
    console.log(JSON.stringify({
      level: 'info',
      message: 'Function completed successfully',
      requestId,
      timestamp: new Date().toISOString()
    }))
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.log(JSON.stringify({
      level: 'error',
      message: 'Function error',
      requestId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }))
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      requestId
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

## 2.7 Performance Optimization

### Rule 2.7.1: Optimize function cold starts
```typescript
// Pre-initialize expensive resources
const expensiveResource = await initializeResource()

Deno.serve(async (req) => {
  // Use pre-initialized resource
  const result = expensiveResource.process(await req.json())
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  })
})

async function initializeResource() {
  // Initialize once at function startup
  return {
    process: (data: any) => ({ processed: data })
  }
}
```

### Rule 2.7.2: Cache responses when appropriate
```typescript
const cache = new Map<string, { data: any; expiry: number }>()

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const cacheKey = url.pathname + url.search
  const now = Date.now()
  
  // Check cache
  const cached = cache.get(cacheKey)
  if (cached && cached.expiry > now) {
    return new Response(JSON.stringify(cached.data), {
      headers: { 
        'Content-Type': 'application/json',
        'X-Cache': 'HIT'
      }
    })
  }
  
  // Process request
  const data = await processRequest(req)
  
  // Cache for 5 minutes
  cache.set(cacheKey, {
    data,
    expiry: now + 5 * 60 * 1000
  })
  
  return new Response(JSON.stringify(data), {
    headers: { 
      'Content-Type': 'application/json',
      'X-Cache': 'MISS'
    }
  })
})
```

## 2.8 Error Handling and Rollbacks

### Rule 2.8.1: Handle deployment failures
```bash
# If deployment fails, check logs
supabase functions logs hello-world

# Rollback to previous version if needed
# (Note: Supabase doesn't have built-in rollback, 
#  so keep backup of working code)

# Redeploy previous working version
supabase functions deploy hello-world
```

### Rule 2.8.2: Graceful error responses
```typescript
Deno.serve(async (req) => {
  try {
    // Function logic here
    const result = await processRequest(req)
    
    return new Response(JSON.stringify({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    // Log error for debugging
    console.error('Function error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    // Return user-friendly error
    return new Response(JSON.stringify({
      success: false,
      error: 'Service temporarily unavailable',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```