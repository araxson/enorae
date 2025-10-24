# 01. Edge Function Creation Rules

## 1.1 Basic Function Structure

### Rule 1.1.1: Standard Edge Function template
```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

console.log('Functions collaborator listening on http://0.0.0.0:8000')

Deno.serve(async (req) => {
  const { name } = await req.json()
  return new Response(JSON.stringify({ message: `Hello ${name}!` }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### Rule 1.1.2: Deno serve pattern (recommended)
```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

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

## 1.8 WebSocket Support (New Feature)

### Rule 1.8.1: Upgrade HTTP connection to WebSocket
```typescript
Deno.serve((req) => {
  // Check if this is a WebSocket upgrade request
  if (req.headers.get('upgrade') === 'websocket') {
    const { socket, response } = Deno.upgradeWebSocket(req)

    // Handle connection open
    socket.onopen = () => {
      console.log('WebSocket connection opened')
      socket.send(JSON.stringify({
        type: 'connected',
        message: 'Welcome to WebSocket server'
      }))
    }

    // Handle incoming messages
    socket.onmessage = (event) => {
      console.log('Received:', event.data)

      try {
        const message = JSON.parse(event.data)

        // Echo back with timestamp
        socket.send(JSON.stringify({
          type: 'echo',
          original: message,
          timestamp: new Date().toISOString()
        }))
      } catch (error) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Invalid JSON format'
        }))
      }
    }

    // Handle connection close
    socket.onclose = () => {
      console.log('WebSocket connection closed')
    }

    // Handle errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return response
  }

  // Handle regular HTTP requests
  return new Response('WebSocket endpoint. Connect using ws://', {
    status: 400,
    headers: { 'Content-Type': 'text/plain' }
  })
})
```

### Rule 1.8.2: Real-time chat server with WebSocket
```typescript
// Store active connections
const connections = new Map<string, WebSocket>()

Deno.serve((req) => {
  const url = new URL(req.url)
  const userId = url.searchParams.get('user_id')

  if (!userId) {
    return new Response('user_id query parameter required', { status: 400 })
  }

  if (req.headers.get('upgrade') === 'websocket') {
    const { socket, response } = Deno.upgradeWebSocket(req)

    socket.onopen = () => {
      console.log(`User ${userId} connected`)
      connections.set(userId, socket)

      // Notify all users about new connection
      broadcast({
        type: 'user-joined',
        userId,
        totalUsers: connections.size
      })
    }

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)

        // Broadcast message to all connected users
        broadcast({
          type: 'chat-message',
          from: userId,
          message: message.text,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Message parsing error:', error)
      }
    }

    socket.onclose = () => {
      console.log(`User ${userId} disconnected`)
      connections.delete(userId)

      // Notify remaining users
      broadcast({
        type: 'user-left',
        userId,
        totalUsers: connections.size
      })
    }

    return response
  }

  return new Response('Chat server running', { status: 200 })
})

// Broadcast to all connected clients
function broadcast(message: any) {
  const messageStr = JSON.stringify(message)

  for (const [userId, socket] of connections.entries()) {
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr)
      }
    } catch (error) {
      console.error(`Failed to send to ${userId}:`, error)
      connections.delete(userId)
    }
  }
}
```

### Rule 1.8.3: Connect to WebSocket from client
```javascript
// Client-side WebSocket connection
const connectToWebSocket = (userId) => {
  const url = new URL('https://your-project.supabase.co/functions/v1/websocket-chat')
  url.searchParams.set('user_id', userId)

  // Change protocol to wss:// for secure connection
  const wsUrl = url.toString().replace('https://', 'wss://')

  const ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    console.log('Connected to WebSocket server')

    // Send a message
    ws.send(JSON.stringify({
      text: 'Hello from client!'
    }))
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('Received:', data)

    switch (data.type) {
      case 'connected':
        console.log('Welcome message:', data.message)
        break
      case 'chat-message':
        console.log(`${data.from}: ${data.message}`)
        break
      case 'user-joined':
        console.log(`User joined. Total users: ${data.totalUsers}`)
        break
      case 'user-left':
        console.log(`User left. Total users: ${data.totalUsers}`)
        break
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  ws.onclose = () => {
    console.log('Disconnected from WebSocket server')
  }

  return ws
}

// Usage
const socket = connectToWebSocket('user-123')
```

## 1.9 NPM Package Support (New Feature)

### Rule 1.9.1: Import NPM packages directly
```typescript
// Import NPM packages using npm: specifier
import { z } from 'npm:zod@^3.22'
import { format } from 'npm:date-fns@^2.30'
import bcrypt from 'npm:bcryptjs@^2.4'

Deno.serve(async (req) => {
  try {
    const body = await req.json()

    // Use Zod for validation
    const userSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      birthdate: z.string()
    })

    const validated = userSchema.parse(body)

    // Hash password with bcryptjs
    const hashedPassword = await bcrypt.hash(validated.password, 10)

    // Format date with date-fns
    const formattedDate = format(new Date(validated.birthdate), 'PPP')

    return new Response(JSON.stringify({
      success: true,
      email: validated.email,
      birthdate: formattedDate,
      passwordHashed: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

### Rule 1.9.2: Use Node built-in modules
```typescript
// Import Node.js built-in modules using node: specifier
import { createHash } from 'node:crypto'
import { Buffer } from 'node:buffer'
import * as path from 'node:path'

Deno.serve(async (req) => {
  const data = await req.json()

  // Use Node crypto to create hash
  const hash = createHash('sha256')
  hash.update(data.content)
  const digest = hash.digest('hex')

  // Use Buffer
  const encoded = Buffer.from(data.content).toString('base64')

  // Use path utilities
  const fileName = path.basename(data.filePath || '/uploads/document.pdf')

  return new Response(JSON.stringify({
    hash: digest,
    encoded,
    fileName
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Rule 1.9.3: Package version pinning
```typescript
// ✅ Good - Pin specific versions or version ranges
import { z } from 'npm:zod@^3.22.4'
import express from 'npm:express@^4.18.2'
import { OpenAI } from 'npm:openai@^4.20.0'

// ⚠️  Avoid - Using latest (unpredictable updates)
// import { z } from 'npm:zod'
// import express from 'npm:express@latest'

Deno.serve(async (req) => {
  // Your function code using pinned packages
  const schema = z.object({
    prompt: z.string().min(1)
  })

  const body = await req.json()
  const validated = schema.parse(body)

  // Use OpenAI with validated input
  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY')
  })

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: validated.prompt }]
  })

  return new Response(JSON.stringify({
    result: response.choices[0].message.content
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Rule 1.9.4: Using package import maps
```typescript
// Create import_map.json in your function directory
// supabase/functions/my-function/import_map.json
{
  "imports": {
    "zod": "npm:zod@^3.22.4",
    "openai": "npm:openai@^4.20.0",
    "date-fns": "npm:date-fns@^2.30.0"
  }
}

// Then import without npm: prefix in your function
import { z } from 'zod'
import { OpenAI } from 'openai'
import { format } from 'date-fns'

Deno.serve(async (req) => {
  // Use imported packages
  const schema = z.object({
    date: z.string()
  })

  const body = await req.json()
  const validated = schema.parse(body)

  const formatted = format(new Date(validated.date), 'PPP')

  return new Response(JSON.stringify({ formatted }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## 1.10 Function Testing Locally

### Rule 1.10.1: Serve functions locally
```bash
# Start all Supabase services
supabase start

# Serve specific function with hot reload
supabase functions serve hello-world

# Serve function on custom port
supabase functions serve hello-world --port 8001
```

### Rule 1.10.2: Test function with curl
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

## 1.11 Supabase Client Usage

### Rule 1.11.1: Create a Supabase client with service role credentials
```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const { data, error } = await supabase.from('orders').select('*').limit(10)
  return new Response(JSON.stringify({ data, error }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Rule 1.11.2: Guard against missing environment variables
```typescript
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
if (!serviceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY secret')
}
```

## 1.12 Background Tasks and Streaming

### Rule 1.12.1: Use waitUntil for non-blocking work
```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

async function logInvocation(payload: unknown) {
  await supabase.from('function_logs').insert({ payload })
}

Deno.serve(async (req) => {
  const body = await req.json()
  EdgeRuntime.waitUntil(logInvocation(body))
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Rule 1.12.2: Tee streams when storing and responding
```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const upstream = await fetch(thirdPartyUrl)
const [clientStream, storageStream] = upstream.body!.tee()
EdgeRuntime.waitUntil(
  supabase.storage.from('uploads').upload(`${crypto.randomUUID()}.mp3`, storageStream)
)
return new Response(clientStream, {
  headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream' }
})
```

## 1.13 Scheduled Invocations

### Rule 1.13.1: Store secrets in Vault for database schedulers
```sql
select vault.create_secret('https://project-ref.supabase.co', 'project_url');
select vault.create_secret('YOUR_SUPABASE_ANON_KEY', 'anon_key');
```

### Rule 1.13.2: Trigger an Edge Function with pg_cron and pg_net
```sql
select
  cron.schedule(
    'invoke-function-every-minute',
    '* * * * *',
    $$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/daily-digest',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
      ),
      body := jsonb_build_object('invoked_at', now())
    );
    $$
  );
```

## 1.14 Secrets Management

### Rule 1.14.1: Sync local function secrets to the project
```bash
# supabase/functions/.env contains ELEVENLABS_API_KEY=...
supabase secrets set --env-file supabase/functions/.env
```

### Rule 1.14.2: Reference secrets through env() in config.toml
```toml
[auth.smtp]
host = "env(SMTP_HOST)"
user = "env(SMTP_USER)"
password = "env(SMTP_PASSWORD)"
```
