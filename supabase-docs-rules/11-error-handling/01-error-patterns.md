# 01. Error Handling Patterns Rules

## 1.1 Basic Error Handling Rules

### Rule 1.1.1: Always check for errors in Supabase operations
```javascript
// ❌ Bad - Not checking for errors
const { data } = await supabase
  .from('instruments')
  .select('*')

// ✅ Good - Always check for errors
const { data, error } = await supabase
  .from('instruments')
  .select('*')

if (error) {
  console.error('Database error:', error.message)
  throw new Error('Failed to fetch instruments')
}

console.log('Data retrieved:', data)
```

### Rule 1.1.2: Handle different error types appropriately
```javascript
const handleSupabaseError = (error, operation = 'database operation') => {
  if (!error) return

  // Network errors
  if (error.message.includes('fetch')) {
    console.error('Network error during', operation)
    throw new Error('Network connection failed. Please check your internet connection.')
  }

  // Authentication errors
  if (error.message.includes('JWT') || error.message.includes('auth')) {
    console.error('Authentication error:', error.message)
    throw new Error('Authentication failed. Please sign in again.')
  }

  // Permission errors
  if (error.message.includes('permission') || error.code === 'PGRST116') {
    console.error('Permission error:', error.message)
    throw new Error('You do not have permission to perform this action.')
  }

  // Database constraint errors
  if (error.code === '23505') { // Unique constraint violation
    console.error('Duplicate entry error:', error.message)
    throw new Error('This record already exists.')
  }

  if (error.code === '23503') { // Foreign key constraint violation
    console.error('Foreign key error:', error.message)
    throw new Error('Cannot delete this record as it is referenced by other data.')
  }

  // Generic database error
  console.error('Database error:', error)
  throw new Error('A database error occurred. Please try again.')
}

// Usage
try {
  const { data, error } = await supabase
    .from('instruments')
    .insert({ name: 'New Instrument' })

  handleSupabaseError(error, 'instrument creation')
  return data
} catch (error) {
  // Handle user-friendly error
  showErrorMessage(error.message)
}
```

## 1.2 Authentication Error Handling

### Rule 1.2.1: Handle authentication-specific errors
```javascript
const handleAuthError = (error) => {
  const errorMap = {
    'Invalid login credentials': 'Incorrect email or password. Please try again.',
    'Email not confirmed': 'Please check your email and click the confirmation link.',
    'User not found': 'No account found with this email address.',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
    'Unable to validate email address': 'Please enter a valid email address.',
    'signup-disabled': 'New registrations are currently disabled.',
    'email-domain-filter-enabled': 'Registration is restricted to specific email domains.',
    'weak-password': 'Please choose a stronger password.',
    'captcha-failed': 'Please complete the security verification.',
    'same-password': 'New password must be different from your current password.',
    'session-not-found': 'Your session has expired. Please sign in again.',
    'refresh-token-not-found': 'Authentication session expired. Please sign in again.',
  }

  const userMessage = errorMap[error.message] || 'Authentication failed. Please try again.'
  
  console.error('Auth error:', error)
  return userMessage
}

// Usage in authentication functions
const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      const userMessage = handleAuthError(error)
      throw new Error(userMessage)
    }

    return data
  } catch (error) {
    // Display user-friendly error message
    showErrorNotification(error.message)
    throw error
  }
}
```

### Rule 1.2.2: Handle session expiration gracefully
```javascript
const handleSessionExpired = async () => {
  try {
    // Attempt to refresh the session
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      // Session cannot be refreshed, redirect to login
      console.log('Session expired, redirecting to login')
      
      // Clear any stored user data
      localStorage.removeItem('user-preferences')
      
      // Redirect to login page
      window.location.href = '/login?message=session-expired'
      return null
    }

    console.log('Session refreshed successfully')
    return data.session
  } catch (error) {
    console.error('Error refreshing session:', error)
    window.location.href = '/login?message=session-error'
    return null
  }
}

// Automatic session monitoring
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed automatically')
  }

  if (event === 'SIGNED_OUT') {
    console.log('User signed out')
    // Clean up application state
    clearUserData()
  }

  if (event === 'SIGNED_IN') {
    console.log('User signed in')
  }
})
```

## 1.3 Database Operation Error Handling

### Rule 1.3.1: Handle specific database errors
```javascript
const handleDatabaseError = (error, context = {}) => {
  // Log full error for debugging
  console.error('Database error:', error, 'Context:', context)

  // PostgreSQL error codes
  const postgresErrorHandlers = {
    '23505': () => 'This item already exists.',
    '23503': () => 'Cannot delete this item as it is being used elsewhere.',
    '23514': () => 'The data provided does not meet the required format.',
    '42501': () => 'You do not have permission to perform this action.',
    '42P01': () => 'The requested resource was not found.',
    '23502': () => 'Required information is missing.',
    '22001': () => 'The provided text is too long.',
    '22003': () => 'The provided number is out of range.',
    '08006': () => 'Connection to the database was lost.',
    '08001': () => 'Unable to connect to the database.',
  }

  // PostgREST error codes
  const postgrestErrorHandlers = {
    'PGRST116': () => 'You do not have permission to access this data.',
    'PGRST202': () => 'The requested resource was not found.',
    'PGRST204': () => 'No data was found matching your request.',
  }

  // Check for specific error codes
  if (error.code && postgresErrorHandlers[error.code]) {
    return postgrestErrorHandlers[error.code]()
  }

  if (error.code && postgrestErrorHandlers[error.code]) {
    return postgrestErrorHandlers[error.code]()
  }

  // Pattern-based error handling
  if (error.message.includes('duplicate key')) {
    return 'This item already exists.'
  }

  if (error.message.includes('violates foreign key')) {
    return 'Cannot complete this action due to related data constraints.'
  }

  if (error.message.includes('violates check constraint')) {
    return 'The provided data does not meet the required criteria.'
  }

  if (error.message.includes('permission denied')) {
    return 'You do not have permission to perform this action.'
  }

  if (error.message.includes('relation') && error.message.includes('does not exist')) {
    return 'The requested resource is not available.'
  }

  // Generic fallback
  return 'An unexpected error occurred. Please try again.'
}

// Usage in data operations
const createInstrument = async (instrumentData) => {
  try {
    const { data, error } = await supabase
      .from('instruments')
      .insert(instrumentData)
      .select()
      .single()

    if (error) {
      const userMessage = handleDatabaseError(error, { 
        operation: 'create_instrument',
        data: instrumentData 
      })
      throw new Error(userMessage)
    }

    return data
  } catch (error) {
    showErrorNotification(error.message)
    throw error
  }
}
```

## 1.4 Real-time Error Handling

### Rule 1.4.1: Handle real-time connection errors
```javascript
const handleRealtimeError = (error, channelName) => {
  console.error(`Realtime error on channel ${channelName}:`, error)

  const errorHandlers = {
    'CHANNEL_ERROR': () => {
      console.log('Channel error, attempting to reconnect...')
      return 'Real-time connection lost. Attempting to reconnect...'
    },
    'TIMED_OUT': () => {
      console.log('Connection timed out, retrying...')
      return 'Connection timed out. Retrying...'
    },
    'CLOSED': () => {
      console.log('Connection closed by server')
      return 'Connection was closed. Please refresh the page.'
    },
    'NETWORK_ERROR': () => {
      console.log('Network error occurred')
      return 'Network error. Please check your internet connection.'
    }
  }

  const handler = errorHandlers[error.type] || (() => 'Real-time connection error occurred.')
  return handler()
}

// Robust real-time subscription with error handling
const createRealtimeSubscription = (channelName, config = {}) => {
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5
  let subscription = null

  const connect = () => {
    subscription = supabase
      .channel(channelName, config)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'instruments' },
        (payload) => {
          console.log('Real-time update received:', payload)
          handleRealtimeUpdate(payload)
        }
      )
      .subscribe((status, error) => {
        console.log('Subscription status:', status)

        switch (status) {
          case 'SUBSCRIBED':
            console.log('Successfully subscribed to real-time updates')
            reconnectAttempts = 0
            showSuccessMessage('Connected to real-time updates')
            break

          case 'CHANNEL_ERROR':
            console.error('Channel error:', error)
            const errorMessage = handleRealtimeError({ type: 'CHANNEL_ERROR' }, channelName)
            showErrorMessage(errorMessage)
            
            // Attempt to reconnect
            if (reconnectAttempts < maxReconnectAttempts) {
              setTimeout(() => {
                reconnectAttempts++
                console.log(`Reconnection attempt ${reconnectAttempts}`)
                connect()
              }, 1000 * reconnectAttempts) // Exponential backoff
            }
            break

          case 'TIMED_OUT':
            console.error('Subscription timed out')
            const timeoutMessage = handleRealtimeError({ type: 'TIMED_OUT' }, channelName)
            showErrorMessage(timeoutMessage)
            break

          case 'CLOSED':
            console.log('Subscription closed')
            const closedMessage = handleRealtimeError({ type: 'CLOSED' }, channelName)
            showWarningMessage(closedMessage)
            break
        }
      })
  }

  const disconnect = () => {
    if (subscription) {
      supabase.removeChannel(subscription)
      subscription = null
    }
  }

  // Initial connection
  connect()

  return {
    disconnect,
    reconnect: connect
  }
}
```

## 1.5 Edge Function Error Handling

### Rule 1.5.1: Handle Edge Function invocation errors
```javascript
const invokeEdgeFunction = async (functionName, payload = {}) => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (error) {
      throw new Error(`Function invocation failed: ${error.message}`)
    }

    return data
  } catch (error) {
    // Handle different types of function errors
    if (error.message.includes('FunctionsRelayError')) {
      console.error('Function relay error:', error)
      throw new Error('Service temporarily unavailable. Please try again later.')
    }

    if (error.message.includes('FunctionsHttpError')) {
      console.error('Function HTTP error:', error)
      throw new Error('Invalid request. Please check your data and try again.')
    }

    if (error.message.includes('Function not found')) {
      console.error('Function not found:', error)
      throw new Error('The requested service is not available.')
    }

    if (error.message.includes('timeout')) {
      console.error('Function timeout:', error)
      throw new Error('Request timed out. Please try again.')
    }

    console.error('Edge function error:', error)
    throw new Error('Service error occurred. Please try again.')
  }
}

// Usage with retry logic
const invokeWithRetry = async (functionName, payload, maxRetries = 3) => {
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await invokeEdgeFunction(functionName, payload)
    } catch (error) {
      lastError = error
      console.log(`Attempt ${attempt} failed:`, error.message)

      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000
        console.log(`Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}
```

## 1.6 Error Boundary Patterns

### Rule 1.6.1: Implement React Error Boundaries for Supabase errors
```javascript
// SupabaseErrorBoundary.jsx
import React from 'react'

export class SupabaseErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Supabase Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Log to external service
    this.logErrorToService(error, errorInfo)
  }

  logErrorToService = (error, errorInfo) => {
    // Send error to monitoring service (e.g., Sentry, LogRocket)
    console.log('Logging error to external service:', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🔧 Something went wrong</h2>
            <p>We encountered an unexpected error while loading your data.</p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-button">
                Try Again
              </button>
              <button onClick={() => window.location.reload()} className="reload-button">
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
const App = () => (
  <SupabaseErrorBoundary>
    <MySupabaseComponent />
  </SupabaseErrorBoundary>
)
```

## 1.7 Logging and Monitoring

### Rule 1.7.1: Implement structured error logging
```javascript
// errorLogger.js
class ErrorLogger {
  static log(error, context = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: context.userId || 'anonymous'
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorData)
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(errorData)
    }

    // Store locally for offline scenarios
    this.storeLocally(errorData)
  }

  static sendToMonitoring(errorData) {
    // Send to external monitoring service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(err => {
      console.error('Failed to send error to monitoring service:', err)
    })
  }

  static storeLocally(errorData) {
    try {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')
      errors.push(errorData)
      
      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.splice(0, errors.length - 10)
      }
      
      localStorage.setItem('app_errors', JSON.stringify(errors))
    } catch (err) {
      console.error('Failed to store error locally:', err)
    }
  }
}

// Usage throughout application
const handleError = (error, context) => {
  ErrorLogger.log(error, context)
  
  // Show user-friendly message
  showErrorMessage(error.message)
}
```

### Rule 1.7.2: Monitor error patterns
```javascript
// errorMonitor.js
class ErrorMonitor {
  constructor() {
    this.errorCounts = new Map()
    this.alertThresholds = {
      authentication: 5, // Alert after 5 auth errors
      database: 10,      // Alert after 10 database errors
      network: 15        // Alert after 15 network errors
    }
  }

  trackError(errorType, error) {
    const count = (this.errorCounts.get(errorType) || 0) + 1
    this.errorCounts.set(errorType, count)

    // Check if we should alert
    const threshold = this.alertThresholds[errorType]
    if (threshold && count >= threshold) {
      this.sendAlert(errorType, count, error)
    }
  }

  sendAlert(errorType, count, latestError) {
    console.warn(`Alert: ${errorType} errors exceeded threshold. Count: ${count}`)
    
    // Send alert to monitoring service
    fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'error_threshold_exceeded',
        errorType,
        count,
        latestError: latestError.message,
        timestamp: new Date().toISOString()
      })
    })
  }

  reset() {
    this.errorCounts.clear()
  }
}

const errorMonitor = new ErrorMonitor()

// Use in error handlers
const handleAuthError = (error) => {
  errorMonitor.trackError('authentication', error)
  // ... rest of error handling
}
```