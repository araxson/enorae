# 01. Edge Function Creation Rules

## 1.1 Basic Function Structure

### Rule 1.1.1: Standard Edge Function template
```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

console.log("Functions collaborator listening on http://0.0.0.0:8000")

serve(async (req) => {
  const { name } = await req.json()
  return new Response(JSON.stringify({ message: `Hello ${name}!` }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

### Rule 1.1.2: Deno serve pattern (recommended)
```typescript
Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(JSON.stringify(data), { 
    headers: { 'Content-Type': 'application/json' } 
  })
})
```

## 1.2 Function Creation via CLI

### Rule 1.2.1: Create new function
```bash
# Initialize Supabase project if needed
supabase init my-edge-functions-project
cd my-edge-functions-project

# Create a new function
supabase functions new hello-world
```

### Rule 1.2.2: Function file structure
```
supabase/
└── functions/
    └── hello-world/
        └── index.ts
```

## 1.3 HTTP Request Handling

### Rule 1.3.1: Handle different HTTP methods
```typescript
Deno.serve(async (req) => {
  const method = req.method
  const url = new URL(req.url)

  switch (method) {
    case 'GET':
      return new Response(JSON.stringify({ message: 'GET request' }), {
        headers: { 'Content-Type': 'application/json' }
      })
    
    case 'POST':
      const body = await req.json()
      return new Response(JSON.stringify({ 
        message: 'POST request', 
        data: body 
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    
    case 'PUT':
      const putData = await req.json()
      return new Response(JSON.stringify({ 
        message: 'PUT request', 
        updated: putData 
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    
    case 'DELETE':
      return new Response(JSON.stringify({ 
        message: 'DELETE request' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    
    default:
      return new Response('Method not allowed', { status: 405 })
  }
})
```

### Rule 1.3.2: Parse request data safely
```typescript
Deno.serve(async (req) => {
  try {
    const contentType = req.headers.get('content-type')
    
    let data
    if (contentType?.includes('application/json')) {
      data = await req.json()
    } else if (contentType?.includes('text/plain')) {
      data = await req.text()
    } else if (contentType?.includes('multipart/form-data')) {
      data = await req.formData()
    }

    return new Response(JSON.stringify({ 
      message: 'Request processed',
      receivedData: data 
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Invalid request format',
      details: error.message 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

## 1.4 Routing Patterns

### Rule 1.4.1: Simple routing with URL paths
```typescript
Deno.serve(async (req) => {
  const url = new URL(req.url)
  const path = url.pathname

  switch (path) {
    case '/':
      return new Response('Hello World!')
      
    case '/health':
      return new Response(JSON.stringify({ status: 'healthy' }), {
        headers: { 'Content-Type': 'application/json' }
      })
      
    case '/users':
      if (req.method === 'GET') {
        // Handle GET /users
        return new Response(JSON.stringify({ users: [] }))
      } else if (req.method === 'POST') {
        // Handle POST /users
        const userData = await req.json()
        return new Response(JSON.stringify({ created: userData }))
      }
      break
      
    default:
      return new Response('Not Found', { status: 404 })
  }
})
```

### Rule 1.4.2: Hono framework for advanced routing
```typescript
import { Hono } from 'https://deno.land/x/hono/mod.ts'

const app = new Hono()

// Basic routes
app.get('/', (c) => c.text('Hello World!'))
app.post('/users', async (c) => {
  const userData = await c.req.json()
  return c.json({ created: userData })
})

// Route with parameters
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ user_id: id })
})

// Middleware
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`)
  await next()
})

Deno.serve(app.fetch)
```

## 1.5 Environment Variables

### Rule 1.5.1: Access environment variables
```typescript
Deno.serve(async (req) => {
  // Access Supabase environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  // Custom environment variables
  const customApiKey = Deno.env.get('CUSTOM_API_KEY')
  
  if (!customApiKey) {
    return new Response(JSON.stringify({ 
      error: 'Missing required environment variable' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ 
    message: 'Environment variables loaded',
    hasSupabaseUrl: !!supabaseUrl
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## 1.6 Error Handling

### Rule 1.6.1: Comprehensive error handling
```typescript
Deno.serve(async (req) => {
  try {
    const data = await req.json()
    
    // Validate required fields
    if (!data.name) {
      return new Response(JSON.stringify({
        error: 'Validation Error',
        message: 'Name is required',
        code: 'MISSING_FIELD'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Business logic that might throw
    const result = await processData(data)
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: result 
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Function error:', error)
    
    // Return structured error response
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

async function processData(data: any) {
  // Simulate processing that might fail
  if (data.name === 'error') {
    throw new Error('Processing failed')
  }
  
  return { processed: true, name: data.name }
}
```

## 1.7 CORS Handling

### Rule 1.7.1: Enable CORS for browser requests
```typescript
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400', // 24 hours
      }
    })
  }

  // Process actual request
  const response = new Response(JSON.stringify({ 
    message: 'Hello from Edge Function' 
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  return response
})
```

## 1.8 Function Testing Locally

### Rule 1.8.1: Serve functions locally
```bash
# Start all Supabase services
supabase start

# Serve specific function with hot reload
supabase functions serve hello-world

# Serve function on custom port
supabase functions serve hello-world --port 8001
```

### Rule 1.8.2: Test function with curl
```bash
# Test GET request
curl -X GET http://localhost:54321/functions/v1/hello-world

# Test POST request with data
curl -X POST http://localhost:54321/functions/v1/hello-world \
  -H "Content-Type: application/json" \
  -d '{"name":"World"}'

# Test with authorization header
curl -X POST http://localhost:54321/functions/v1/hello-world \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Authenticated User"}'
```