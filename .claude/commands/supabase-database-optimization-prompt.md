ULTRATHINK to perform a comprehensive database structure review and optimization using the latest Supabase documentation via context7 MCP and apply all fixes via Supabase MCP. Keep token usage under 25000 by using pagination and filtering.

**CRITICAL FOCUS: Identify and eliminate ALL redundancies, duplications, and unnecessary repetitions throughout the database structure, policies, functions, and data patterns.**

## Phase 1: Analysis & Documentation Review
1. Fetch latest Supabase best practices from context7 for:
   - Database normalization patterns
   - Row Level Security (RLS) optimization
   - Index optimization strategies
   - Performance best practices
   - Naming conventions
   - Function complexity guidelines

## Phase 2: Database Structure Analysis
Analyze the current database for:

### Table Structure Issues:
- Identify tables with >30 columns (wide tables)
- Find denormalized data patterns
- Detect missing primary keys or inappropriate key types
- Identify tables without proper timestamps (created_at, updated_at)
- Find tables with mixed concerns (violations of single responsibility)

### Naming Convention Issues:
- Check for non-snake_case column names
- Identify inconsistent naming patterns
- Find reserved word usage
- Detect naming conflicts

### Relationship Issues:
- Missing foreign key constraints
- Incorrect cascade rules
- Orphaned records possibilities
- Missing junction tables for many-to-many relationships

### Redundancy & Duplication Issues (PRIORITY):
- **Duplicate columns** across related tables
- **Redundant computed/derived data** that can be calculated on-demand
- **Repeated JSONB fields** that should be normalized
- **Duplicate or near-duplicate indexes** (same columns, different order)
- **Redundant RLS policies** with overlapping conditions
- **Duplicate function implementations** with minor variations
- **Repeated trigger logic** that could be consolidated
- **Duplicate data** in denormalized tables
- **Redundant timestamp tracking** (multiple audit columns)
- **Overlapping composite indexes** where single-column index exists

### Performance Issues:
- Missing indexes on foreign keys
- Duplicate or redundant indexes
- Unused indexes (>50% bloat)
- Missing partial indexes for filtered queries
- Tables without proper partitioning strategy

### Security Issues:
- Tables without RLS policies
- SECURITY DEFINER functions without search_path
- Overly permissive policies
- Missing auth.uid() wrapping in policies
- Direct auth.uid() usage causing initPlan issues

### Function & Trigger Complexity:
- Functions >4000 characters (need refactoring)
- Functions without proper error handling
- Triggers causing cascading issues
- Missing or incorrect return types

## Phase 3: Apply Fixes

### For Redundancies & Duplications (FIRST PRIORITY):
1. **Eliminate duplicate columns:**
   - Identify columns with same data across tables
   - Move to single source of truth table
   - Create views or computed columns if needed
   - Remove redundant copies

2. **Remove redundant computed data:**
   - Identify derived/calculated columns
   - Replace with computed columns or views
   - Create indexed views for frequently accessed computations
   - Remove stored redundant values

3. **Consolidate duplicate indexes:**
   - Identify overlapping index definitions
   - Keep most comprehensive index
   - Remove partial duplicates
   - Document index usage patterns

4. **Merge redundant RLS policies:**
   - Identify overlapping policy conditions
   - Consolidate into single comprehensive policies
   - Remove duplicate policy checks
   - Optimize policy expressions

5. **Refactor duplicate functions:**
   - Extract common logic into shared functions
   - Create reusable utility functions
   - Remove near-duplicate implementations
   - Use function overloading where appropriate

6. **Deduplicate data:**
   - Run deduplication queries on affected tables
   - Add unique constraints to prevent future duplicates
   - Archive or remove redundant historical data
   - Implement proper normalization

### For Wide Tables (>30 columns):
1. Create normalized table structure:
   - Core table (essential fields only)
   - Settings table (configuration data)
   - Metadata table (additional info)
   - Metrics/Analytics table (calculated/aggregated data)
   - Media/Assets table (URLs, files, images)

2. Migrate data with:
   - Proper data type preservation
   - NULL handling
   - Default values
   - Constraint validation

3. Update relationships:
   - Add foreign keys with proper CASCADE rules
   - Create indexes on foreign keys
   - Add RLS policies for new tables

### For Performance Issues:
1. Add strategic indexes:
   - B-tree for equality/range queries
   - GIN for JSONB/array columns
   - Partial indexes for filtered queries
   - Composite indexes for multi-column queries

2. Remove problematic indexes:
   - Duplicate indexes
   - Unused indexes
   - Low selectivity indexes

### For Security Issues:
1. Add comprehensive RLS policies:
   - Wrap auth.uid() references for initPlan optimization
   - Use SECURITY INVOKER for views
   - Add explicit search_path to functions
   - Implement least privilege principle

### For Complex Functions:
1. Refactor into smaller functions:
   - Single responsibility per function
   - Max 1000 lines per function
   - Proper error handling
   - Clear return types

2. Add documentation:
   - COMMENT ON FUNCTION for all functions
   - Parameter descriptions
   - Return value descriptions

## Phase 4: Validation & Reporting

### Generate Comprehensive Report:
1. **Redundancies eliminated:**
   - Duplicate columns removed (count)
   - Redundant indexes deleted (count)
   - Duplicate data deduplicated (row count)
   - Overlapping RLS policies merged (count)
   - Duplicate functions consolidated (count)
   - Storage space reclaimed (MB/GB)
2. Tables normalized (before/after column count)
3. Indexes optimized (added/removed count)
4. RLS policies added/fixed
5. Functions refactored
6. Performance improvements achieved
7. Security vulnerabilities fixed
8. Naming conventions standardized

### Run Health Checks:
- Check table/index bloat
- Verify constraint validity
- Test RLS policies
- Validate foreign keys
- Check for orphaned records

## Phase 5: Create Migration Rollback Plan
Generate rollback migrations for all changes in case issues arise.

## Important Guidelines:
- **PRIORITIZE redundancy/duplication removal** as the first optimization step
- **Eliminate ALL duplicate indexes** before creating new ones
- **Remove redundant data** before normalizing table structures
- **Consolidate overlapping logic** in functions and triggers
- Make changes incrementally with validation between steps
- Preserve all existing data during deduplication (archive if needed)
- Maintain backward compatibility where possible
- Document all breaking changes and removed redundancies
- Use transactions for data migrations and deduplication
- Test RLS policies after creation and consolidation
- Verify indexes are being used after removing duplicates
- Check query performance after changes
- **Track storage savings** from redundancy removal
- **Measure performance improvements** from deduplication

Execute this optimization systematically, reporting progress at each phase. ALWAYS start with identifying and removing redundancies/duplications before proceeding to other optimizations.