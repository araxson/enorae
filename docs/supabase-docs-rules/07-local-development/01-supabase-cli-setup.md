# 01. Supabase CLI Setup Rules

## 1.1 CLI Installation and Initialization

### Rule 1.1.1: Initialize new Supabase project
```bash
# Create new project directory
supabase init my-project
cd my-project

# Initialize in existing project
cd existing-project
supabase init
```

### Rule 1.1.2: Project structure after initialization
```
my-project/
├── supabase/
│   ├── config.toml
│   ├── seed.sql
│   └── migrations/
└── .gitignore
```

## 1.2 Local Development Server

### Rule 1.2.1: Start local Supabase services
```bash
# Start all services (PostgreSQL, API, Auth, Realtime, etc.)
supabase start

# Check service status
supabase status

# View service URLs and keys
supabase status --output json
```

### Rule 1.2.2: Stop and reset local services
```bash
# Stop all services
supabase stop

# Stop and reset all data
supabase stop --backup

# Reset database (keep migrations)
supabase db reset
```

## 1.3 Database Management

### Rule 1.3.1: Generate and apply migrations
```bash
# Generate new migration
supabase migration new create_instruments_table

# Apply pending migrations
supabase migration up

# Reset database and reapply all migrations
supabase db reset
```

### Rule 1.3.2: Database seeding
```sql
-- supabase/seed.sql
-- Insert test data for local development

INSERT INTO instruments (name, category) VALUES
  ('Stradivarius Violin', 'violin'),
  ('Amati Viola', 'viola'),
  ('Montagnana Cello', 'cello');
```

```bash
# Apply seed data
supabase db reset --linked  # Resets and seeds
```

## 1.4 Environment Configuration

### Rule 1.4.1: Configure local environment variables
```bash
# Copy example environment file
cp .env.local.example .env.local

# Edit .env.local with local Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

### Rule 1.4.2: Get local development credentials
```bash
# Display all local service information
supabase status

# Output:
#   API URL: http://localhost:54321
#   anon key: eyJhbGciOiJI...
#   service_role key: eyJhbGciOiJI...
```

## 1.5 Edge Functions Development

### Rule 1.5.1: Create and serve Edge Functions locally
```bash
# Create new function
supabase functions new my-function

# Serve function locally with hot reload
supabase functions serve my-function

# Serve all functions
supabase functions serve
```

### Rule 1.5.2: Function environment variables
```bash
# Create local environment file for functions
cp supabase/.env.local.example supabase/.env.local

# Add function-specific environment variables
echo "CUSTOM_API_KEY=local-dev-key" >> supabase/.env.local
```

## 1.6 Project Linking

### Rule 1.6.1: Link local project to remote Supabase project
```bash
# Link to existing project
supabase link --project-ref your-project-ref

# Create new remote project and link
supabase projects create my-project
supabase link --project-ref new-project-ref
```

### Rule 1.6.2: Sync local and remote schemas
```bash
# Pull remote schema to local
supabase db pull

# Push local migrations to remote
supabase db push

# Generate TypeScript types from remote schema
supabase gen types typescript --linked > types/supabase.ts
```

## 1.7 Testing and Validation

### Rule 1.7.1: Run database tests
```bash
# Install pgTAP extension for testing
supabase test new test_instruments

# Run all tests
supabase test run

# Run specific test file
supabase test run test_instruments.sql
```

### Rule 1.7.2: Validate local setup
```bash
# Check if all services are healthy
supabase status

# Test API connectivity
curl http://localhost:54321/rest/v1/instruments \
  -H "apikey: YOUR_LOCAL_ANON_KEY"

# Test realtime connection
curl http://localhost:54321/realtime/v1/websocket \
  -H "apikey: YOUR_LOCAL_ANON_KEY"
```

## 1.8 Development Workflow

### Rule 1.8.1: Typical development cycle
```bash
# 1. Start local development
supabase start
npm run dev  # or your framework's dev command

# 2. Make database changes
supabase migration new add_user_profiles
# Edit the generated migration file

# 3. Apply changes locally
supabase migration up

# 4. Test changes
npm test  # Run your application tests

# 5. Deploy to production
supabase db push  # Push migrations to remote
npm run build && npm run deploy  # Deploy app
```

### Rule 1.8.2: Environment synchronization
```bash
# Keep local environment in sync with production
supabase db pull                    # Pull latest schema
supabase gen types typescript --linked > types/supabase.ts  # Update types
npm run type-check                  # Verify TypeScript compilation
```

## 1.9 Debugging and Logging

### Rule 1.9.1: Monitor local services
```bash
# View PostgreSQL logs
supabase logs postgres

# View API gateway logs
supabase logs api

# View Auth service logs
supabase logs auth

# View Realtime logs
supabase logs realtime
```

### Rule 1.9.2: Debug SQL queries
```bash
# Open local PostgreSQL client
supabase db start
psql postgresql://postgres:postgres@localhost:54322/postgres

# Or use integrated SQL editor
supabase dashboard  # Opens local dashboard at http://localhost:54323
```

## 1.10 Configuration Management

### Rule 1.10.1: Customize supabase/config.toml
```toml
[api]
port = 54321
schemas = ["public", "storage"]
extra_search_path = ["extensions"]

[db]
port = 54322
major_version = 14

[studio]
port = 54323

[auth]
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://localhost:3000"]
jwt_expiry = 3600
enable_signup = true

[realtime]
port = 54324
```

### Rule 1.10.2: Manage local secrets
```bash
# Set local development secrets
supabase secrets set --env-file .env.local

# List current secrets (local)
supabase secrets list --local

# Unset secrets
supabase secrets unset SECRET_NAME
```

## 1.11 Data Management

### Rule 1.11.1: Export and import data
```bash
# Export data from local database
pg_dump postgresql://postgres:postgres@localhost:54322/postgres > backup.sql

# Import data to local database
psql postgresql://postgres:postgres@localhost:54322/postgres < backup.sql

# Reset with fresh data
supabase db reset
```

### Rule 1.11.2: Manage storage locally
```bash
# Local storage is available at:
# http://localhost:54321/storage/v1

# Storage files are persisted in:
# ./supabase/.temp/storage
```

## 1.12 Performance Monitoring

### Rule 1.12.1: Monitor local performance
```bash
# Check resource usage
supabase status --output json | jq '.[] | {name: .name, status: .status}'

# Monitor PostgreSQL performance
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -c "SELECT * FROM pg_stat_activity;"
```

### Rule 1.12.2: Optimize local development
```toml
# In supabase/config.toml
[db]
# Reduce memory usage for development
shared_preload_libraries = "pg_stat_statements"
max_connections = 20

[api]
# Limit concurrent requests
max_rows = 1000
```