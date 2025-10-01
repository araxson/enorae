ULTRATHINK to identify and eliminate all database redundancies and duplications using Context7 MCP for Supabase documentation and Supabase MCP for all operations. Keep token usage under 20000 by using pagination and filtering.

## Objective
Systematically identify and eliminate all forms of redundancy, duplication, and unnecessary repetition throughout the database to optimize storage, improve performance, and reduce maintenance complexity.

**Note:** No need to worry about backward compatibility or existing application code - the application has not been built yet.

## Phase 1: Documentation Research
Use Context7 MCP to fetch latest Supabase documentation on:
- Database normalization and redundancy elimination
- Single source of truth principles
- View and computed column strategies
- Data deduplication techniques
- Index consolidation best practices
- Storage optimization methods

## Phase 2: Redundancy Analysis
Use Supabase MCP to identify all forms of redundancy:

### Duplicate Columns:
- Same data stored across multiple tables
- Denormalized copies of reference data
- Computed values stored redundantly
- Repeated configuration fields
- Duplicated audit information

### Redundant Computed Data:
- Stored calculated values that can be computed on-demand
- Aggregated data that can be derived from source
- Cached values without invalidation strategy
- Summary fields duplicating detail data

### Duplicate Indexes:
- Identical index definitions on same columns
- Overlapping composite indexes
- Redundant single-column indexes when composite exists
- Indexes with same columns in different orders serving same queries
- Partial indexes with overlapping conditions

### Redundant Policies:
- Row Level Security policies with overlapping conditions
- Multiple policies achieving same access control
- Duplicate policy logic across tables
- Overly complex policies that could be simplified

### Duplicate Functions:
- Near-identical function implementations
- Functions with only parameter differences
- Repeated logic that could be extracted
- Similar trigger functions that could be consolidated

### Duplicate Triggers:
- Multiple triggers on same table doing similar work
- Trigger logic that could be combined
- Redundant audit triggers
- Overlapping validation triggers

### Duplicate Data:
- Actual duplicate rows in tables
- Denormalized data that got out of sync
- Historical data stored redundantly
- Archived data mixed with active data

### Redundant Audit Tracking:
- Multiple timestamp fields tracking same events
- Duplicate audit tables or columns
- Overlapping change tracking mechanisms

## Phase 3: Elimination Strategy
Use Supabase MCP to eliminate redundancies:

### Duplicate Column Elimination:
1. Identify source of truth for each data element
2. Create views or computed columns for derived access
3. Migrate dependent queries to use single source
4. Remove redundant column copies
5. Add constraints to prevent future duplication

### Computed Data Optimization:
1. Replace stored computed fields with database views
2. Create indexed views for frequently accessed computations
3. Implement computed columns for simple derivations
4. Remove redundant stored values
5. Document computation logic

### Index Consolidation:
1. Analyze index usage patterns and overlaps
2. Identify most comprehensive index for each query pattern
3. Remove redundant or duplicate indexes
4. Keep only necessary indexes
5. Document remaining index purposes

### Policy Consolidation:
1. Map all policy conditions and their coverage
2. Identify overlapping or redundant rules
3. Merge policies with same intent
4. Simplify complex policy expressions
5. Remove duplicate policy checks

### Function Refactoring:
1. Extract common logic into shared utility functions
2. Use function overloading instead of similar functions
3. Create generic functions replacing specific variants
4. Remove near-duplicate implementations
5. Document consolidated function usage

### Trigger Consolidation:
1. Combine triggers operating on same table event
2. Extract shared trigger logic
3. Remove redundant trigger implementations
4. Optimize trigger execution order

### Data Deduplication:
1. Identify duplicate records using key field analysis
2. Determine canonical record for each duplicate set
3. Update foreign key references to canonical records
4. Archive or remove duplicate records
5. Add unique constraints to prevent recurrence

### Audit Field Cleanup:
1. Standardize on single audit field pattern
2. Remove redundant timestamp tracking
3. Consolidate change history mechanisms
4. Implement consistent audit strategy

## Phase 4: Validation
Use Supabase MCP to verify:
- No data loss from deduplication
- All queries still function correctly
- Views provide necessary data access
- Constraints prevent future duplication
- Index removals don't impact performance negatively
- Policy consolidation maintains security
- Function consolidation preserves functionality

## Phase 5: Impact Reporting
Generate comprehensive report:
- Duplicate columns removed (count and tables affected)
- Redundant indexes deleted (count and storage reclaimed)
- Duplicate data rows eliminated (count per table)
- Overlapping policies merged (count and complexity reduction)
- Duplicate functions consolidated (count)
- Storage space reclaimed (size metrics)
- Query performance improvements (before/after)
- Maintenance complexity reduction

## Guidelines:
- Prioritize redundancy elimination as first optimization step
- Preserve data during elimination (archive if needed)
- Use transactions for deduplication operations
- Validate each elimination before proceeding
- Document all eliminations and their rationale
- Track storage savings from each elimination
- Measure performance improvements
- Test dependent queries after each change
- Maintain audit trail of eliminated data
- Create rollback plan for each elimination