ULTRATHINK to perform comprehensive database health check and validation using Context7 MCP for Supabase documentation and Supabase MCP for all operations. Keep token usage under 20000 by using pagination and filtering.

## Objective
Conduct thorough health assessment of database to identify issues, validate integrity, check for bloat, and ensure optimal operational state across all database components.

**Note:** No need to worry about backward compatibility or existing application code - the application has not been built yet.

## Phase 1: Documentation Research
Use Context7 MCP to fetch latest Supabase documentation on:
- Database health monitoring best practices
- Bloat detection and management
- Constraint validation techniques
- Referential integrity checking
- Statistics maintenance
- Vacuum and analyze strategies
- Connection and resource monitoring
- Backup and recovery validation

## Phase 2: Health Assessment
Use Supabase MCP to check database health:

### Table Health:
- Table bloat percentage and space waste
- Dead tuple accumulation
- Last vacuum and analyze timestamps
- Table size growth trends
- Toast table health
- Partition health if applicable

### Index Health:
- Index bloat percentage
- Unused index identification
- Invalid index detection
- Missing indexes on constraints
- Index fragmentation levels
- Index statistics staleness

### Constraint Health:
- Constraint validity status
- Foreign key constraint integrity
- Check constraint violations
- Unique constraint enforcement
- Not-null constraint compliance
- Default value consistency

### Referential Integrity:
- Orphaned record detection
- Foreign key relationship validation
- Cascade behavior verification
- Circular dependency identification
- Missing relationship validation

### Data Quality:
- NULL value patterns
- Data type consistency
- Duplicate record identification
- Outlier value detection
- Data distribution analysis
- Constraint violation potential

### Performance Metrics:
- Query performance statistics
- Sequential scan frequency
- Cache hit ratios
- Transaction throughput
- Connection usage patterns
- Lock contention issues

### Security Health:
- RLS policy coverage
- Permission configuration audit
- Function security settings
- Authentication configuration
- Extension security review

### Storage Health:
- Database size metrics
- Tablespace utilization
- WAL (Write-Ahead Log) size
- Archive log management
- Backup availability and freshness
- Replication lag if applicable

## Phase 3: Issue Resolution
Use Supabase MCP to address identified issues:

### Bloat Management:
1. Identify tables and indexes requiring maintenance
2. Schedule vacuum operations for bloated objects
3. Rebuild indexes with excessive bloat
4. Configure autovacuum appropriately
5. Monitor bloat reduction

### Constraint Repair:
1. Revalidate invalid constraints
2. Fix constraint violations in data
3. Add missing constraints
4. Optimize constraint checking
5. Document constraint requirements

### Integrity Restoration:
1. Identify and resolve orphaned records
2. Fix foreign key relationship issues
3. Repair broken constraint chains
4. Validate cascade operations
5. Document integrity fixes

### Performance Tuning:
1. Update statistics on tables with stale data
2. Reindex fragmented indexes
3. Optimize vacuum schedule
4. Adjust autovacuum parameters
5. Configure appropriate statistics targets

### Security Hardening:
1. Add missing RLS policies
2. Review and tighten permissions
3. Audit function security settings
4. Update authentication configuration
5. Document security posture

## Phase 4: Ongoing Monitoring Setup
Use Supabase MCP to establish monitoring:
- Configure appropriate alert thresholds
- Set up bloat monitoring schedule
- Establish constraint validation routine
- Configure statistics update frequency
- Set up backup verification schedule
- Document monitoring procedures

## Phase 5: Health Report
Generate comprehensive health report:
- Overall database health score
- Table health summary (bloat, size, activity)
- Index health metrics (usage, bloat, validity)
- Constraint status (valid, invalid, missing)
- Referential integrity results (violations found/fixed)
- Data quality assessment
- Performance metrics summary
- Security posture evaluation
- Storage utilization report
- Recommendations for maintenance
- Action items prioritized by severity
- Monitoring recommendations

## Guidelines:
- Perform health checks during low-activity periods when possible
- Validate changes in non-production environment first
- Use transactions for data integrity fixes
- Schedule maintenance operations appropriately
- Document all issues found and resolutions applied
- Prioritize critical issues affecting data integrity
- Monitor performance impact of maintenance operations
- Keep stakeholders informed of significant issues
- Establish regular health check schedule
- Automate routine health monitoring
- Archive health reports for trend analysis
- Update monitoring thresholds based on growth
- Plan capacity based on growth trends
- Maintain runbooks for common issues