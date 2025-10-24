# Database Performance & Index Analyzer Agent

Create an agent that performs ultra-deep analysis of database performance, indexing strategies, query optimization, and performance bottlenecks.

## Agent Objective

Analyze database performance characteristics including indexes, table statistics, query patterns, slow queries, and identify optimization opportunities across all schemas.

## Analysis Tasks

1. **Index Analysis**
   - List all indexes and their types (btree, gin, gist, etc.)
   - Identify missing indexes on foreign keys
   - Find unused indexes consuming space
   - Detect duplicate or redundant indexes
   - Check index size and bloat

2. **Table Statistics**
   - Analyze table sizes and growth patterns
   - Check table bloat and fragmentation
   - Review vacuum and analyze statistics
   - Identify tables needing maintenance

3. **Query Performance**
   - Analyze query patterns from logs
   - Identify slow queries (>1 second)
   - Find sequential scans on large tables
   - Check for N+1 query patterns
   - Review connection pool usage

4. **Foreign Key Performance**
   - Check if foreign keys have indexes
   - Identify cascade performance issues
   - Find unindexed join columns
   - Review referential integrity overhead

5. **View Performance**
   - Analyze view complexity and execution time
   - Identify views needing materialization
   - Check for nested view queries
   - Review view dependency chains

## SQL Queries to Execute

```sql
-- List all indexes with sizes
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY pg_relation_size(indexrelid) DESC;

-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  idx_scan as times_used
FROM pg_stat_user_indexes
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND idx_scan = 0
  AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Check for missing indexes on foreign keys
SELECT
  tc.table_schema,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  CASE
    WHEN i.indexname IS NULL THEN 'MISSING INDEX'
    ELSE 'Indexed'
  END as index_status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
LEFT JOIN pg_indexes i
  ON i.schemaname = tc.table_schema
  AND i.tablename = tc.table_name
  AND i.indexdef ILIKE '%' || kcu.column_name || '%'
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY tc.table_schema, tc.table_name;

-- Get table sizes and row counts
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as indexes_size,
  n_live_tup as estimated_rows,
  n_dead_tup as dead_rows,
  CASE
    WHEN n_live_tup > 0 THEN ROUND((n_dead_tup::numeric / n_live_tup::numeric) * 100, 2)
    ELSE 0
  END as dead_row_percent,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Find duplicate indexes
SELECT
  array_agg(indexname) as duplicate_indexes,
  schemaname,
  tablename,
  array_agg(indexdef) as definitions
FROM pg_indexes
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
GROUP BY schemaname, tablename, md5(indexdef)
HAVING COUNT(*) > 1;

-- Check for tables with high sequential scan to index scan ratio
SELECT
  schemaname,
  tablename,
  seq_scan as sequential_scans,
  seq_tup_read as seq_rows_read,
  idx_scan as index_scans,
  idx_tup_fetch as idx_rows_fetched,
  n_live_tup as estimated_rows,
  CASE
    WHEN idx_scan > 0 THEN ROUND((seq_scan::numeric / idx_scan::numeric), 2)
    ELSE seq_scan
  END as seq_to_idx_ratio
FROM pg_stat_user_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND n_live_tup > 1000
  AND seq_scan > 100
ORDER BY seq_scan DESC;

-- Check cache hit ratio
SELECT
  schemaname,
  tablename,
  heap_blks_read as disk_reads,
  heap_blks_hit as cache_hits,
  CASE
    WHEN (heap_blks_hit + heap_blks_read) > 0
    THEN ROUND((heap_blks_hit::numeric / (heap_blks_hit + heap_blks_read)::numeric) * 100, 2)
    ELSE 0
  END as cache_hit_ratio
FROM pg_statio_user_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND (heap_blks_hit + heap_blks_read) > 0
ORDER BY cache_hit_ratio ASC;

-- Analyze index bloat
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  CASE
    WHEN pg_relation_size(indexrelid) > 10485760 THEN 'Consider REINDEX'
    ELSE 'OK'
  END as bloat_status
FROM pg_stat_user_indexes
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY pg_relation_size(indexrelid) DESC;

-- Get database statistics
SELECT
  pg_size_pretty(pg_database_size(current_database())) as database_size,
  (SELECT count(*) FROM pg_stat_activity) as active_connections,
  (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_queries;
```

## Report Structure

Create a markdown report at `docs/database-analysis/03-performance-indexes-report.md` with:

### Executive Summary
- Total database size
- Total indexes count
- Unused indexes wasting space
- Missing indexes on foreign keys
- Tables needing vacuum/analyze
- Overall cache hit ratio

### Index Analysis
- **All Indexes Inventory**
  - Index name, type, size
  - Usage statistics (scans, tuples read)
  - Index efficiency score

- **Unused Indexes** (idx_scan = 0)
  - Wasting space
  - Recommendation to drop

- **Missing Indexes**
  - Foreign keys without indexes
  - Frequently queried columns
  - Recommended new indexes

- **Duplicate/Redundant Indexes**
  - Same column coverage
  - Recommendation to consolidate

### Table Performance
- **Size Analysis**
  - Top 20 largest tables
  - Growth trends
  - Index-to-table size ratio

- **Maintenance Status**
  - Last vacuum/analyze times
  - Dead tuple percentages
  - Tables needing immediate vacuum

- **Query Patterns**
  - Sequential scan heavy tables
  - Cache hit ratios
  - Disk I/O patterns

### Critical Performance Issues
- **High Priority**
  - Missing FK indexes causing slow joins
  - Tables with >10% dead tuples
  - Seq scans on large tables (>100K rows)
  - Cache hit ratio <95%

- **Medium Priority**
  - Unused indexes wasting >100MB
  - Tables not analyzed in 7+ days
  - Index bloat >50MB
  - Duplicate indexes

- **Low Priority**
  - Small unused indexes
  - Minor optimization opportunities

### View Performance
- Complex views (>5 joins)
- Views suitable for materialization
- View dependency chains
- Execution time estimates

### Optimization Recommendations
Prioritized by impact:

1. **Immediate Actions** (High Impact)
   - Add missing FK indexes
   - Vacuum bloated tables
   - Drop unused large indexes

2. **Short Term** (Medium Impact)
   - Materialize expensive views
   - Add indexes for common queries
   - Schedule regular maintenance

3. **Long Term** (Optimization)
   - Partition large tables
   - Archive old data
   - Optimize view definitions

### Performance Metrics Dashboard
- Database size: X GB
- Total indexes: N
- Average cache hit ratio: XX%
- Active connections: N
- Queries/second: N
- Largest table: table_name (XX GB)
- Most scanned table: table_name (N scans)

## Tools to Use

- `mcp__supabase__list_tables` - Get table list
- `mcp__supabase__execute_sql` - Run performance queries
- `mcp__supabase__get_advisors` with type="performance" - Get Supabase performance advisors
- `Write` - Create the report file

## Success Criteria

Agent completes when:
- All performance queries executed
- Index analysis complete
- Performance advisor report included
- Optimization recommendations generated
- Report saved to docs/database-analysis/
- No errors during execution
