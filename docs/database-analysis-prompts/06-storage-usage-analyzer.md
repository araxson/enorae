# Database Storage & Usage Pattern Analyzer Agent

Create an agent that performs ultra-deep analysis of storage patterns, disk usage, growth trends, and storage optimization opportunities.

## Agent Objective

Analyze storage utilization across all schemas, identify space waste, predict growth patterns, and recommend storage optimization strategies.

## Analysis Tasks

1. **Storage Distribution**
   - Total database size and breakdown by schema
   - Table sizes (data + indexes)
   - Index-to-table ratios
   - TOAST storage usage
   - WAL and temporary file usage

2. **Growth Analysis**
   - Historical growth patterns
   - Current growth rate
   - Projected future growth
   - Tables with rapid growth
   - Storage saturation timeline

3. **Space Efficiency**
   - Table bloat analysis
   - Index bloat analysis
   - Unused space identification
   - Fragmentation detection
   - Vacuum effectiveness

4. **Storage Optimization**
   - Archival candidates (old data)
   - Partition recommendations
   - Compression opportunities
   - Index optimization for space
   - TOAST storage tuning

5. **Usage Patterns**
   - Most frequently accessed tables
   - Read vs write patterns
   - Hot vs cold data identification
   - Temporal data distribution
   - Access pattern anomalies

## SQL Queries to Execute

```sql
-- Get overall database size
SELECT
  pg_size_pretty(pg_database_size(current_database())) as total_size,
  pg_database_size(current_database()) as total_bytes;

-- Schema-level storage breakdown
SELECT
  schemaname,
  COUNT(*) as table_count,
  pg_size_pretty(SUM(pg_total_relation_size(schemaname||'.'||tablename))) as total_size,
  pg_size_pretty(SUM(pg_relation_size(schemaname||'.'||tablename))) as table_size,
  pg_size_pretty(SUM(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename))) as index_size,
  SUM(pg_total_relation_size(schemaname||'.'||tablename)) as total_bytes
FROM pg_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
GROUP BY schemaname
ORDER BY total_bytes DESC;

-- Top 50 largest tables with detailed breakdown
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as indexes_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename) - pg_indexes_size(schemaname||'.'||tablename)) as toast_size,
  pg_total_relation_size(schemaname||'.'||tablename) as total_bytes,
  ROUND(
    100.0 * pg_total_relation_size(schemaname||'.'||tablename) /
    NULLIF(SUM(pg_total_relation_size(schemaname||'.'||tablename)) OVER (), 0),
    2
  ) as percent_of_db
FROM pg_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 50;

-- Top 30 largest indexes
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) as index_size,
  pg_relation_size(schemaname||'.'||indexname) as size_bytes
FROM pg_indexes
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY pg_relation_size(schemaname||'.'||indexname) DESC
LIMIT 30;

-- Table bloat estimation
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  n_dead_tup as dead_tuples,
  n_live_tup as live_tuples,
  CASE
    WHEN n_live_tup > 0
    THEN ROUND((n_dead_tup::numeric / (n_live_tup + n_dead_tup)::numeric) * 100, 2)
    ELSE 0
  END as bloat_percent,
  last_vacuum,
  last_autovacuum
FROM pg_stat_user_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND (n_dead_tup > 1000 OR n_live_tup > 10000)
ORDER BY n_dead_tup DESC;

-- Index usage vs size (unused large indexes)
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  idx_scan as times_used,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched,
  pg_relation_size(indexrelid) as size_bytes
FROM pg_stat_user_indexes
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY pg_relation_size(indexrelid) DESC;

-- Table access patterns
SELECT
  schemaname,
  tablename,
  seq_scan as sequential_scans,
  seq_tup_read as seq_rows_read,
  idx_scan as index_scans,
  idx_tup_fetch as idx_rows_fetched,
  n_tup_ins as rows_inserted,
  n_tup_upd as rows_updated,
  n_tup_del as rows_deleted,
  n_live_tup as live_rows,
  n_dead_tup as dead_rows,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY (seq_scan + idx_scan) DESC;

-- TOAST table sizes
SELECT
  n.nspname as schema_name,
  c.relname as table_name,
  ct.relname as toast_table,
  pg_size_pretty(pg_total_relation_size(ct.oid)) as toast_size,
  pg_total_relation_size(ct.oid) as toast_bytes
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
LEFT JOIN pg_class ct ON c.reltoastrelid = ct.oid
WHERE n.nspname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND c.relkind = 'r'
  AND ct.relname IS NOT NULL
ORDER BY pg_total_relation_size(ct.oid) DESC;

-- Index-to-table size ratios
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as indexes_size,
  CASE
    WHEN pg_relation_size(schemaname||'.'||tablename) > 0
    THEN ROUND((pg_indexes_size(schemaname||'.'||tablename)::numeric / pg_relation_size(schemaname||'.'||tablename)::numeric), 2)
    ELSE 0
  END as index_to_table_ratio
FROM pg_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND pg_relation_size(schemaname||'.'||tablename) > 0
ORDER BY (pg_indexes_size(schemaname||'.'||tablename)::numeric / pg_relation_size(schemaname||'.'||tablename)::numeric) DESC;

-- Row count estimates
SELECT
  schemaname,
  tablename,
  n_live_tup as estimated_rows,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  CASE
    WHEN n_live_tup > 0
    THEN pg_size_pretty(pg_relation_size(schemaname||'.'||tablename) / n_live_tup)
    ELSE '0 bytes'
  END as avg_row_size
FROM pg_stat_user_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY n_live_tup DESC;

-- Write-heavy tables (candidates for optimization)
SELECT
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  (n_tup_ins + n_tup_upd + n_tup_del) as total_writes,
  idx_scan as index_scans,
  seq_scan as seq_scans,
  CASE
    WHEN (idx_scan + seq_scan) > 0
    THEN ROUND(((n_tup_ins + n_tup_upd + n_tup_del)::numeric / (idx_scan + seq_scan)::numeric), 2)
    ELSE (n_tup_ins + n_tup_upd + n_tup_del)::numeric
  END as write_to_read_ratio
FROM pg_stat_user_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND (n_tup_ins + n_tup_upd + n_tup_del) > 100
ORDER BY (n_tup_ins + n_tup_upd + n_tup_del) DESC;
```

## Report Structure

Create a markdown report at `docs/database-analysis/06-storage-usage-report.md` with:

### Executive Summary
- Total database size
- Largest schema
- Largest table
- Total index overhead
- Storage efficiency score
- Estimated monthly growth

### Storage Distribution
- **By Schema**
  - Table count
  - Total size
  - Table vs index breakdown
  - Percentage of total DB

- **By Table Type**
  - Operational tables (high write)
  - Historical tables (low write)
  - Lookup tables (high read)
  - Archive candidates

### Top Space Consumers
- **Top 20 Largest Tables**
  - Size with breakdown (table/index/toast)
  - Row count and average row size
  - Growth trend (if detectable)
  - Optimization potential

- **Top 20 Largest Indexes**
  - Size and usage frequency
  - Space efficiency score
  - Recommendation (keep/optimize/drop)

### Bloat Analysis
- **High Bloat Tables** (>20%)
  - Current bloat percentage
  - Wasted space estimate
  - Last vacuum time
  - Recommended action (VACUUM FULL, pg_repack)

- **Index Bloat**
  - Oversized indexes
  - Rebuild recommendations
  - Space reclamation potential

### Storage Efficiency Metrics
- Overall index-to-table ratio
- Average row sizes by table
- TOAST usage patterns
- Dead tuple percentages
- Space utilization score

### Usage Pattern Analysis
- **Hot Tables** (frequent access)
  - High read frequency
  - Caching candidates
  - Performance priority

- **Cold Tables** (infrequent access)
  - Archive candidates
  - Partition opportunities
  - Compression potential

- **Write-Heavy Tables**
  - High insert/update/delete activity
  - Vacuum tuning needs
  - Index optimization priority

### Growth Projections
Based on current data:
- Estimated monthly growth rate
- 6-month projection
- 12-month projection
- Storage capacity recommendations

### Optimization Opportunities
- **Immediate Actions** (High Impact)
  1. Vacuum bloated tables (>20% bloat)
  2. Drop unused large indexes (>100MB, 0 scans)
  3. Archive old data from large tables
  4. Compress TOAST data

- **Short Term** (Medium Impact)
  1. Partition large tables (>10GB)
  2. Optimize index definitions
  3. Implement data retention policies
  4. Enable table compression

- **Long Term** (Maintenance)
  1. Set up automated archival
  2. Implement cold storage strategy
  3. Monitor growth trends
  4. Capacity planning

### Archival Recommendations
For tables with historical data:
- Suggested archival thresholds
- Expected space savings
- Archival strategy (partition, separate DB, cold storage)

### Partition Candidates
Large tables that would benefit:
- Current size and growth rate
- Suggested partition key (date, ID range)
- Estimated performance improvement
- Implementation complexity

### Cost Analysis
If on paid Supabase plan:
- Current storage costs
- Projected costs (6-12 months)
- Potential savings from optimization
- ROI on optimization efforts

## Tools to Use

- `mcp__supabase__list_tables` - Get table list
- `mcp__supabase__execute_sql` - Run storage queries
- `mcp__supabase__get_project` - Get project details and plan
- `Write` - Create the report file

## Success Criteria

Agent completes when:
- All storage queries executed
- Growth patterns analyzed
- Optimization opportunities identified
- Cost projections calculated
- Report saved to docs/database-analysis/
- No errors during execution

## Important Notes

- Some queries may be slow on large databases
- Storage numbers are estimates based on PostgreSQL metadata
- Growth projections assume consistent patterns
- Consider database plan limits (Supabase free tier: 500MB)
- Report should highlight if approaching storage limits
