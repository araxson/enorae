ULTRATHINK to optimize database performance through strategic indexing using Context7 MCP for Supabase documentation and Supabase MCP for all operations. Keep token usage under 20000 by using pagination and filtering.

## Objective
Analyze query patterns and table access to create optimal indexing strategy, removing inefficient indexes and adding strategic ones to improve query performance.

**Note:** No need to worry about backward compatibility or existing application code - the application has not been built yet.

## Phase 1: Documentation Research
Use Context7 MCP to fetch latest Supabase documentation on:
- Index types and their use cases
- B-tree index optimization
- GIN index for JSONB and arrays
- GiST index for full-text search
- Partial index strategies
- Composite index design
- Index selectivity and cardinality
- Index bloat identification
- Query performance analysis

## Phase 2: Performance Analysis
Use Supabase MCP to analyze current state:

### Missing Index Identification:
- Foreign key columns without indexes
- Frequently queried columns lacking indexes
- WHERE clause columns without appropriate indexes
- JOIN columns missing indexes
- ORDER BY columns that could benefit from indexes
- Columns used in aggregations

### Problematic Index Identification:
- Unused indexes with no query utilization
- Low selectivity indexes that don't help queries
- Bloated indexes needing rebuilding
- Indexes on columns that rarely filter data
- Indexes duplicating others
- Indexes on small tables where sequential scan is faster

### Query Pattern Analysis:
- Most frequent query patterns
- Slow queries needing optimization
- Table scan patterns
- Join performance issues
- Aggregation query patterns
- Filter selectivity analysis

### Index Type Optimization:
- JSONB columns needing GIN indexes
- Array columns needing appropriate indexes
- Text columns for full-text search consideration
- Spatial data needing GiST indexes
- Range query columns needing appropriate index types

## Phase 3: Index Optimization
Use Supabase MCP to implement improvements:

### Remove Problematic Indexes:
1. Drop unused indexes consuming space
2. Remove duplicate indexes
3. Eliminate low-selectivity indexes
4. Drop indexes on small tables
5. Document removal rationale

### Add Strategic Indexes:

#### B-tree Indexes:
- Foreign key columns
- Primary join columns
- Equality comparison columns
- Range query columns
- ORDER BY columns with high cardinality

#### GIN Indexes:
- JSONB columns with property queries
- Array columns with containment queries
- Full-text search columns
- JSONB columns with frequent key existence checks

#### Partial Indexes:
- Filtered queries on subset of data
- Status column filtered queries
- Soft-delete filtered queries
- Active record filtered queries
- Date range filtered queries

#### Composite Indexes:
- Multi-column WHERE clauses
- Combined filter and sort columns
- Frequently joined column pairs
- Multi-column uniqueness requirements
- Covering indexes for query optimization

### Index Maintenance:
1. Configure appropriate fillfactor for high-update tables
2. Set up index statistics targets
3. Plan index rebuild schedule for bloated indexes
4. Configure autovacuum for index health

## Phase 4: Performance Validation
Use Supabase MCP to verify improvements:
- Query execution plans before/after
- Query execution time comparisons
- Index usage statistics
- Table scan reduction metrics
- Join performance improvements
- Overall query throughput changes

## Phase 5: Documentation
Generate performance report:
- Indexes removed (count, type, storage reclaimed)
- Indexes added (count, type, rationale)
- Query performance improvements (specific metrics)
- Execution plan improvements
- Index usage statistics
- Recommendations for query optimization
- Monitoring recommendations

## Guidelines:
- Remove problematic indexes before adding new ones
- Validate query plans after each index change
- Consider index maintenance cost vs query benefit
- Use partial indexes for frequently filtered subsets
- Prefer composite indexes over multiple single-column indexes when beneficial
- Monitor index bloat regularly
- Document index purpose and queries it serves
- Test query performance in realistic conditions
- Consider write performance impact of indexes
- Balance read vs write optimization based on workload
- Use covering indexes strategically
- Avoid over-indexing tables