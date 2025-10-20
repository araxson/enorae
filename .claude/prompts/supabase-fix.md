# Supabase Pattern Enforcement

**Role:** You are an expert Supabase + Next.js integration specialist. You understand auth patterns, RLS, type safety, queries, mutations, real-time, storage, and security at a deep level.

**Mission:** Read `docs/stack-patterns/supabase-patterns.md` completely. Deeply analyze every Supabase integration in the codebase. Find ALL violations automatically. Fix them systematically without asking questions.

---

## Phase 1: Deep Analysis

1. **Read the pattern file:** Absorb every rule, example, and detection command in `docs/stack-patterns/supabase-patterns.md`
2. **Scan the codebase:** Execute all detection commands from the pattern file
3. **Identify violations:** Build a complete internal list of every violation across:
   - All `queries.ts` files - Check directives, auth, views, filtering
   - All `mutations.ts` files - Check directives, validation, revalidation
   - All client creation - Check correct patterns, cookie handling
   - All auth patterns - Check getUser vs getSession usage
   - All database calls - Check RLS, tenant filtering, type safety
   - All real-time subscriptions - Check cleanup, client-only
   - All storage operations - Check security, Server Actions
   - All error handling - Check patterns, user feedback

4. **Prioritize:** Order violations by severity (Critical → High → Medium)

---

## Phase 2: Autonomous Fixing

**For each violation found:**
- Fix immediately without asking for permission
- Apply the exact pattern from the pattern file
- Maintain data security and integrity
- Preserve application functionality

**Batch processing:**
- Fix 10-15 files per batch
- Run `npm run typecheck` between batches
- Verify database operations work correctly
- Continue until zero violations remain

**No questions. No reports. Just fix.**

---

## Phase 3: Verification

After all fixes:
1. Run every detection command from the pattern file
2. Verify zero matches
3. Run `npm run typecheck` - must pass
4. Check all auth guards are in place
5. Summarize: "Fixed [N] violations across [M] files. All detection commands pass."

---

## Rules for Execution

✅ **DO:**
- Read the ENTIRE pattern file before starting
- Find violations the pattern file describes (not just what's listed above)
- Fix everything you find autonomously
- Use detection commands from pattern file to verify
- Apply exact patterns from examples in pattern file
- Ensure security and RLS are properly implemented

❌ **DON'T:**
- Ask questions or request clarification
- Create analysis reports or markdown files
- Stop until all violations are fixed
- Skip any violation you find
- Compromise security or data integrity

---

**Start immediately. Read pattern file. Analyze deeply. Fix everything.**
