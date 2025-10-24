# Database Analysis Prompts - Quick Index

**Fast reference for all Supabase database analysis agents**

## 🎯 Start Here

### Complete Analysis
```
Use docs/database-analysis-prompts/00-master-coordinator.md
```
**Runs all 7 analyzers in optimized sequence → Generates master executive summary**

---

## 📋 Individual Analyzers

### 01. Schema Structure
**File:** `01-schema-structure-analyzer.md`
**Focus:** Tables, columns, naming, relationships, audit fields
**Time:** ~3 min
**Use when:** Schema changes, architecture review, refactoring

---

### 02. Security & RLS
**File:** `02-security-rls-analyzer.md`
**Focus:** Row Level Security policies, permissions, tenant isolation
**Time:** ~3 min
**Use when:** Security audit, before production, policy changes

---

### 03. Performance & Indexes
**File:** `03-performance-indexes-analyzer.md`
**Focus:** Index usage, missing indexes, query patterns, bloat
**Time:** ~4 min
**Use when:** Slow queries, performance issues, optimization

---

### 04. Data Integrity
**File:** `04-data-integrity-analyzer.md`
**Focus:** Constraints, orphaned records, validation, triggers
**Time:** ~4 min
**Use when:** Data quality issues, after imports, integrity errors

---

### 05. Migration History
**File:** `05-migration-history-analyzer.md`
**Focus:** Migration tracking, schema drift, version control
**Time:** ~3 min
**Use when:** After migrations, schema drift, version audits

---

### 06. Storage & Usage
**File:** `06-storage-usage-analyzer.md`
**Focus:** Disk usage, growth trends, space optimization
**Time:** ~3 min
**Use when:** Storage limits, cost review, capacity planning

---

### 07. View Definitions
**File:** `07-view-definitions-analyzer.md`
**Focus:** View complexity, naming patterns, materialization
**Time:** ~3 min
**Use when:** View issues, pattern compliance, optimization

---

## 🎨 Quick Selection Guide

| Your Need | Use These |
|-----------|-----------|
| **Everything** | 00 (Master) |
| **Security concern** | 02, 04 |
| **Slow performance** | 03, 06, 07 |
| **Data problems** | 04, 01 |
| **Storage full** | 06, 03 |
| **Schema changes** | 01, 05 |
| **Production ready?** | 00 (Master), 02 |
| **Monthly check** | 00 (Master) |

---

## ⚡ One-Line Commands

```bash
# Complete analysis (recommended)
"Use master coordinator from database-analysis-prompts"

# Quick security check
"Use security RLS analyzer from database-analysis-prompts"

# Performance audit
"Use performance indexes analyzer from database-analysis-prompts"

# Storage review
"Use storage usage analyzer from database-analysis-prompts"
```

---

## 📊 What Each Analyzer Produces

| Analyzer | Report File | Key Metrics |
|----------|-------------|-------------|
| Master | `00-MASTER-EXECUTIVE-SUMMARY.md` | Health score, priorities, action plan |
| Schema | `01-schema-structure-report.md` | Tables, columns, relationships |
| Security | `02-security-rls-report.md` | RLS coverage, vulnerabilities |
| Performance | `03-performance-indexes-report.md` | Index efficiency, query speed |
| Integrity | `04-data-integrity-report.md` | Constraints, orphaned records |
| Migration | `05-migration-history-report.md` | Version history, drift |
| Storage | `06-storage-usage-report.md` | Size, growth, projections |
| Views | `07-view-definitions-report.md` | Complexity, compliance |

---

## 🔍 Finding Specific Issues

### "My queries are slow"
→ Run: **03** (Performance), **06** (Storage), **07** (Views)

### "Security audit needed"
→ Run: **02** (Security), **04** (Integrity)

### "Running out of space"
→ Run: **06** (Storage), **03** (Performance)

### "Data inconsistencies"
→ Run: **04** (Integrity), **01** (Schema)

### "Schema doesn't match code"
→ Run: **05** (Migration), **01** (Schema), **07** (Views)

### "Not sure, just check everything"
→ Run: **00** (Master Coordinator)

---

## 📅 Recommended Schedule

| Frequency | Run | Why |
|-----------|-----|-----|
| **Weekly** | 02 (Security), 03 (Performance) | Catch issues early |
| **Monthly** | 00 (Master) | Comprehensive health check |
| **Quarterly** | 01 (Schema), 07 (Views) | Architecture review |
| **After Migration** | 05 (Migration), 04 (Integrity) | Verify changes |
| **Before Production** | 00 (Master), 02 (Security) | Readiness check |

---

## 🎓 First Time?

1. Read `README.md` for full documentation
2. Start with `00-master-coordinator.md` for complete picture
3. Review individual reports in `docs/database-analysis/`
4. Focus on critical issues first
5. Schedule monthly master analysis

---

## 📈 Health Score Guide

Master Coordinator generates overall health score:

- **90-100** 🟢 Excellent - Keep it up!
- **75-89** 🟡 Good - Minor improvements
- **60-74** 🟠 Fair - Action needed
- **40-59** 🔴 Poor - Significant issues
- **0-39** ⚫ Critical - Urgent attention required

---

## 🛠️ Troubleshooting

**Agent times out?**
→ Run individual analyzers instead of master

**Permission errors?**
→ Check Supabase MCP configuration

**Missing reports?**
→ Verify write access to docs/database-analysis/

**Queries too slow?**
→ Run during low-traffic period

---

## 📚 Learn More

- **Full Documentation:** `README.md`
- **ENORAE Patterns:** `../stack-patterns/`
- **Supabase Docs:** https://supabase.com/docs

---

**Last Updated:** 2025-10-21
**Total Prompts:** 8
**Estimated Total Time:** 20-25 minutes (all analyzers)

**Pro Tip:** Start with the master coordinator for your first analysis, then use individual analyzers for focused deep-dives.
