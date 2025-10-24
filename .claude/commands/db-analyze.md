# Database Deep Analysis Command

You are a **Senior Database Architect** conducting an ULTRA comprehensive analysis of the Supabase database for the ENORAE project.

## Mission

ANlyze entire details of the database via only supabase mcp and Generate multiple detailed markdown reports analyzing the database.

## Analysis Phases

### Phase 1: Schema Discovery
1. List all schemas (exclude system schemas: pg_catalog, information_schema, auth, storage, realtime, extensions, graphql_public, pgsodium, vault, supabase_functions, supabase_migrations)
2. For each application schema, catalog:
   - All tables with row counts
   - All views (regular and materialized)
   - All functions and their purposes
   - All custom types and enums
   - All sequences

### Phase 2: Security & Access Control Analysis
1. **RLS Policies Audit**
   - List all tables and their RLS status
   - Document policy count per table
   - Identify tables WITHOUT RLS (critical security issue)
   - Analyze policy complexity and performance impact

2. **Authentication & Authorization**
   - Analyze auth schema integration
   - Check user role patterns
   - Identify tenant isolation mechanisms
   - Document access control patterns

### Phase 3: Data Modeling & Relationships
1. **Foreign Key Analysis**
   - Map all foreign key relationships
   - Create relationship diagrams (text-based)
   - Identify circular dependencies
   - Find missing relationships (orphan-prone tables)

2. **Data Integrity**
   - Check constraint analysis (CHECK, UNIQUE, NOT NULL)
   - Identify missing constraints
   - Analyze data validation patterns
   - Find potential data quality issues

### Phase 4: Performance Analysis
1. **Index Analysis**
   - List all indexes with sizes
   - Identify unused indexes (idx_scan = 0)
   - Find missing indexes on foreign keys
   - Analyze index types (BTREE, GIN, GIST, etc.)
   - Calculate index bloat

2. **Query Performance**
   - Analyze table statistics freshness
   - Check for tables needing VACUUM
   - Identify hot update opportunities
   - Review cache hit ratios

3. **Storage Analysis**
   - Table sizes and growth trends
   - TOAST usage
   - Database bloat estimation
   - Storage projections

### Phase 5: Features Inventory (Frontend Focus)
1. **Available Features by Schema**
   - organization: Salon management, locations, staff
   - catalog: Services, pricing, categories
   - scheduling: Appointments, blocked times
   - communication: Messages, notifications
   - analytics: Metrics, reports
   - engagement: Reviews, loyalty, referrals
   - identity: Profiles, roles, sessions

2. **Public Views for Frontend**
   - Document all *_view tables
   - Explain what data each view exposes
   - List available filters/parameters
   - Note any pagination support

3. **Available Functions**
   - List all callable functions
   - Document parameters and return types
   - Categorize by feature area
   - Provide usage examples

### Phase 6: Backend Issues & Cleanup (Backend Focus)
1. **Performance Issues**
   - Missing indexes causing slow queries
   - Tables without primary keys
   - Overly complex views
   - Inefficient function implementations

2. **Schema Issues**
   - Naming inconsistencies
   - Missing foreign keys
   - Orphaned tables/functions
   - Deprecated objects

3. **Security Issues**
   - Tables without RLS
   - Overly permissive policies
   - SQL injection vulnerabilities
   - Missing audit trails

4. **Maintenance Issues**
   - Tables needing VACUUM
   - Outdated statistics
   - Unused indexes consuming space
   - Function code needing optimization

### Phase 7: Database Health Score
Calculate and document:
- Security Score (RLS coverage, policy quality)
- Performance Score (indexes, query efficiency)
- Data Integrity Score (constraints, relationships)
- Maintainability Score (naming, documentation)
- **Overall Health Score (0-100)**

## Report Generation

Generate the following markdown files in `docs/database-analysis/`:

### 1. `00-EXECUTIVE-SUMMARY.md`
- Database overview
- Overall health score with breakdown
- Critical issues requiring immediate attention
- Top 5 recommendations
- Schema statistics table

### 2. `01-SCHEMA-STRUCTURE.md`
- Complete schema inventory
- Table counts per schema
- Relationship diagrams
- Schema purposes and ownership

### 3. `02-FRONTEND-FEATURES-GUIDE.md`
**Target Audience: Frontend Developers**
- Available features by portal (marketing, customer, staff, business, admin)
- Public views reference with examples
- Callable functions reference
- Data access patterns
- Sample queries for common use cases
- Authentication requirements per feature

### 4. `03-BACKEND-FIXES-REQUIRED.md`
**Target Audience: Backend Developers**
- Critical issues (P0 - fix immediately)
- High priority issues (P1 - fix this week)
- Medium priority issues (P2 - fix this month)
- Low priority optimizations (P3 - backlog)
- Detailed fix instructions for each issue

### 5. `04-SECURITY-AUDIT.md`
- RLS policy coverage report
- Tables without RLS (critical)
- Authentication patterns
- Tenant isolation verification
- Recommended security improvements

### 6. `05-PERFORMANCE-REPORT.md`
- Index analysis with recommendations
- Missing indexes (with CREATE statements)
- Unused indexes (with DROP statements)
- Query performance insights
- Cache hit ratios
- Table bloat report

### 7. `06-DATA-INTEGRITY-REPORT.md`
- Foreign key relationships
- Missing relationships
- Constraint analysis
- Data validation gaps
- Orphaned record detection

### 8. `07-CLEANUP-SUGGESTIONS.md`
- Unused views/functions to remove
- Deprecated tables
- Redundant indexes
- Schema consolidation opportunities
- Technical debt items

### 9. `08-MIGRATION-RECOMMENDATIONS.md`
- Suggested schema changes
- Index creation scripts
- RLS policy additions
- Constraint additions
- Performance optimizations
- Priority and risk assessment for each change

### 10. `99-SQL-REFERENCE.md`
- All SQL queries used in analysis
- Useful monitoring queries
- Performance diagnostic queries
- Maintenance queries

## Execution Instructions

1. **Use Supabase MCP tools exclusively** - DO NOT use bash/grep/read for database analysis
2. **Execute comprehensive SQL queries** to gather all data
3. **Generate ALL 10 report files** - no shortcuts
4. **Be thorough** - this is an ULTRA deep analysis
5. **Provide actionable recommendations** - not just observations
6. **Include SQL examples** - make it easy to implement fixes
7. **Organize findings by priority** - help developers triage work
8. **Document everything** - assume readers are new to the database

## Success Criteria

- ✅ All 10 markdown reports generated
- ✅ Each report is comprehensive and actionable
- ✅ Frontend developers can understand available features
- ✅ Backend developers have clear fix instructions
- ✅ All recommendations include SQL examples
- ✅ Reports are well-formatted and easy to navigate
- ✅ Overall database health score calculated

## Database Connection

- Project ID: `nwmcpfioxerzodvbjigw`
- Use `mcp__supabase__*` tools for all database operations
- Never hardcode credentials

## Begin Analysis

Start with Phase 1 and proceed sequentially through all phases. Generate reports as you complete each phase. Provide progress updates after each major section.

**IMPORTANT**: This is a comprehensive analysis. Take your time, be thorough, and generate complete reports. This documentation will be used by the entire development team.
