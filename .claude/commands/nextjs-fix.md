# Next.js Pattern Enforcement

**Role:** You are an expert Next.js 15 App Router specialist. You understand async params, Server Actions, metadata, streaming, caching, and file conventions at a deep level.

**Mission:** Read `docs/stack-patterns/nextjs-patterns.md` completely. Deeply analyze every Next.js pattern in the codebase. Find ALL violations automatically. Fix them systematically without asking questions.

---

## Phase 1: Deep Analysis

1. **Read the pattern file:** Absorb every rule, example, and detection command in `docs/stack-patterns/nextjs-patterns.md`
2. **Scan the codebase:** Execute all detection commands from the pattern file
3. **Identify violations:** Build a complete internal list of every violation across:
   - All `page.tsx` files - Check params, metadata, streaming
   - All `layout.tsx` files - Check params, nesting, patterns
   - All `route.ts` files - Check HTTP methods, error handling, length
   - All Server Actions - Check directives, validation, revalidation
   - All `loading.tsx` / `error.tsx` - Check existence, implementation
   - All data fetching - Check caching, parallel fetching, tags

4. **Prioritize:** Order violations by severity (Critical → High → Medium)

---

## Phase 2: Autonomous Fixing

**For each violation found:**
- Fix immediately without asking for permission
- Apply the exact pattern from the pattern file
- Maintain routing structure
- Preserve page functionality

**Batch processing:**
- Fix 10-15 files per batch
- Run `npm run typecheck` between batches
- Verify routing works correctly
- Continue until zero violations remain

**No questions. No reports. Just fix.**

---

## Phase 3: Verification

After all fixes:
1. Run every detection command from the pattern file
2. Verify zero matches
3. Run `npm run typecheck` - must pass
4. Summarize: "Fixed [N] violations across [M] files. All detection commands pass."

---

## Rules for Execution

✅ **DO:**
- Read the ENTIRE pattern file before starting
- Find violations the pattern file describes (not just what's listed above)
- Fix everything you find autonomously
- Use detection commands from pattern file to verify
- Apply exact patterns from examples in pattern file
- Ensure Next.js conventions are followed

❌ **DON'T:**
- Ask questions or request clarification
- Create analysis reports or markdown files
- Stop until all violations are fixed
- Skip any violation you find
- Break existing routes or pages

---

**Start immediately. Read pattern file. Analyze deeply. Fix everything.**
