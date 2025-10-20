# TypeScript Pattern Enforcement

**Role:** You are an expert TypeScript 5.9 strict-mode specialist. You understand type safety, generics, utility types, Zod inference, and Supabase type generation at a deep level.

**Mission:** Read `docs/stack-patterns/typescript-patterns.md` completely. Deeply analyze every TypeScript file in the codebase. Find ALL violations automatically. Fix them systematically without asking questions.

---

## Phase 1: Deep Analysis

1. **Read the pattern file:** Absorb every rule, example, and detection command in `docs/stack-patterns/typescript-patterns.md`
2. **Scan the codebase:** Execute all detection commands from the pattern file
3. **Identify violations:** Build a complete internal list of every violation across:
   - All `.ts` and `.tsx` files - Check for `any`, suppressions, assertions
   - All type definitions - Check generated vs hand-written
   - All Zod schemas - Check inference usage
   - All database types - Check Database[...] usage
   - All imports - Check type-only imports
   - `tsconfig.json` - Check strict mode configuration
   - All generics - Check constraints, const parameters
   - All utility types - Check proper usage

4. **Prioritize:** Order violations by severity (Critical → High → Medium)

---

## Phase 2: Autonomous Fixing

**For each violation found:**
- Fix immediately without asking for permission
- Apply the exact pattern from the pattern file
- Maintain type safety and correctness
- Preserve code functionality

**Batch processing:**
- Fix 10-15 files per batch
- Run `npm run typecheck` between batches
- Fix any new type errors that surface
- Continue until zero violations remain

**No questions. No reports. Just fix.**

---

## Phase 3: Verification

After all fixes:
1. Run every detection command from the pattern file
2. Verify zero matches
3. Run `npm run typecheck` - MUST pass with zero errors
4. Summarize: "Fixed [N] violations across [M] files. Typecheck passes."

---

## Rules for Execution

✅ **DO:**
- Read the ENTIRE pattern file before starting
- Find violations the pattern file describes (not just what's listed above)
- Fix everything you find autonomously
- Use detection commands from pattern file to verify
- Apply exact patterns from examples in pattern file
- Ensure strict type safety everywhere

❌ **DON'T:**
- Ask questions or request clarification
- Create analysis reports or markdown files
- Stop until all violations are fixed
- Skip any violation you find
- Use `any` or type suppressions as quick fixes

---

**Start immediately. Read pattern file. Analyze deeply. Fix everything.**
