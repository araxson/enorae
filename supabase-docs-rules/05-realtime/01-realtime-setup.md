# 01. Realtime Setup Rules

## 1.1 Basic Realtime Client Setup

### Rule 1.1.1: Initialize Supabase client with Realtime options
```javascript
const supabase = createClient('URL', 'ANON_KEY', {
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

### Rule 1.1.2: Basic channel creation
```javascript
const supabase = createClient('URL', 'ANON_KEY')

const channel = supabase.channel('room:123:messages', {
  config: {
    broadcast: { self: true, ack: true },
    presence: { key: 'user-session-id', enabled: true },
    private: true  // Required for RLS authorization
  }
})
```

## 1.2 Channel Configuration Rules

### Rule 1.2.1: Broadcast configuration
```javascript
const channel = supabase.channel('broadcast-channel', {
  config: {
    broadcast: {
      self: true,           // Receive own messages
      ack: true            // Acknowledge message receipt
    }
  }
})
```

### Rule 1.2.2: Presence configuration
```javascript
const channel = supabase.channel('presence-channel', {
  config: {
    presence: {
      key: 'user-session-id',  // Unique key for this client
      enabled: true
    }
  }
})
```

### Rule 1.2.3: Private channel with RLS
```javascript
const channel = supabase.channel('private-channel', {
  config: {
    private: true  // Enables Row Level Security authorization
  }
})
```

## 1.3 Database Change Subscriptions

### Rule 1.3.1: Subscribe to table changes
```javascript
const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'instruments'
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

### Rule 1.3.2: Subscribe to specific events
```javascript
// INSERT events only
supabase
  .channel('insert-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'instruments'
    },
    (payload) => {
      console.log('New instrument added:', payload.new)
    }
  )
  .subscribe()

// UPDATE events only
supabase
  .channel('update-channel')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'instruments'
    },
    (payload) => {
      console.log('Instrument updated:', payload.new)
      console.log('Previous values:', payload.old)
    }
  )
  .subscribe()

// DELETE events only
supabase
  .channel('delete-channel')
  .on(
    'postgres_changes',
    {
      event: 'DELETE',
      schema: 'public',
      table: 'instruments'
    },
    (payload) => {
      console.log('Instrument deleted:', payload.old)
    }
  )
  .subscribe()
```

### Rule 1.3.3: Filter-based subscriptions
```javascript
const channel = supabase
  .channel('filtered-changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'instruments',
      filter: 'category=eq.violin'
    },
    (payload) => {
      console.log('Violin updated:', payload)
    }
  )
  .subscribe()
```

## 1.4 Broadcast Messages

### Rule 1.4.1: Send broadcast messages
```javascript
const channel = supabase.channel('broadcast-room')

// Send message to channel
await channel.send({
  type: 'broadcast',
  event: 'message',
  payload: {
    user: 'john',
    message: 'Hello everyone!',
    timestamp: new Date().toISOString()
  }
})
```

### Rule 1.4.2: Listen to broadcast messages
```javascript
const channel = supabase
  .channel('broadcast-room')
  .on('broadcast', { event: 'message' }, (payload) => {
    console.log('Broadcast received:', payload.payload)
  })
  .subscribe()
```

## 1.5 Presence Tracking

### Rule 1.5.1: Track user presence
```javascript
const channel = supabase
  .channel('presence-room')
  .on('presence', { event: 'sync' }, () => {
    const presenceState = channel.presenceState()
    console.log('Current users:', Object.keys(presenceState))
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', key, newPresences)
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', key, leftPresences)
  })
  .subscribe()
```

### Rule 1.5.2: Update presence state
```javascript
// Track presence with user data
await channel.track({
  user_id: 'user-123',
  username: 'john_doe',
  status: 'online',
  last_seen: new Date().toISOString()
})

// Update presence state
await channel.track({
  user_id: 'user-123',
  username: 'john_doe',
  status: 'away',
  last_seen: new Date().toISOString()
})

// Stop tracking presence
await channel.untrack()
```

## 1.6 Connection Management

### Rule 1.6.1: Subscribe to channel
```javascript
const channel = supabase.channel('my-channel')

// Subscribe and handle subscription status
channel.subscribe((status) => {
  switch (status) {
    case 'SUBSCRIBED':
      console.log('Successfully subscribed to channel')
      break
    case 'CHANNEL_ERROR':
      console.log('Error subscribing to channel')
      break
    case 'TIMED_OUT':
      console.log('Subscription timed out')
      break
    case 'CLOSED':
      console.log('Channel subscription closed')
      break
  }
})
```

### Rule 1.6.2: Unsubscribe from channel
```javascript
// Unsubscribe from specific channel
await supabase.removeChannel(channel)

// Unsubscribe from all channels
await supabase.removeAllChannels()
```

## 1.7 Error Handling for Realtime

### Rule 1.7.1: Handle connection errors
```javascript
const channel = supabase
  .channel('error-handling')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'instruments' }, 
    (payload) => {
      console.log('Change received:', payload)
    }
  )
  .subscribe((status, error) => {
    if (status === 'CHANNEL_ERROR') {
      console.error('Channel error:', error)
    }
  })
```

### Rule 1.7.2: Connection state monitoring
```javascript
// Monitor overall connection state
supabase.realtime.onOpen(() => {
  console.log('Realtime connection opened')
})

supabase.realtime.onClose(() => {
  console.log('Realtime connection closed')
})

supabase.realtime.onError((error) => {
  console.error('Realtime connection error:', error)
})
```

## 1.8 Performance Considerations

### Rule 1.8.1: Limit concurrent subscriptions
```javascript
// Avoid too many concurrent channel subscriptions
// Maximum recommended: 100 channels per client
const MAX_CHANNELS = 10

if (supabase.getChannels().length >= MAX_CHANNELS) {
  console.warn('Too many channels, consider consolidating')
}
```

### Rule 1.8.2: Use appropriate heartbeat intervals
```javascript
const supabase = createClient('URL', 'ANON_KEY', {
  realtime: {
    heartbeatIntervalMs: 30000,  // 30 seconds for production
    // heartbeatIntervalMs: 5000,   // 5 seconds for development
    reconnectAfterMs: 1000       // Quick reconnection attempts
  }
})
```