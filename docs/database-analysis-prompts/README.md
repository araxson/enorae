# Supabase Database Analysis Prompts

**Ultra-deep database analysis agents for Claude Code**

This collection provides 8 specialized database analysis prompts that generate autonomous agents to comprehensively analyze your Supabase database from multiple perspectives and create detailed reports.

## 📋 Quick Start

### Run Complete Analysis (Recommended)
```
Use the master coordinator prompt (00-master-coordinator.md) to run a comprehensive database analysis
```

This will execute all 7 specialized analyzers and generate a master executive summary with cross-cutting insights.

### Run Individual Analyzers
Pick specific prompts based on what you want to analyze:

```
Use the schema structure analyzer prompt (01-schema-structure-analyzer.md) to analyze database schema organization
```

## 📊 Available Analyzers

### 00. Master Coordinator (⭐ Start Here)
**File:** `00-master-coordinator.md`

**Purpose:** Orchestrates all analyzers and generates comprehensive executive summary

**When to use:**
- Initial database audit
- Monthly health checks
- Pre-production readiness review
- After major migrations
- Database optimization planning

**Output:** `docs/database-analysis/00-MASTER-EXECUTIVE-SUMMARY.md` + 7 detailed reports

**Estimated time:** 10-20 minutes

---

### 01. Schema Structure Analyzer
**File:** `01-schema-structure-analyzer.md`

**Purpose:** Analyzes database schema organization, table structure, and naming conventions

**What it checks:**
- Table naming conventions and consistency
- Column data types and consistency
- Primary keys and identity columns
- Foreign key relationships
- Missing audit columns (created_at, updated_at)
- Schema organization adherence

**When to use:**
- New feature planning
- Schema refactoring
- Architecture review
- Onboarding new developers

**Output:** `docs/database-analysis/01-schema-structure-report.md`

**Estimated time:** 2-3 minutes

---

### 02. Security & RLS Analyzer
**File:** `02-security-rls-analyzer.md`

**Purpose:** Analyzes Row Level Security policies, permissions, and security vulnerabilities

**What it checks:**
- RLS policy coverage and completeness
- Overly permissive policies
- Missing tenant isolation
- Auth.uid() usage in policies
- Public schema access
- Missing security constraints

**When to use:**
- Security audits
- Before production deployment
- After policy changes
- Compliance reviews
- Suspicious activity investigation

**Output:** `docs/database-analysis/02-security-rls-report.md`

**Estimated time:** 2-4 minutes

---

### 03. Performance & Indexes Analyzer
**File:** `03-performance-indexes-analyzer.md`

**Purpose:** Analyzes database performance, indexing strategies, and query optimization

**What it checks:**
- Missing indexes on foreign keys
- Unused indexes wasting space
- Duplicate or redundant indexes
- Sequential scans on large tables
- Table bloat and fragmentation
- Cache hit ratios
- Query performance patterns

**When to use:**
- Performance issues
- Slow query investigation
- Before scaling up
- Regular optimization (monthly)
- After adding new features

**Output:** `docs/database-analysis/03-performance-indexes-report.md`

**Estimated time:** 3-5 minutes

---

### 04. Data Integrity Analyzer
**File:** `04-data-integrity-analyzer.md`

**Purpose:** Analyzes data integrity, constraints, validation rules, and data quality

**What it checks:**
- Primary key, foreign key, unique, and check constraints
- Missing NOT NULL constraints
- Orphaned records (missing parent references)
- Data validation rules
- Trigger inventory and effectiveness
- Referential integrity violations

**When to use:**
- Data quality issues
- Before major data migrations
- After bulk data imports
- Investigating data inconsistencies
- Quarterly data audits

**Output:** `docs/database-analysis/04-data-integrity-report.md`

**Estimated time:** 3-5 minutes

---

### 05. Migration History Analyzer
**File:** `05-migration-history-analyzer.md`

**Purpose:** Analyzes migration history, schema evolution, and version consistency

**What it checks:**
- Migration inventory and timeline
- Schema drift (manual changes)
- Migration quality and safety
- Version control consistency
- Rollback capabilities
- Untracked database objects

**When to use:**
- Schema drift concerns
- Before major migrations
- After manual database changes
- Migration troubleshooting
- Database version audits

**Output:** `docs/database-analysis/05-migration-history-report.md`

**Estimated time:** 2-3 minutes

---

### 06. Storage & Usage Analyzer
**File:** `06-storage-usage-analyzer.md`

**Purpose:** Analyzes storage patterns, disk usage, growth trends, and optimization opportunities

**What it checks:**
- Storage distribution by schema
- Largest tables and indexes
- Table and index bloat
- Growth projections
- Archive candidates
- Space efficiency
- Cost projections

**When to use:**
- Approaching storage limits
- Cost optimization planning
- Capacity planning
- Performance degradation from bloat
- Monthly monitoring

**Output:** `docs/database-analysis/06-storage-usage-report.md`

**Estimated time:** 2-4 minutes

---

### 07. View Definitions Analyzer
**File:** `07-view-definitions-analyzer.md`

**Purpose:** Analyzes database views, complexity, usage patterns, and ENORAE pattern compliance

**What it checks:**
- View naming convention adherence (*_view)
- View complexity metrics
- Materialized view candidates
- View usage in application code
- Security issues in view definitions
- View dependency chains
- Pattern compliance (reads from views)

**When to use:**
- View performance issues
- Pattern compliance audits
- Before view refactoring
- Application performance optimization
- Quarterly view reviews

**Output:** `docs/database-analysis/07-view-definitions-report.md`

**Estimated time:** 2-3 minutes

---

## 🎯 Use Case Matrix

| Scenario | Recommended Analyzers | Priority |
|----------|----------------------|----------|
| **New project setup** | 00 (Master) | Critical |
| **Monthly health check** | 00 (Master) | High |
| **Performance issues** | 03, 06, 07 | Critical |
| **Security audit** | 02, 04 | Critical |
| **Before production** | 00 (Master), 02 | Critical |
| **After migration** | 01, 05, 04 | High |
| **Storage concerns** | 06, 03 | High |
| **Data quality issues** | 04, 01 | High |
| **Schema refactoring** | 01, 05, 07 | Medium |
| **Cost optimization** | 06, 03 | Medium |
| **Pattern compliance** | 07, 01, 02 | Medium |
| **Onboarding developers** | 01, 07 | Low |

## 🚀 How to Use

### Method 1: Using Claude Code Agent Generator

1. Open the specific prompt file (e.g., `01-schema-structure-analyzer.md`)
2. Copy the entire content
3. Send to Claude Code with:
   ```
   Generate an agent using this prompt: [paste prompt]
   ```
4. Claude Code will create a specialized agent that runs autonomously
5. Wait for the agent to complete and generate the report

### Method 2: Direct Execution

Simply send to Claude Code:
```
Use the [analyzer name] prompt from docs/database-analysis-prompts/ to analyze my database
```

Example:
```
Use the security and RLS analyzer prompt to analyze my database
```

### Method 3: Master Coordinator (Recommended)

For comprehensive analysis:
```
Use the master coordinator prompt to run a complete database analysis
```

This runs all analyzers and generates a master summary.

## 📁 Output Structure

All reports are saved to `docs/database-analysis/`:

```
docs/database-analysis/
├── 00-MASTER-EXECUTIVE-SUMMARY.md    # Master overview and prioritized actions
├── 01-schema-structure-report.md      # Schema organization and structure
├── 02-security-rls-report.md          # Security policies and vulnerabilities
├── 03-performance-indexes-report.md   # Performance metrics and optimization
├── 04-data-integrity-report.md        # Data quality and constraints
├── 05-migration-history-report.md     # Migration tracking and drift
├── 06-storage-usage-report.md         # Storage patterns and projections
└── 07-view-definitions-report.md      # View analysis and compliance
```

## 📈 Recommended Analysis Frequency

| Analyzer | Frequency | Trigger Events |
|----------|-----------|----------------|
| **Master Coordinator** | Monthly | Major releases, pre-production |
| **Security & RLS** | Weekly | Policy changes, security concerns |
| **Performance** | Weekly | Slow queries, user complaints |
| **Data Integrity** | Monthly | Data imports, integrity errors |
| **Storage** | Monthly | Near storage limits, cost review |
| **Schema Structure** | Quarterly | Schema changes, refactoring |
| **Migration History** | After each migration | Migration runs |
| **View Definitions** | Quarterly | View changes, pattern audits |

## 🔧 Requirements

### Supabase Project
- Active Supabase project
- Database access via MCP tools
- Supabase project ID

### Claude Code Setup
- Supabase MCP server configured
- Read/Write/Execute permissions
- Sufficient context window (Sonnet 3.5+ recommended)

### Minimum Supabase Plan
- Free tier: ✅ All analyzers work
- Pro tier: ✅ Enhanced performance metrics
- Enterprise: ✅ Full feature access

## ⚙️ Configuration

### Project ID
All analyzers need your Supabase project ID. You can:
- Let Claude Code auto-detect it
- Provide it explicitly when running
- Set it in environment variables

### Analysis Scope
You can customize analyzers by:
- Specifying schemas to analyze
- Excluding specific tables
- Adjusting complexity thresholds
- Filtering by size or age

## 📊 Understanding Reports

### Report Sections

Each report includes:

1. **Executive Summary** - Key metrics and critical issues
2. **Detailed Analysis** - Comprehensive findings by category
3. **Critical Issues** - High/Medium/Low priority problems
4. **Recommendations** - Actionable steps prioritized by impact
5. **Appendices** - Complete data inventories and references

### Issue Priorities

- 🔴 **Critical** - Fix immediately (security, data loss risk)
- 🟠 **High Priority** - Fix this week (performance, patterns)
- 🟡 **Medium Priority** - Fix this month (optimization, tech debt)
- 🟢 **Low Priority** - Nice to have (minor improvements)

### Health Scores

Reports include health scores (0-100):
- **90-100:** Excellent - minimal issues
- **75-89:** Good - minor improvements needed
- **60-74:** Fair - several issues to address
- **40-59:** Poor - significant problems
- **0-39:** Critical - urgent intervention required

## 🎓 Best Practices

### Before Running Analysis

1. ✅ Ensure database is in stable state
2. ✅ Complete any pending migrations
3. ✅ Back up database (if making changes after)
4. ✅ Note any known issues for comparison
5. ✅ Schedule during low-traffic period (for performance queries)

### After Analysis

1. ✅ Review master executive summary first
2. ✅ Triage critical issues immediately
3. ✅ Create tasks for high-priority items
4. ✅ Share reports with relevant team members
5. ✅ Track improvements over time
6. ✅ Schedule next analysis

### Interpreting Results

- **Don't panic** - Most databases have issues to address
- **Prioritize** - Focus on critical and high-priority items first
- **Incremental** - Fix issues over time, not all at once
- **Monitor** - Track improvements with regular analysis
- **Context matters** - Consider your specific requirements

## 🐛 Troubleshooting

### Agent Fails to Complete

**Possible causes:**
- Database timeout on large queries
- Insufficient permissions
- Network connectivity issues

**Solutions:**
- Run smaller analyzers individually
- Check Supabase MCP connection
- Increase query timeouts
- Run during low-traffic period

### Reports Are Incomplete

**Possible causes:**
- Large database size (>10GB)
- Complex view definitions
- Slow queries timing out

**Solutions:**
- Run analyzers separately instead of coordinator
- Exclude specific schemas if needed
- Review individual SQL queries and optimize

### Permission Errors

**Possible causes:**
- Insufficient database role
- Missing RLS policies
- Service role not configured

**Solutions:**
- Use service role for analysis
- Check Supabase project permissions
- Review MCP configuration

## 📝 Customization

### Modifying Prompts

You can customize prompts by:

1. **Changing SQL queries** - Add/remove analysis queries
2. **Adjusting thresholds** - Change what's considered critical
3. **Adding checks** - Include project-specific validations
4. **Filtering scope** - Limit to specific schemas or tables

### Creating Custom Analyzers

To create your own analyzer:

1. Copy an existing prompt as template
2. Define your analysis objectives
3. Write SQL queries for your checks
4. Design report structure
5. Test with small datasets first

## 🤝 Contributing

Found an issue or have suggestions?

1. Document the problem/enhancement
2. Provide example use case
3. Submit feedback to project maintainers

## 📚 Additional Resources

- [ENORAE Stack Patterns](../stack-patterns/)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance-tips.html)
- [Database Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)

## ⚖️ License

These prompts are part of the ENORAE project and follow the project's license.

---

## 🎯 Quick Command Reference

```bash
# Run complete analysis
"Use the master coordinator to analyze my database"

# Run specific analyzer
"Use the [analyzer name] to analyze my database"

# Examples:
"Use the security analyzer to check RLS policies"
"Use the performance analyzer to find slow queries"
"Use the storage analyzer to check database size"

# Run multiple analyzers
"Use schema structure and security analyzers to audit my database"
```

---

**Last Updated:** 2025-10-21
**Version:** 1.0.0
**Total Analyzers:** 8 (1 master + 7 specialized)
**Maintained by:** ENORAE Development Team
