# Complete Testing & Debugging Guide

## 🎯 Testing Workflow

### Step 1: Start Development Server

```bash
# Terminal 1: Start Next.js dev server
npm run dev
```

The server will show you:
- Server-side errors in real-time
- Database query logs
- Console.error() outputs from queries

### Step 2: Trigger Dashboard Queries

```bash
# Open browser and navigate to:
http://localhost:3000/business/dashboard
```

**Watch Terminal 1** for any errors like:
```
[getDashboardMetrics] Appointments error: ...
[getRecentAppointments] Query error: ...
[getUserSalonIds] Unexpected error: ...
```

### Step 3: Check Browser Console

Open DevTools (F12) and check:
- **Console** tab for client-side errors
- **Network** tab for failed API requests
- **React DevTools** for component errors

### Step 4: Check Supabase Logs (Real-time)

While the dashboard is loading, **immediately** check Supabase logs:

```bash
# In another terminal, use Claude to run:
# "Check Supabase logs for errors"
```

Or manually via Supabase MCP:
- API logs: Recent HTTP requests and errors
- Postgres logs: Database queries and errors
- Auth logs: Authentication issues

**IMPORTANT**: Supabase MCP only returns logs from the **last 1 minute**, so you must:
1. Load the dashboard
2. IMMEDIATELY check logs (within 60 seconds)
3. Repeat if you miss the window

---

## 🔧 Detailed Testing Methods

### Method 1: Diagnostic Script (Fastest)

```bash
# Test database connectivity without auth
npx tsx scripts/test-dashboard.ts
```

**What it tests:**
- ✅ View accessibility (salons, appointments, staff, services)
- ✅ Database function calls (get_user_salons)
- ✅ Column verification
- ✅ Basic query functionality

**Limitations:**
- Uses anon key (not authenticated)
- Won't test RLS policies
- Won't test user-specific queries

### Method 2: Live Dashboard Testing (Most Accurate)

```bash
# 1. Start dev server
npm run dev

# 2. Open browser to dashboard
open http://localhost:3000/business/dashboard

# 3. Watch terminal for server logs
```

**In Terminal 1**, you'll see:
```
[getDashboardMetrics] Appointments error: { code: 'PGRST116', message: '...' }
[getRecentAppointments] Query error: ...
```

**In Browser Console**, check for:
```
Uncaught Error: ...
Failed to fetch appointments
```

### Method 3: Check Supabase Logs via MCP

**Timing is Critical**: Logs only show last 60 seconds!

```bash
# 1. Load the dashboard in browser
# 2. IMMEDIATELY run these commands via Claude:

"Check API logs in Supabase"
"Check Postgres logs in Supabase"
"Check Auth logs in Supabase"
```

**What to look for:**

**API Logs:**
```json
{
  "status": 401,
  "error": "JWT expired",
  "path": "/rest/v1/salons"
}
```

**Postgres Logs:**
```json
{
  "error_severity": "ERROR",
  "event_message": "permission denied for table staff_profiles"
}
```

**Auth Logs:**
```json
{
  "level": "error",
  "msg": "Invalid token"
}
```

### Method 4: Check Security & Performance Advisors

```bash
# Via Claude, run:
"Check Supabase security advisors"
"Check Supabase performance advisors"
```

**Security Advisors** check for:
- Missing RLS policies
- Tables without row-level security
- Public access issues
- Password protection settings

**Performance Advisors** check for:
- Missing indexes
- Slow queries
- Inefficient RLS policies
- N+1 query problems

---

## 🐛 Debugging Specific Issues

### Issue: "No data showing"

**Steps:**
1. Check if user has a salon:
   ```typescript
   // Server logs should show:
   [getUserSalon] No salon found for user
   ```

2. Verify RLS policies allow reading:
   ```sql
   -- Via Claude:
   "Show me RLS policies for salons table"
   ```

3. Check if data exists:
   ```sql
   -- Via Claude:
   "Query first 5 salons from public.salons view"
   ```

### Issue: "Authentication errors"

**Steps:**
1. Check Auth logs:
   ```bash
   "Check Supabase auth logs"
   ```

2. Verify session:
   ```typescript
   // Add to queries.ts temporarily:
   console.log('[DEBUG] User session:', session.user.id)
   console.log('[DEBUG] User role:', session.role)
   ```

3. Check RLS policies:
   ```bash
   "Show RLS policies for staff_profiles table"
   ```

### Issue: "Empty metrics (all zeros)"

**Steps:**
1. Check server logs for specific query errors:
   ```
   [getDashboardMetrics] Appointments error: ...
   [getDashboardMetrics] Staff error: ...
   [getDashboardMetrics] Services error: ...
   ```

2. Test individual queries:
   ```typescript
   // Add to a test page:
   const { data, error } = await supabase
     .from('appointments')
     .select('status')
     .eq('salon_id', salonId)

   console.log('Appointments:', data, error)
   ```

3. Verify salon_id is correct:
   ```typescript
   // In queries.ts:
   console.log('[DEBUG] Querying with salon_id:', salonId)
   ```

---

## 📊 Complete Testing Checklist

### Pre-Test Setup
- [ ] Database migrations applied
- [ ] Environment variables set (.env.local)
- [ ] Supabase project running
- [ ] User account created with proper role

### Test Sequence

**1. Database Layer**
```bash
# Run diagnostic script
npx tsx scripts/test-dashboard.ts
```
Expected: All views accessible, no errors

**2. Authentication**
```bash
# Navigate to /login and sign in
# Check terminal for auth logs
```
Expected: Successful login, no JWT errors

**3. Dashboard Load**
```bash
# Navigate to /business/dashboard
# Watch terminal for errors
```
Expected:
- Server logs show queries executing
- No error messages in terminal
- Dashboard renders (even if empty)

**4. Supabase Logs** (Within 60 seconds of step 3)
```bash
# Via Claude:
"Check Supabase API logs"
"Check Supabase Postgres logs"
```
Expected:
- HTTP 200 responses
- No permission denied errors
- Queries executing successfully

**5. Browser Console**
```bash
# Open DevTools > Console
# Reload /business/dashboard
```
Expected:
- No uncaught errors
- No failed network requests
- React components rendering

**6. Security Check**
```bash
# Via Claude:
"Check Supabase security advisors"
```
Expected:
- No missing RLS policies
- No public access warnings

**7. Performance Check**
```bash
# Via Claude:
"Check Supabase performance advisors"
```
Expected:
- No critical performance issues
- All frequently queried columns indexed

---

## 🚨 Common Error Patterns

### Error: "JWT expired"
**Cause:** Session expired
**Fix:** Refresh page, login again

### Error: "permission denied for table staff_profiles"
**Cause:** Missing RLS policy or querying wrong schema
**Fix:** Query from public views, not schema tables

### Error: "relation 'public.staff' does not exist"
**Cause:** View not created
**Fix:** Run migrations, verify with `list_tables`

### Error: "Could not find the public schema"
**Cause:** Schema name mismatch
**Fix:** Verify schema exists in database

### Error: "No salon found"
**Cause:** User not associated with any salon
**Fix:** Create salon via /business/settings/salon

---

## 🎯 Recommended Testing Flow

### For Finding Errors:

```bash
# 1. Start fresh
npm run dev

# 2. Open dashboard in browser
open http://localhost:3000/business/dashboard

# 3. IMMEDIATELY (within 60 seconds) check Supabase logs via Claude:
"Check all Supabase logs for the last minute"

# 4. Check terminal for server errors
# Look for [getDashboardMetrics], [getRecentAppointments], etc.

# 5. Check browser console for client errors
# F12 > Console tab

# 6. If errors found, check specific table/view:
"Show me the structure of the appointments view"
"Show me RLS policies for appointments table"

# 7. Check advisors for systemic issues:
"Check Supabase security and performance advisors"
```

### For Verifying Fixes:

```bash
# 1. Make code changes

# 2. Restart dev server
npm run dev

# 3. Hard refresh browser
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# 4. Check all three log sources:
#    - Terminal (server logs)
#    - Browser console (client logs)
#    - Supabase MCP (database logs)

# 5. Verify expected behavior:
#    - Metrics show correct numbers
#    - No errors in any logs
#    - Empty states show when appropriate
```

---

## 💡 Pro Tips

1. **Keep Terminal Visible**: Always watch the dev server terminal while testing

2. **Use Console.log Liberally**: Add debug logs to understand flow:
   ```typescript
   console.log('[DEBUG] Salon ID:', salonId)
   console.log('[DEBUG] Query result:', { data, error })
   ```

3. **Test All States**:
   - No salon (new user)
   - Empty salon (no appointments/staff)
   - Partial data (some appointments)
   - Full data (complete salon)

4. **Check Timing**: Supabase logs expire after 60 seconds - be fast!

5. **Clear Cache**: Use incognito/private mode to avoid cached auth

6. **Check Network Tab**: See exact API requests and responses

7. **Use React DevTools**: Inspect component props and state

---

## 📝 Example Debugging Session

```bash
# SCENARIO: Dashboard shows all zeros

# Step 1: Start dev server
npm run dev

# Step 2: Load dashboard
# Browser: http://localhost:3000/business/dashboard

# Step 3: Check server logs (Terminal 1)
# Output:
# [getDashboardMetrics] Appointments error: { code: 'PGRST116' }
# [getDashboardMetrics] Staff error: { message: 'permission denied' }

# Step 4: Ask Claude for Supabase logs
"Check Supabase Postgres logs from the last minute"

# Step 5: Analyze error
# Error: "permission denied for table organization.staff_profiles"
# Root cause: Querying schema table directly instead of public view

# Step 6: Check RLS policies
"Show me RLS policies for staff_profiles table"

# Step 7: Verify view exists
"List all views in public schema"

# Step 8: Fix code
# Change: .from('staff_profiles')
# To:     .from('staff')  // Use public view

# Step 9: Test fix
# Refresh browser, check all three log sources

# Step 10: Verify
# ✅ No errors in terminal
# ✅ No errors in browser console
# ✅ No errors in Supabase logs
# ✅ Dashboard shows data (or appropriate empty state)
```

---

## 🔍 Quick Reference Commands

```bash
# Start testing
npm run dev

# Test database connectivity
npx tsx scripts/test-dashboard.ts

# Via Claude - Check logs (within 60 seconds of action)
"Check Supabase API logs"
"Check Supabase Postgres logs"
"Check Supabase Auth logs"

# Via Claude - Check advisors
"Check Supabase security advisors"
"Check Supabase performance advisors"

# Via Claude - Inspect database
"List all views in public schema"
"Show me columns in appointments view"
"Show me RLS policies for {table_name}"
"Query first 5 rows from {view_name}"

# Via Claude - Test queries
"Execute this SQL: SELECT count(*) FROM public.salons"
"Test if get_user_salons function exists"
```

Remember: **The 60-second window is critical for Supabase logs!** Load the dashboard, then immediately check logs via Claude.
