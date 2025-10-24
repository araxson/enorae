# Quick Start Guide - Database Migrations

**For:** ENORAE Development Team
**Date:** 2025-10-21
**Read This First!**

---

## Critical Information

🚨 **ALL DATABASE CHANGES MUST FOLLOW THE NEW WORKFLOW** 🚨

The migration baseline has been established as of October 21, 2025. From this point forward, every database change must follow the documented process.

**No exceptions without CTO approval.**

---

## What Happened?

**BEFORE October 21, 2025:**
- ❌ 1,489 migrations existed only in remote database
- ❌ No local migration files
- ❌ No version control
- ❌ No rollback capability
- ❌ High risk for production deployments

**AFTER October 21, 2025:**
- ✅ Migration baseline established
- ✅ Comprehensive documentation created
- ✅ Mandatory workflow implemented
- ✅ Version control established
- ✅ Rollback requirement enforced

---

## Essential Reading

**Before your next database change, READ THESE:**

1. **`README.md`** (12K, 450 lines)
   - Overview of migration system
   - Database schema summary
   - Quick reference guide
   - **Read time:** 15 minutes

2. **`MIGRATION_WORKFLOW.md`** (24K, 955 lines)
   - MANDATORY workflow process
   - Step-by-step instructions
   - Templates for common operations
   - Emergency procedures
   - **Read time:** 30 minutes
   - **⚠️ MUST READ before making changes**

3. **`MIGRATION_HISTORY.md`** (20K, 721 lines)
   - Historical reference
   - Lessons learned
   - What went wrong in the past
   - **Read time:** 20 minutes (optional but recommended)

4. **`20251021_BASELINE_complete_schema.md`** (22K, 736 lines)
   - Current schema documentation
   - Database object inventory
   - **Read time:** 15 minutes (reference only)

---

## Quick Workflow Summary

### Creating a New Migration

**1. Create Migration File**
```bash
cd /Users/afshin/Desktop/Enorae
supabase migration new your_descriptive_name
```

**2. Write Migration SQL**
- Follow template in MIGRATION_WORKFLOW.md
- Include comments explaining WHY
- Make it idempotent (use IF EXISTS/IF NOT EXISTS)
- Add verification logic

**3. Create Rollback Migration (MANDATORY)**
```bash
# Manually create rollback file
touch supabase/migrations/YYYYMMDDHHMMSS_your_descriptive_name_DOWN.sql
```

**4. Test Locally**
```bash
supabase start          # Start local Supabase
supabase db reset       # Apply all migrations
# Test your changes
# Test rollback
supabase db reset       # Verify forward migration still works
```

**5. Submit for Review**
```bash
git checkout -b migration/your-descriptive-name
git add supabase/migrations/
git commit -m "feat(db): your description"
git push origin migration/your-descriptive-name
# Create pull request
```

**6. Deploy to Staging**
- Get peer review approval
- Deploy to staging environment
- Monitor for 24 hours
- Test rollback in staging

**7. Deploy to Production**
- Create backup FIRST
- Deploy migration
- Verify immediately
- Monitor for 24 hours

---

## Critical Rules

**DO:**
- ✅ Create rollback migration for EVERY change
- ✅ Test in local environment first
- ✅ Get peer review
- ✅ Deploy to staging before production
- ✅ Create backup before production deployment
- ✅ Use CONCURRENTLY for index creation
- ✅ Enable RLS on all new tables
- ✅ Document WHY you're making the change

**DON'T:**
- ❌ Deploy directly to production
- ❌ Skip rollback migration creation
- ❌ Skip testing in local environment
- ❌ Make multiple unrelated changes in one migration
- ❌ Drop tables without backup
- ❌ Use blocking index creation
- ❌ Forget to verify RLS policies

---

## Emergency Contacts

**Migration Issues:**
- Team Lead: [To be assigned]
- Database DBA: [To be assigned]

**Emergency Rollback:**
1. Execute rollback SQL file
2. If rollback fails, use Supabase Dashboard → Point-in-Time Recovery
3. Notify team immediately

---

## Templates Location

Find migration templates in `MIGRATION_WORKFLOW.md`:

- Add new table (with RLS)
- Add column to existing table
- Create index
- Add RLS policy
- Each includes forward AND rollback SQL

---

## Common Operations

### Check Migration Status
```bash
supabase link --project-ref nwmcpfioxerzodvbjigw
supabase db remote ls
```

### Export Current Schema
```bash
supabase db dump --schema-only > current_schema.sql
```

### Apply Migrations Locally
```bash
supabase db reset  # Wipes local DB and applies all migrations
```

### Connect to Database
```bash
# Local
psql postgresql://postgres:postgres@localhost:54322/postgres

# Remote (use Supabase Dashboard for credentials)
psql postgresql://postgres:[PASSWORD]@db.nwmcpfioxerzodvbjigw.supabase.co:5432/postgres
```

---

## Pre-Deployment Checklist

**Print this and check off before EVERY production deployment:**

- [ ] Migration tested in local Supabase
- [ ] Rollback migration created and tested
- [ ] Peer review completed
- [ ] Staging deployment successful (24+ hours)
- [ ] Application tests passing
- [ ] Production backup created
- [ ] Team notified
- [ ] On-call engineer assigned

**Missing any checkmark? DO NOT DEPLOY.**

---

## Migration Naming Convention

**Format:** `YYYYMMDDHHMMSS_descriptive_snake_case_name.sql`

**Good Examples:**
- `20251022120000_add_loyalty_points_table.sql`
- `20251022130000_create_index_appointments_salon_id.sql`
- `20251022140000_add_rls_policy_staff_services.sql`

**Bad Examples:**
- `migration.sql` (no timestamp, not descriptive)
- `fix_bug.sql` (not descriptive, no timestamp)
- `update.sql` (meaningless name)

---

## Current Database State

**As of October 21, 2025:**

- **Schemas:** 25 application schemas
- **Tables:** 29 (all with RLS enabled ✅)
- **Views:** 113 (public views for portal access)
- **Functions:** 100+ (business logic and utilities)
- **Triggers:** 50+ (automation and auditing)
- **Indexes:** 150+ (performance optimization)

**Recently Removed:**
- ⚠️ Inventory schema dropped on Oct 21, 2025
- Affected: Product management, stock tracking, supplier management

---

## Help & Support

**Questions about:**
- **Migration workflow** → Read `MIGRATION_WORKFLOW.md`
- **Current schema** → Read `20251021_BASELINE_complete_schema.md`
- **Historical context** → Read `MIGRATION_HISTORY.md`
- **Quick reference** → Read `README.md`

**Still stuck?**
- Ask in team channel
- Tag Database DBA
- Schedule migration planning session

---

## Training Session

**Recommended:**
- Schedule 1-hour team training on new workflow
- Walk through first migration together
- Practice creating migrations locally
- Review common pitfalls

**Topics to cover:**
1. Why the workflow exists (history of problems)
2. Step-by-step walkthrough
3. Using templates
4. Testing locally
5. Creating rollback migrations
6. Emergency procedures

---

## Success Metrics

**Track these going forward:**
- Migrations per week (target: <5)
- Rollback migrations created (target: 100%)
- Staging deployments before production (target: 100%)
- Production issues from migrations (target: 0)

---

## First Migration Using New Process

**When you're ready for your first migration:**

1. Read `MIGRATION_WORKFLOW.md` completely
2. Pick a simple, non-critical change
3. Follow the workflow exactly
4. Ask questions when unsure
5. Document what worked well
6. Share feedback for process improvement

**First migration is a learning experience!**

---

## Resources

**Documentation:**
- Supabase Migrations: https://supabase.com/docs/guides/database/migrations
- PostgreSQL Best Practices: https://wiki.postgresql.org/wiki/Don't_Do_This
- ENORAE Stack Patterns: `/docs/stack-patterns/supabase-patterns.md`

**Tools:**
- Supabase CLI: https://supabase.com/docs/guides/cli
- PostgreSQL Docs: https://www.postgresql.org/docs/17/
- Database Design: https://www.postgresql.org/docs/17/ddl.html

---

## Frequently Asked Questions

**Q: Can I skip the rollback migration if my change is simple?**
A: No. Rollback migrations are MANDATORY for ALL changes.

**Q: Can I deploy directly to production for urgent fixes?**
A: No. Even urgent fixes must go through staging first.

**Q: What if I need to make a breaking change?**
A: Get CTO approval, plan carefully, schedule maintenance window, notify all stakeholders.

**Q: Can I combine multiple changes in one migration?**
A: Only if they're closely related. Prefer separate migrations for separate concerns.

**Q: What if my migration fails in production?**
A: Execute rollback immediately, restore from backup if needed, post-mortem required.

---

## Remember

🚨 **The workflow exists to protect production and our users.**

Every step has a reason based on real problems we've experienced. Following the process prevents:
- Production outages
- Data loss
- Deployment failures
- Team conflicts
- Technical debt

**When in doubt, ask. Never skip steps.**

---

**Last Updated:** 2025-10-21
**Status:** Active and enforced
**Compliance:** Mandatory for all database changes

---

**NOW GO READ MIGRATION_WORKFLOW.md** 📖
