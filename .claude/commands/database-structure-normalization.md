
MUST: This is pass #{N} of 10 sequential fix passes.

ULTRATHINK to analyze and normalize the database structure using Context7 MCP for Supabase documentation and Supabase MCP for all operations. Keep token usage under 20000 by using pagination and filtering.

## Objective
Analyze current database table structures and normalize them according to database normalization best practices, reducing wide tables and improving data organization.

**Note:** No need to worry about backward compatibility or existing application code - the application has not been built yet.

## Phase 1: Documentation Research
Use Context7 MCP to fetch latest Supabase documentation on:
- Database normalization patterns and forms
- Table design best practices
- Relationship modeling strategies
- Primary key selection guidelines
- Timestamp and audit field conventions
- Single responsibility principle for tables

## Phase 2: Structure Analysis
Use Supabase MCP to analyze current database and identify:

### Wide Table Issues:
- Tables exceeding recommended column count thresholds
- Mixed concerns within single tables
- Data that could be separated into related tables
- Configuration vs core data mixed together
- Metadata mixed with transactional data
- Metrics or analytics data stored with operational data

### Key Structure Issues:
- Missing or inappropriate primary keys
- Inappropriate key types that should be optimized
- Missing standard timestamp fields
- Inconsistent timestamp field usage across tables

### Naming Issues:
- Non-standard column name formats
- Inconsistent naming patterns across schema
- Reserved word conflicts
- Naming that doesn't follow convention

### Relationship Structure:
- Missing foreign key constraints that should exist
- Incorrect or missing cascade rules
- Many-to-many relationships without proper junction tables
- Potential for orphaned records

## Phase 3: Apply Normalization
Use Supabase MCP to implement fixes:

### For Wide Tables:
1. Design normalized structure:
   - Core table with essential operational fields
   - Settings/configuration table for customization data
   - Metadata table for supplementary information
   - Metrics/analytics table for computed values
   - Media/assets table for file references

2. Migrate data maintaining:
   - Data type integrity
   - NULL value handling
   - Default value preservation
   - Constraint compliance

3. Establish relationships:
   - Foreign keys with appropriate cascade behavior
   - Indexes on foreign key columns
   - Documentation of relationship rationale

### For Key Issues:
- Add or correct primary keys with appropriate types
- Standardize timestamp fields across all tables
- Implement consistent audit field patterns

### For Naming Issues:
- Rename fields to follow standard conventions
- Resolve reserved word conflicts
- Standardize naming patterns schema-wide

### For Relationship Issues:
- Add missing foreign key constraints
- Create junction tables where needed
- Define appropriate cascade rules
- Add indexes to support relationships

## Phase 4: Validation
Use Supabase MCP to verify:
- All tables have appropriate primary keys
- Standard fields exist consistently
- Foreign key constraints are valid
- Naming follows conventions throughout
- No data loss occurred during migration
- Referential integrity is maintained

## Phase 5: Documentation
Generate report documenting:
- Tables normalized (before/after column counts)
- Relationships added or corrected
- Naming standardization changes
- Data migration statistics
- Breaking changes that require application updates
- Recommended view creation for backward compatibility

## Guidelines:
- Preserve all data during migrations
- Use transactions for data movement operations
- Maintain backward compatibility where feasible
- Document all breaking changes clearly
- Create views to ease transition if needed
- Validate referential integrity after each change
- Test data access patterns after normalization
- Keep changes incremental with validation steps