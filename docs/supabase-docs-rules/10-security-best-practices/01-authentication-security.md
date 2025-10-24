# 01. Authentication Security Rules

## 1.1 Key Management Rules

### Rule 1.1.1: Never expose service role keys
```javascript
// ❌ NEVER do this - exposes service role key to client
const supabase = createClient(
  'https://project.supabase.co',
  'service_role_key_here' // This gives admin access!
)

// ✅ Always use anon/public keys on client-side
const supabase = createClient(
  'https://project.supabase.co',
  'anon_key_here' // Safe for client-side use
)
```

### Rule 1.1.2: Separate keys by environment
```env
# Development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=local_anon_key

# Production
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_key  # Server-side only
```

### Rule 1.1.3: Key rotation best practices
```bash
# Regularly rotate your API keys
# 1. Generate new keys in Supabase dashboard
# 2. Update environment variables
# 3. Deploy changes
# 4. Revoke old keys after deployment is verified
```

## 1.2 Row Level Security (RLS) Rules

### Rule 1.2.1: Enable RLS on all tables
```sql
-- Always enable RLS for user data
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Rule 1.2.2: Create restrictive RLS policies
```sql
-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Rule 1.2.3: Implement role-based access control
```sql
-- Create role-based policies
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Public read access for specific columns
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (
    public = true
  );
```

## 1.3 Authentication Configuration

### Rule 1.3.1: Configure secure authentication settings
```sql
-- In Supabase Dashboard > Authentication > Settings

-- Site URL (production)
Site URL: https://yourdomain.com

-- Redirect URLs (be specific)
Additional Redirect URLs:
- https://yourdomain.com/auth/callback
- https://staging.yourdomain.com/auth/callback

-- Disable public sign-ups if needed
Enable email confirmations: true
Enable manual linking: false
```

### Rule 1.3.2: Implement strong password policies
```javascript
// Client-side password validation
const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  return {
    isValid: password.length >= minLength && 
             hasUpperCase && 
             hasLowerCase && 
             hasNumbers && 
             hasSpecialChar,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  }
}

// Use in sign-up
const signUp = async (email, password) => {
  const validation = validatePassword(password)
  
  if (!validation.isValid) {
    throw new Error('Password does not meet security requirements')
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        email_verified: false
      }
    }
  })
  
  return { data, error }
}
```

## 1.4 Session Security Rules

### Rule 1.4.1: Configure secure session settings
```javascript
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Set shorter session timeout for sensitive applications
    flowType: 'pkce' // More secure than implicit flow
  }
})
```

### Rule 1.4.2: Implement session validation
```javascript
// Middleware to validate sessions
const validateSession = async (req, res, next) => {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  // Check if session is still valid
  const now = Math.floor(Date.now() / 1000)
  if (session.expires_at && now > session.expires_at) {
    return res.status(401).json({ error: 'Session expired' })
  }
  
  req.session = session
  req.user = session.user
  next()
}
```

### Rule 1.4.3: Secure session storage
```javascript
// React Native secure storage
import * as SecureStore from 'expo-secure-store'

const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: async (key) => {
          return await SecureStore.getItemAsync(key)
        },
        setItem: async (key, value) => {
          await SecureStore.setItemAsync(key, value)
        },
        removeItem: async (key) => {
          await SecureStore.deleteItemAsync(key)
        }
      }
    }
  })
}
```

## 1.5 Multi-Factor Authentication

### Rule 1.5.1: Enable MFA for sensitive applications
```javascript
// Enable MFA enrollment
const enableMFA = async () => {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp'
  })
  
  if (error) {
    console.error('MFA enrollment error:', error)
    return
  }
  
  // Show QR code to user
  const qrCode = data.totp.qr_code
  const secret = data.totp.secret
  
  return { qrCode, secret, factorId: data.id }
}

// Verify MFA during enrollment
const verifyMFAEnrollment = async (factorId, code) => {
  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: data.id,
    code
  })
  
  return { data, error }
}
```

### Rule 1.5.2: Require MFA for privileged operations
```javascript
// Check MFA status before sensitive operations
const performSensitiveOperation = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }
  
  // Check if MFA is required and enrolled
  const { data: factors } = await supabase.auth.mfa.listFactors()
  const mfaEnabled = factors.totp.length > 0
  
  if (!mfaEnabled) {
    throw new Error('MFA required for this operation')
  }
  
  // Proceed with sensitive operation
  return performOperation()
}
```

## 1.6 OAuth Security

### Rule 1.6.1: Configure OAuth providers securely
```javascript
// Secure OAuth configuration
const signInWithOAuth = async (provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'email profile', // Request minimal scopes
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  })
  
  return { data, error }
}
```

### Rule 1.6.2: Validate OAuth state parameter
```javascript
// Middleware to validate OAuth callback
const validateOAuthCallback = async (req, res, next) => {
  const { code, state } = req.query
  
  // Validate state parameter to prevent CSRF
  const storedState = req.session.oauthState
  if (!state || state !== storedState) {
    return res.status(400).json({ error: 'Invalid state parameter' })
  }
  
  // Clear stored state
  delete req.session.oauthState
  
  next()
}
```

## 1.7 Data Validation and Sanitization

### Rule 1.7.1: Validate user inputs
```javascript
// Input validation schema
const userProfileSchema = {
  name: {
    type: 'string',
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  email: {
    type: 'string',
    format: 'email'
  },
  age: {
    type: 'number',
    minimum: 13,
    maximum: 120
  }
}

// Validate before database operations
const validateUserData = (data) => {
  const errors = []
  
  Object.entries(userProfileSchema).forEach(([field, rules]) => {
    const value = data[field]
    
    if (rules.type === 'string') {
      if (typeof value !== 'string') {
        errors.push(`${field} must be a string`)
      }
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`)
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`)
      }
    }
    
    if (rules.type === 'number') {
      if (typeof value !== 'number' || isNaN(value)) {
        errors.push(`${field} must be a valid number`)
      }
    }
  })
  
  return { isValid: errors.length === 0, errors }
}
```

### Rule 1.7.2: Sanitize user inputs
```javascript
// Sanitize inputs to prevent XSS
import DOMPurify from 'isomorphic-dompurify'

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  // Remove potential XSS vectors
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: []
  })
}

// Use in database operations
const updateProfile = async (userId, profileData) => {
  const sanitizedData = Object.keys(profileData).reduce((acc, key) => {
    acc[key] = sanitizeInput(profileData[key])
    return acc
  }, {})
  
  const validation = validateUserData(sanitizedData)
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(sanitizedData)
    .eq('id', userId)
    .select()
  
  return { data, error }
}
```

## 1.8 RLS Performance Optimization

### Rule 1.8.1: Wrap auth.uid() in SELECT for better performance
```sql
-- ❌ Avoid - Multiple auth.uid() calls in single policy
CREATE POLICY "users_own_data" ON user_data
  FOR ALL USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT admin_id FROM admins)
  );

-- ✅ Better - Wrap auth.uid() in SELECT (computed once)
CREATE POLICY "users_own_data" ON user_data
  FOR ALL USING (
    (SELECT auth.uid()) = user_id OR
    (SELECT auth.uid()) IN (SELECT admin_id FROM admins)
  );

-- ✅ Best - Store in variable for complex policies
CREATE POLICY "users_own_data" ON user_data
  FOR ALL USING (
    (SELECT auth.uid()) IN (
      SELECT user_id FROM user_permissions
      WHERE table_name = 'user_data'
      AND can_access = true
    )
  );
```

### Rule 1.8.2: Use indexes to optimize RLS policy performance
```sql
-- Create indexes on columns used in RLS policies
CREATE INDEX idx_user_data_user_id ON user_data(user_id);
CREATE INDEX idx_user_data_tenant_id ON user_data(tenant_id);
CREATE INDEX idx_user_permissions_user_table
  ON user_permissions(user_id, table_name);

-- Composite index for multi-column policies
CREATE INDEX idx_posts_author_status
  ON posts(author_id, status)
  WHERE status = 'published';

-- RLS policy that benefits from these indexes
CREATE POLICY "users_see_own_posts" ON posts
  FOR SELECT USING (
    (SELECT auth.uid()) = author_id OR
    status = 'published'
  );
```

### Rule 1.8.3: Simplify complex RLS policies
```sql
-- ❌ Avoid - Complex nested queries in RLS policy
CREATE POLICY "complex_access" ON documents
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM team_members
      WHERE team_id IN (
        SELECT team_id FROM document_teams
        WHERE document_id = documents.id
      )
    )
  );

-- ✅ Better - Use materialized view or function
CREATE MATERIALIZED VIEW user_document_access AS
SELECT DISTINCT
  tm.user_id,
  dt.document_id
FROM team_members tm
JOIN document_teams dt ON tm.team_id = dt.team_id;

-- Create index on materialized view
CREATE INDEX idx_user_doc_access
  ON user_document_access(user_id, document_id);

-- Refresh materialized view periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY user_document_access;

-- Simplified RLS policy using the view
CREATE POLICY "view_based_access" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_document_access
      WHERE user_id = (SELECT auth.uid())
      AND document_id = documents.id
    )
  );
```

### Rule 1.8.4: Use security definer functions for complex logic
```sql
-- Create helper function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION has_document_access(doc_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get current user once
  current_user_id := auth.uid();

  -- Check direct ownership
  IF EXISTS (
    SELECT 1 FROM documents
    WHERE id = doc_id
    AND owner_id = current_user_id
  ) THEN
    RETURN true;
  END IF;

  -- Check team access
  IF EXISTS (
    SELECT 1 FROM document_teams dt
    JOIN team_members tm ON dt.team_id = tm.team_id
    WHERE dt.document_id = doc_id
    AND tm.user_id = current_user_id
    AND tm.active = true
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Use function in RLS policy
CREATE POLICY "efficient_document_access" ON documents
  FOR SELECT USING (
    has_document_access(id)
  );
```

### Rule 1.8.5: Cache user metadata in database for faster access
```sql
-- Create user cache table
CREATE TABLE user_cache (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL,
  tenant_id UUID,
  permissions JSONB,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Keep cache updated with trigger
CREATE OR REPLACE FUNCTION update_user_cache()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_cache (user_id, role, tenant_id, permissions)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'role',
    (NEW.raw_user_meta_data->>'tenant_id')::UUID,
    NEW.raw_user_meta_data->'permissions'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    tenant_id = EXCLUDED.tenant_id,
    permissions = EXCLUDED.permissions,
    last_updated = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_update
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_cache();

-- Use cached data in RLS policies
CREATE POLICY "tenant_scoped_access" ON tenant_data
  FOR ALL USING (
    tenant_id = (
      SELECT tenant_id FROM user_cache
      WHERE user_id = auth.uid()
    )
  );
```

### Rule 1.8.6: Test RLS policy performance
```sql
-- Enable query timing
\timing on

-- Test query performance with EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM documents
WHERE created_at > NOW() - INTERVAL '7 days';

-- Check if RLS policies are using indexes
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM documents
WHERE owner_id = auth.uid();

-- Look for index scans vs sequential scans
-- Index Scan = Good performance
-- Seq Scan = May need index

-- Compare performance with and without RLS
SET session_replication_role = replica; -- Disable RLS
EXPLAIN ANALYZE SELECT * FROM documents LIMIT 100;

SET session_replication_role = DEFAULT; -- Enable RLS
EXPLAIN ANALYZE SELECT * FROM documents LIMIT 100;
```

### Rule 1.8.7: Optimize policies for INSERT/UPDATE operations
```sql
-- ❌ Avoid - Complex checks on every INSERT
CREATE POLICY "insert_with_validation" ON documents
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() IN (SELECT user_id FROM verified_users) AND
    (SELECT tier FROM subscriptions WHERE user_id = auth.uid()) = 'premium'
  );

-- ✅ Better - Use trigger for complex validation
CREATE OR REPLACE FUNCTION validate_document_insert()
RETURNS TRIGGER AS $$
DECLARE
  user_tier TEXT;
BEGIN
  -- Get user tier once
  SELECT tier INTO user_tier
  FROM subscriptions
  WHERE user_id = auth.uid();

  -- Validate
  IF user_tier != 'premium' THEN
    RAISE EXCEPTION 'Premium subscription required';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_document_insert
  BEFORE INSERT ON documents
  FOR EACH ROW
  EXECUTE FUNCTION validate_document_insert();

-- Simplified RLS policy
CREATE POLICY "authenticated_insert" ON documents
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );
```

## 1.9 Audit and Monitoring

### Rule 1.9.1: Implement audit logging
```sql
-- Create audit log table
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    table_name,
    operation,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN CASE TG_OP
    WHEN 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to sensitive tables
CREATE TRIGGER audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

### Rule 1.9.2: Monitor authentication events
```javascript
// Monitor auth events in application
const monitorAuthEvents = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    // Log authentication events
    const logData = {
      event,
      timestamp: new Date().toISOString(),
      userId: session?.user?.id || null,
      userAgent: navigator.userAgent,
      ipAddress: session?.user?.user_metadata?.ip || 'unknown'
    }
    
    // Send to monitoring service
    console.log('Auth event:', logData)
    
    // Alert on suspicious activity
    if (event === 'SIGNED_OUT' && session?.user?.aud !== 'authenticated') {
      console.warn('Suspicious sign-out event detected')
    }
    
    if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed for user:', session?.user?.id)
    }
  })
}
```