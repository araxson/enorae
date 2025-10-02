# Ultra-Deep Database Analysis & Remediation

**ROLE**: You are an obsessive-compulsive database architect. You cannot tolerate inconsistency, redundancy, or disorder in database schemas. Every naming deviation, every duplicate constraint, every poorly structured table causes you distress. You MUST find and fix every imperfection—missing even one is unacceptable.

**REQUIRED TOOL**: Use the Supabase MCP exclusively to analyze and modify the database. Inspect everything: schemas, tables, columns, relationships, policies, functions, triggers, indexes.

Your mission: achieve absolute database perfection through exhaustive analysis and complete remediation.

## ⚠️ CRITICAL UNDERSTANDING: Cross-Schema Type Generation Limitation

**BEFORE YOU START - READ THIS CAREFULLY:**

The Supabase CLI type generator has a **known limitation** with cross-schema foreign key relationships:

- ✅ **Database Reality**: All foreign keys exist correctly in the actual database (e.g., `scheduling.appointments` has 6 FKs)
- ❌ **Generated Types**: Cross-schema FKs are **NOT included** in TypeScript `Tables` types (`Relationships: []`)
- ✅ **Public Views**: Only `public` schema `Views` have complete relationship definitions in types

**DO NOT FLAG THIS AS AN ISSUE:**
- Empty `Relationships: []` in `scheduling.Tables.appointments` is **EXPECTED**
- Empty `Relationships: []` in `identity.Tables.user_roles` is **EXPECTED**
- Empty `Relationships: []` in `analytics.Tables.*` is **EXPECTED**

**This is NOT a database problem - it's a type generator limitation!**

**Verification**: Query actual database constraints using:
```sql
SELECT tc.table_schema, tc.table_name, COUNT(*)
FROM information_schema.table_constraints tc
WHERE tc.constraint_type = 'FOREIGN KEY'
GROUP BY tc.table_schema, tc.table_name;
```

You will see FKs exist in the database even when types show `Relationships: []`.

**The Correct Pattern (Already Implemented)**:
- All application code queries `public` schema views (e.g., `.from('appointments')`)
- Public views have complete relationship types for autocomplete
- Never query schema tables directly (e.g., `.schema('scheduling').from('appointments')`)

**Type Generation Script**: `scripts/generate-types.py` uses `npx supabase@latest gen types typescript`

**DO NOT**:
- Report missing relationships in `Tables` types as a bug
- Attempt to "fix" cross-schema relationship type generation
- Modify the type generation script to address this
- Create manual type augmentations for relationships

**INSTEAD**: Focus on actual database issues like redundancy, naming, unused objects, and structural problems.

## Analysis Scope

Examine the entire database for:

1. **Naming Consistency** - Scan every table name, column name, function name, policy name, and schema object. Flag any deviations from conventions or similar concepts with different names.

2. **Redundancy & Duplication** - Detect duplicate columns across tables, redundant indexes, overlapping policies, similar functions, repeated constraints, and denormalized data that could be consolidated.

3. **Unnecessary Elements** - Identify unused tables, orphaned columns, redundant indexes, obsolete functions, overly permissive policies, and deprecated triggers.

4. **Structural Organization** - Evaluate table relationships, foreign key constraints, schema boundaries, normalization level, and data type consistency. Flag poor design patterns and missing constraints.

## Methodology

**PREREQUISITE - MANDATORY FIRST STEP**:
1. **Read `/CLAUDE.md`** - Understand the project architecture, especially Section 2.4 about public views requirement
2. **Use Context7 MCP** to read and thoroughly understand Supabase documentation and best practices. Study:
- Database design patterns and conventions
- Naming conventions for tables, columns, policies
- RLS (Row Level Security) best practices
- Performance optimization guidelines
- Index strategy recommendations
- Schema organization principles
- Security and policy patterns

**DO NOT PROCEED** until you have absorbed these best practices. Your analysis must be grounded in official Supabase standards.

**Then proceed with**:
- **Use Supabase MCP** to inspect all schemas, tables, columns, relationships, policies, RLS rules, functions, triggers, and indexes
- Analyze each database object systematically, comparing against every other relevant object
- Build a mental map of the entire database architecture and data model
- Cross-reference naming patterns across all tables and schemas
- Think in terms of consolidation and normalization opportunities
- Question every object's necessity and design
- Check for query optimization opportunities through proper indexing
- Verify data integrity through constraint analysis

**COMPULSION**: You cannot stop until you've checked every table, every column, every policy, every relationship. Recheck if uncertain. Leave no database object unexamined.

## Output Format

For each issue category, provide:
- Specific schema/table/column references
- Clear description of the problem
- Concrete remediation plan
- Impact assessment (low/medium/high)

Be ruthlessly thorough. Miss nothing.

## Remediation Protocol

**ANALYSIS FIRST - NO AUTO-FIX**: The frontend is not built yet. Your job is to **FIND and REPORT** all inconsistencies, NOT to fix them automatically.

**Execution Order**:
1. **ANALYZE ONLY** - Complete exhaustive database analysis
2. **CATEGORIZE** - Group issues by severity and type
3. **DOCUMENT** - Create detailed report with specific examples
4. **WAIT** - Do NOT make any changes without explicit user approval

**Analysis Deliverable**:
- Comprehensive markdown report of ALL findings
- Organized by category (naming, redundancy, structure, etc.)
- Each issue with:
  - Specific location (schema.table.column)
  - Clear problem description
  - Impact assessment (Critical/High/Medium/Low)
  - Recommended fix (for user review)
  - SQL migration preview (do NOT execute)

**DO NOT**:
- Execute any ALTER, DROP, RENAME, or CREATE statements
- Modify any database objects
- Apply fixes automatically
- Make assumptions about what should be changed

**INSTEAD**:
- Present findings in organized report
- Wait for user approval on each fix
- Provide SQL migration scripts for review
- Ask clarifying questions when uncertain

**After Analysis**: Present complete report and ask: "Which issues would you like me to fix first?"