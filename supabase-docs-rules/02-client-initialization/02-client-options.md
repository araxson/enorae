# 02. Client Options Configuration Rules

## 2.1 Authentication Options

### Rule 2.1.1: Session persistence configuration
```javascript
const supabase = createClient(url, key, {
  auth: {
    persistSession: true,        // Enable session persistence
    autoRefreshToken: true,      // Auto-refresh tokens
    detectSessionInUrl: true,    // Detect auth callbacks in URL
    flowType: 'pkce'            // Use PKCE flow for security
  }
})
```

### Rule 2.1.2: Multi-tab support
```javascript
const supabase = createClient(url, key, {
  multiTab: true,  // Enable multi-tab synchronization
})
```

## 2.2 Storage Configuration

### Rule 2.2.1: Custom localStorage implementation
```javascript
const supabase = createClient(url, key, {
  auth: {
    localStorage: {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key),
    }
  }
})
```

## 2.3 Network Configuration

### Rule 2.3.1: Custom headers
```javascript
const supabase = createClient(url, key, {
  global: {
    headers: {
      'X-Client-Info': 'my-app@1.0.0'
    }
  }
})
```

### Rule 2.3.2: Custom fetch implementation
```javascript
const supabase = createClient(url, key, {
  global: {
    fetch: async (url, options) => {
      console.log('Making request to:', url)
      return fetch(url, options)
    }
  }
})
```

## 2.4 Realtime Configuration

### Rule 2.4.1: Realtime transport options
```javascript
const supabase = createClient(url, key, {
  realtime: {
    transport: WebSocket,
    heartbeatIntervalMs: 30000,
    reconnectAfterMs: 1000,
    logger: console.log,
    encode: (payload) => JSON.stringify(payload),
    decode: (payload) => JSON.parse(payload)
  }
})
```

### Rule 2.4.2: Realtime params configuration
```javascript
const supabase = createClient(url, key, {
  realtime: {
    params: {
      eventsPerSecond: 10,
      apikey: 'your-anon-key'
    }
  }
})
```

## 2.5 Database Configuration

### Rule 2.5.1: Schema selection
```javascript
const supabase = createClient(url, key, {
  db: {
    schema: 'custom_schema'
  }
})
```

### Rule 2.5.2: Should throw on error
```javascript
const supabase = createClient(url, key, {
  global: {
    shouldThrowOnError: true  // Throw errors instead of returning them
  }
})
```

## 2.6 Environment-Specific Options

### Rule 2.6.1: Development options
```javascript
const supabase = createClient(url, key, {
  auth: {
    debug: true,              // Enable auth debugging
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    logger: console.log       // Enable realtime logging
  }
})
```

### Rule 2.6.2: Production options
```javascript
const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    debug: false              // Disable debugging
  },
  global: {
    shouldThrowOnError: false // Return errors instead of throwing
  }
})
```