# Master Database Analysis Coordinator Agent

Create an agent that orchestrates comprehensive database analysis by coordinating all specialized analyzer agents.

## Agent Objective

Execute all database analysis agents in an optimized sequence, aggregate results, and generate a master executive summary with cross-cutting insights and prioritized recommendations.

## Orchestration Strategy

### Phase 1: Structural Analysis (Parallel)
Run these agents in parallel as they don't depend on each other:
1. **Schema Structure Analyzer** (01)
2. **Security & RLS Analyzer** (02)
3. **Migration History Analyzer** (05)

### Phase 2: Performance & Data Analysis (Parallel)
After Phase 1 completes, run these in parallel:
1. **Performance & Indexes Analyzer** (03)
2. **Data Integrity Analyzer** (04)
3. **Storage & Usage Analyzer** (06)

### Phase 3: Application Layer Analysis (Sequential)
After Phase 2 completes:
1. **View Definitions Analyzer** (07)

### Phase 4: Synthesis (Sequential)
After all analyses complete:
1. Aggregate all findings
2. Cross-reference issues across reports
3. Prioritize recommendations
4. Generate master executive summary

## Execution Plan

```
START
  ↓
Phase 1 (Parallel - 3 agents)
  ├─ Schema Structure Analyzer
  ├─ Security & RLS Analyzer
  └─ Migration History Analyzer
  ↓
Phase 2 (Parallel - 3 agents)
  ├─ Performance & Indexes Analyzer
  ├─ Data Integrity Analyzer
  └─ Storage & Usage Analyzer
  ↓
Phase 3 (Sequential - 1 agent)
  └─ View Definitions Analyzer
  ↓
Phase 4 (Synthesis)
  └─ Generate Master Report
  ↓
END
```

## Master Report Structure

Create a comprehensive report at `docs/database-analysis/00-MASTER-EXECUTIVE-SUMMARY.md` with:

### 1. Overall Database Health Score
Composite score (0-100) based on:
- Schema Structure: /20 points
- Security & RLS: /20 points
- Performance: /15 points
- Data Integrity: /15 points
- Storage Efficiency: /10 points
- Migration Quality: /10 points
- View Architecture: /10 points

**Total Score: XX/100**

**Grade:**
- 90-100: Excellent
- 75-89: Good
- 60-74: Fair
- 40-59: Poor
- 0-39: Critical

### 2. Critical Issues Dashboard
Urgent issues requiring immediate attention:

**🔴 Critical (Fix Immediately)**
- Issue description
- Affected component
- Impact assessment
- Source report reference
- Recommended action

**🟠 High Priority (Fix This Week)**
- Issue description
- Affected component
- Impact assessment
- Source report reference
- Recommended action

**🟡 Medium Priority (Fix This Month)**
- Issue description
- Affected component
- Impact assessment
- Source report reference
- Recommended action

### 3. Database Overview
- Database name and version
- Total size: X GB
- Total schemas: N
- Total tables: N
- Total views: N
- Total indexes: N
- Active connections: N
- Database age: X months
- Migration count: N

### 4. Schema Health by Portal
| Schema | Tables | Size | Security | Performance | Data Quality | Overall |
|--------|--------|------|----------|-------------|--------------|---------|
| organisation | N | XGB | ✅ Good | ⚠️ Issues | ✅ Good | 75% |
| catalog | N | XGB | ⚠️ Issues | ✅ Good | ✅ Good | 70% |
| scheduling | N | XGB | ✅ Good | ⚠️ Issues | ⚠️ Issues | 65% |
| ... | ... | ... | ... | ... | ... | ... |

### 5. Cross-Cutting Insights
Issues that span multiple areas:

**Security & Performance Overlap**
- Missing indexes on foreign keys affect both security (RLS performance) and query speed
- Tables identified: [list]

**Data Integrity & Storage Overlap**
- High bloat tables also have orphaned records
- Tables identified: [list]

**Migration & Schema Overlap**
- Untracked schema changes detected
- Objects identified: [list]

### 6. Trend Analysis
Based on available historical data:

**Growth Trends**
- Database size growth: +X% per month
- Table count growth: +N per month
- Storage projection: X GB in 6 months

**Performance Trends**
- Query performance: [improving/stable/degrading]
- Index usage: [optimal/sub-optimal]
- Cache hit ratio: X% (target: >95%)

**Security Posture**
- RLS coverage: X% of tables
- Policy completeness: [improving/stable/degrading]
- Security advisories: N active

### 7. Risk Assessment Matrix

| Risk Category | Likelihood | Impact | Risk Level | Mitigation Priority |
|---------------|------------|--------|------------|-------------------|
| Data Loss | Low | Critical | Medium | High |
| Security Breach | Medium | Critical | High | Immediate |
| Performance Degradation | High | Medium | High | High |
| Storage Exhaustion | Low | High | Medium | Medium |
| Data Corruption | Low | Critical | Medium | High |

### 8. Compliance Status

**ENORAE Pattern Adherence**
- ✅ Views follow *_view naming: X%
- ✅ Reads from public views: X%
- ✅ Writes to schema tables: X%
- ⚠️ Server-only queries: X%
- ❌ Missing auth checks: N instances

**Database Best Practices**
- ✅ Primary keys on all tables: X%
- ✅ Foreign key constraints: X%
- ✅ RLS enabled on sensitive tables: X%
- ⚠️ Indexes on foreign keys: X%
- ⚠️ Vacuum/analyze current: X%

### 9. Resource Utilization

**Current State**
- Storage used: X GB / Y GB (Z%)
- Connections: N / max
- Query throughput: N queries/sec
- Average query time: X ms

**Capacity Planning**
- Estimated time to 80% capacity: X months
- Recommended upgrade timing: [now/3 months/6 months/12+ months]
- Bottleneck prediction: [storage/connections/CPU/memory]

### 10. Prioritized Action Plan

**Week 1 (Critical)**
1. [Action item] - [Expected time] - [Benefit]
2. [Action item] - [Expected time] - [Benefit]
3. [Action item] - [Expected time] - [Benefit]

**Month 1 (High Priority)**
1. [Action item] - [Expected time] - [Benefit]
2. [Action item] - [Expected time] - [Benefit]
...

**Quarter 1 (Medium Priority)**
1. [Action item] - [Expected time] - [Benefit]
2. [Action item] - [Expected time] - [Benefit]
...

**Ongoing (Maintenance)**
1. [Action item] - [Frequency] - [Benefit]
2. [Action item] - [Frequency] - [Benefit]
...

### 11. Cost-Benefit Analysis

For Supabase paid plans:

**Current Costs**
- Monthly cost: $X
- Storage: $Y
- Bandwidth: $Z
- Other: $A

**Projected Costs (if no action)**
- 3 months: $X
- 6 months: $X
- 12 months: $X

**Optimization Savings**
- Storage optimization: Save $X/month
- Performance optimization: Reduce compute $Y/month
- Archival strategy: Save $Z/month
- Total potential savings: $A/month

**ROI on Optimization**
- Investment needed: X hours @ $Y/hr = $Z
- Monthly savings: $A
- Payback period: N months
- 12-month ROI: X%

### 12. Executive Recommendations

**To Engineering Leadership:**
[High-level strategic recommendations focusing on technical debt, architecture, and long-term health]

**To Development Team:**
[Actionable tactical recommendations for immediate implementation]

**To DevOps/Infrastructure:**
[Infrastructure and operational recommendations]

### 13. Report Metadata
- Analysis date: YYYY-MM-DD
- Analysis duration: X minutes
- Reports generated: 7
- Total database queries executed: N
- Supabase project ID: xxx
- Database size at analysis: X GB
- Next recommended analysis: [date]

### 14. Individual Report Index
Quick links to detailed reports:
- [01 - Schema Structure Report](./01-schema-structure-report.md)
- [02 - Security & RLS Report](./02-security-rls-report.md)
- [03 - Performance & Indexes Report](./03-performance-indexes-report.md)
- [04 - Data Integrity Report](./04-data-integrity-report.md)
- [05 - Migration History Report](./05-migration-history-report.md)
- [06 - Storage & Usage Report](./06-storage-usage-report.md)
- [07 - View Definitions Report](./07-view-definitions-report.md)

## Implementation Notes

### Error Handling
- If any Phase 1 agent fails, continue with others and note failure
- If all Phase 1 agents fail, abort with clear error message
- Log all errors and include in master report

### Performance Considerations
- Total estimated execution time: 10-20 minutes
- Parallel execution reduces total time by ~40%
- Some queries may be slow on large databases (>10GB)

### Data Collection
Agent should track:
- Start time of each phase
- Completion time of each agent
- Number of queries executed
- Any errors or warnings
- Performance metrics

### Report Aggregation
When synthesizing the master report:
1. Read all 7 generated reports
2. Extract key metrics and findings
3. Cross-reference related issues
4. Calculate composite scores
5. Prioritize recommendations by impact
6. Generate actionable plan

## Tools to Use

- `Task` - Launch specialized analyzer agents
- `Read` - Read generated reports
- `Write` - Create master summary
- `mcp__supabase__get_project` - Get project metadata

## Success Criteria

Coordinator completes when:
- All 7 analyzer agents complete successfully (or gracefully handle failures)
- All individual reports exist in docs/database-analysis/
- Master executive summary generated
- No critical errors during execution
- Reports include timestamp and metadata

## Usage Example

```bash
# To run this coordinator, use:
# "Analyze my Supabase database comprehensively using the master coordinator"
```

## Output Files

After completion, expect these files:
```
docs/database-analysis/
├── 00-MASTER-EXECUTIVE-SUMMARY.md
├── 01-schema-structure-report.md
├── 02-security-rls-report.md
├── 03-performance-indexes-report.md
├── 04-data-integrity-report.md
├── 05-migration-history-report.md
├── 06-storage-usage-report.md
└── 07-view-definitions-report.md
```

## Follow-Up Actions

After the coordinator completes:
1. Review the master executive summary
2. Share critical issues with team
3. Schedule fixes based on priority
4. Plan for next analysis (recommended: monthly)
5. Track improvement over time
