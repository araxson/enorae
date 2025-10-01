# 01. Schema Migration Rules

## 1.1 Migration Creation Rules

### Rule 1.1.1: Create descriptive migration names
```bash
# ✅ Good - descriptive migration names
supabase migration new create_instruments_table
supabase migration new add_user_profile_fields
supabase migration new create_audit_triggers
supabase migration new add_instruments_search_index

# ❌ Avoid - vague migration names
supabase migration new update_table
supabase migration new fix_stuff
supabase migration new new_migration
```

### Rule 1.1.2: One logical change per migration
```sql
-- ✅ Good - focused on one logical change
-- Migration: 20231201000001_create_instruments_table.sql
CREATE TABLE instruments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create basic indexes
CREATE INDEX idx_instruments_category ON instruments(category);
CREATE INDEX idx_instruments_created_at ON instruments(created_at);

-- Enable RLS
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;

-- ❌ Avoid - mixing unrelated changes in one migration
-- CREATE TABLE instruments (...);
-- CREATE TABLE users (...);
-- ALTER TABLE old_table ADD COLUMN new_field TEXT;
-- DROP TABLE deprecated_table;
```

## 1.2 Forward Migration Rules

### Rule 1.2.1: Always write reversible migrations
```sql
-- Migration: create_user_profiles.sql
-- Forward migration
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Note: Keep rollback instructions in comments for reference
-- Rollback instructions:
-- DROP TRIGGER update_user_profiles_updated_at ON user_profiles;
-- DROP FUNCTION update_updated_at_column();
-- DROP POLICY "Users can update own profile" ON user_profiles;
-- DROP POLICY "Users can view own profile" ON user_profiles;
-- DROP TABLE user_profiles;
```

### Rule 1.2.2: Handle data transformations safely
```sql
-- Migration: normalize_instrument_categories.sql

-- Create new normalized categories table
CREATE TABLE instrument_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert existing categories
INSERT INTO instrument_categories (name) 
SELECT DISTINCT category 
FROM instruments 
WHERE category IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Add foreign key column
ALTER TABLE instruments ADD COLUMN category_id BIGINT;

-- Update existing records
UPDATE instruments 
SET category_id = ic.id
FROM instrument_categories ic
WHERE instruments.category = ic.name;

-- Add foreign key constraint (only after data is migrated)
ALTER TABLE instruments 
ADD CONSTRAINT fk_instruments_category_id 
FOREIGN KEY (category_id) REFERENCES instrument_categories(id);

-- Create index
CREATE INDEX idx_instruments_category_id ON instruments(category_id);

-- Keep old column for now (remove in next migration after verification)
-- ALTER TABLE instruments DROP COLUMN category;
```

## 1.3 Data Migration Best Practices

### Rule 1.3.1: Migrate data in batches for large tables
```sql
-- Migration: migrate_large_table_data.sql

-- For very large tables, process in batches
DO $$
DECLARE
  batch_size INTEGER := 1000;
  offset_val INTEGER := 0;
  rows_processed INTEGER;
BEGIN
  LOOP
    -- Process batch
    UPDATE instruments 
    SET normalized_name = LOWER(TRIM(name))
    WHERE id IN (
      SELECT id FROM instruments 
      WHERE normalized_name IS NULL
      ORDER BY id
      LIMIT batch_size
      OFFSET offset_val
    );
    
    GET DIAGNOSTICS rows_processed = ROW_COUNT;
    
    -- Exit if no more rows to process
    IF rows_processed = 0 THEN
      EXIT;
    END IF;
    
    -- Log progress
    RAISE NOTICE 'Processed % rows, offset %', rows_processed, offset_val;
    
    offset_val := offset_val + batch_size;
    
    -- Optional: Add delay to reduce system load
    -- PERFORM pg_sleep(0.1);
  END LOOP;
  
  RAISE NOTICE 'Data migration completed. Total batches processed: %', (offset_val / batch_size);
END $$;

-- Verify migration
SELECT 
  COUNT(*) as total_rows,
  COUNT(normalized_name) as migrated_rows,
  COUNT(*) - COUNT(normalized_name) as remaining_rows
FROM instruments;
```

### Rule 1.3.2: Preserve data integrity during migrations
```sql
-- Migration: safe_column_type_change.sql

-- Step 1: Add new column with correct type
ALTER TABLE instruments ADD COLUMN price_cents INTEGER;

-- Step 2: Migrate data with validation
UPDATE instruments 
SET price_cents = ROUND(price * 100)
WHERE price IS NOT NULL AND price >= 0;

-- Step 3: Verify data integrity
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM instruments 
    WHERE price IS NOT NULL 
    AND (price_cents IS NULL OR price_cents != ROUND(price * 100))
  ) THEN
    RAISE EXCEPTION 'Data integrity check failed during migration';
  END IF;
  
  RAISE NOTICE 'Data integrity verified successfully';
END $$;

-- Step 4: Add constraints
ALTER TABLE instruments ADD CONSTRAINT check_price_cents_positive 
CHECK (price_cents IS NULL OR price_cents >= 0);

-- Step 5: Create indexes
CREATE INDEX idx_instruments_price_cents ON instruments(price_cents);

-- Step 6: In a future migration, drop old column after verification
-- ALTER TABLE instruments DROP COLUMN price;
```

## 1.4 Schema Evolution Rules

### Rule 1.4.1: Add columns with default values safely
```sql
-- Migration: add_status_column.sql

-- Add new column with default value
ALTER TABLE instruments 
ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

-- Add check constraint
ALTER TABLE instruments 
ADD CONSTRAINT check_instruments_status 
CHECK (status IN ('active', 'inactive', 'archived'));

-- Create index for queries
CREATE INDEX idx_instruments_status ON instruments(status);

-- Update RLS policies to consider new column
CREATE POLICY "Users can view active instruments" ON instruments
  FOR SELECT USING (status = 'active' OR auth.uid() IS NOT NULL);
```

### Rule 1.4.2: Handle column removal safely
```sql
-- Migration: prepare_column_removal.sql

-- Step 1: First migration - make column nullable and remove constraints
ALTER TABLE instruments ALTER COLUMN old_field DROP NOT NULL;
ALTER TABLE instruments DROP CONSTRAINT IF EXISTS check_old_field;
DROP INDEX IF EXISTS idx_instruments_old_field;

-- Step 2: Second migration (after deployment verification) - remove column
-- ALTER TABLE instruments DROP COLUMN old_field;

-- Note: Always deploy these changes in separate releases
```

## 1.5 Index Management

### Rule 1.5.1: Create indexes concurrently in production
```sql
-- Migration: add_search_indexes.sql

-- Create indexes concurrently to avoid table locks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_instruments_name_search 
ON instruments USING gin(to_tsvector('english', name));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_instruments_category_name 
ON instruments(category, name);

-- Analyze table after index creation
ANALYZE instruments;

-- Verify indexes are created and being used
-- SELECT schemaname, tablename, indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'instruments';
```

### Rule 1.5.2: Remove unused indexes safely
```sql
-- Migration: remove_unused_indexes.sql

-- Always check index usage before dropping
-- SELECT schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes 
-- WHERE idx_tup_read = 0 AND idx_tup_fetch = 0;

-- Drop unused indexes
DROP INDEX IF EXISTS idx_instruments_unused_field;
DROP INDEX IF EXISTS idx_old_composite_index;

-- Log the removal
DO $$
BEGIN
  RAISE NOTICE 'Removed unused indexes at %', NOW();
END $$;
```

## 1.6 RLS Policy Migrations

### Rule 1.6.1: Update RLS policies incrementally
```sql
-- Migration: update_instruments_rls_policies.sql

-- Disable existing policies
DROP POLICY IF EXISTS "old_policy_name" ON instruments;

-- Create new, more specific policies
CREATE POLICY "owners_full_access" ON instruments
  FOR ALL USING (
    auth.uid() = owner_id
  );

CREATE POLICY "public_read_active" ON instruments
  FOR SELECT USING (
    status = 'active' AND public = true
  );

CREATE POLICY "admins_full_access" ON instruments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Test policies with sample queries
-- SELECT * FROM instruments; -- Should respect new policies
```

### Rule 1.6.2: Handle RLS policy dependencies
```sql
-- Migration: create_user_roles_and_policies.sql

-- Step 1: Create role management
CREATE TABLE user_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Step 2: Create helper function for role checking
CREATE OR REPLACE FUNCTION user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Update dependent policies
CREATE POLICY "role_based_access" ON sensitive_table
  FOR ALL USING (
    user_has_role('admin') OR user_has_role('editor')
  );
```

## 1.7 Function and Trigger Migrations

### Rule 1.7.1: Update functions safely
```sql
-- Migration: update_audit_functions.sql

-- Create new version of function
CREATE OR REPLACE FUNCTION audit_trigger_v2()
RETURNS TRIGGER AS $$
BEGIN
  -- Enhanced audit functionality
  INSERT INTO audit_logs (
    table_name,
    operation,
    old_values,
    new_values,
    user_id,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid(),
    current_setting('request.headers', true)::json->>'x-real-ip',
    current_setting('request.headers', true)::json->>'user-agent',
    NOW()
  );
  
  RETURN CASE TG_OP
    WHEN 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update triggers to use new function
DROP TRIGGER IF EXISTS audit_instruments ON instruments;
CREATE TRIGGER audit_instruments
  AFTER INSERT OR UPDATE OR DELETE ON instruments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_v2();

-- Drop old function version (only after all triggers updated)
-- DROP FUNCTION IF EXISTS audit_trigger();
```

## 1.8 Migration Testing and Validation

### Rule 1.8.1: Include validation in migrations
```sql
-- Migration: add_email_validation.sql

-- Add email column
ALTER TABLE user_profiles ADD COLUMN email TEXT;

-- Add email validation constraint
ALTER TABLE user_profiles 
ADD CONSTRAINT valid_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create unique index
CREATE UNIQUE INDEX idx_user_profiles_email ON user_profiles(email) 
WHERE email IS NOT NULL;

-- Validation tests
DO $$
BEGIN
  -- Test valid email
  INSERT INTO user_profiles (id, email) 
  VALUES (gen_random_uuid(), 'test@example.com');
  
  DELETE FROM user_profiles WHERE email = 'test@example.com';
  
  -- Test invalid email (should fail)
  BEGIN
    INSERT INTO user_profiles (id, email) 
    VALUES (gen_random_uuid(), 'invalid-email');
    
    RAISE EXCEPTION 'Validation test failed: invalid email was accepted';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'Email validation working correctly';
  END;
  
  RAISE NOTICE 'All validation tests passed';
END $$;
```

### Rule 1.8.2: Create migration rollback scripts
```sql
-- File: rollback_20231201000001_create_instruments_table.sql

-- Rollback script for create_instruments_table migration
-- Run this if you need to revert the migration

-- Drop triggers first
DROP TRIGGER IF EXISTS update_instruments_updated_at ON instruments;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop policies
DROP POLICY IF EXISTS "Users can view own instruments" ON instruments;
DROP POLICY IF EXISTS "Users can update own instruments" ON instruments;
DROP POLICY IF EXISTS "Users can delete own instruments" ON instruments;

-- Drop indexes
DROP INDEX IF EXISTS idx_instruments_category;
DROP INDEX IF EXISTS idx_instruments_created_at;
DROP INDEX IF EXISTS idx_instruments_name_search;

-- Drop table
DROP TABLE IF EXISTS instruments;

-- Log rollback
DO $$
BEGIN
  RAISE NOTICE 'Rollback completed for instruments table at %', NOW();
END $$;
```

## 1.9 Production Migration Strategy

### Rule 1.9.1: Plan migrations for zero-downtime deployment
```sql
-- Migration strategy for production deployments

-- Phase 1: Additive changes (safe to deploy)
-- - Add new columns with defaults
-- - Add new indexes concurrently  
-- - Create new tables
-- - Add new functions

-- Phase 2: Application deployment
-- - Deploy application code that can handle both old and new schema
-- - Use feature flags for new functionality

-- Phase 3: Data migration (if needed)
-- - Migrate data in background jobs
-- - Verify data integrity

-- Phase 4: Cleanup (after verification)
-- - Remove old columns
-- - Drop unused indexes
-- - Remove deprecated functions

-- Example additive migration:
ALTER TABLE instruments ADD COLUMN new_field TEXT DEFAULT 'default_value';
CREATE INDEX CONCURRENTLY idx_instruments_new_field ON instruments(new_field);
```

### Rule 1.9.2: Monitor migration performance
```sql
-- Migration: performance_monitoring.sql

-- Log migration start
DO $$
BEGIN
  RAISE NOTICE 'Starting migration at %', clock_timestamp();
END $$;

-- Perform migration with timing
\timing on

-- Your migration SQL here
CREATE INDEX CONCURRENTLY idx_large_table_composite 
ON large_table(column1, column2, column3);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Migration completed at %', clock_timestamp();
END $$;

-- Check table statistics
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_rows,
  n_dead_tup as dead_rows,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables 
WHERE tablename = 'large_table';

\timing off
```