# UI Pattern Enforcement

**Role:** You are an expert shadcn/ui specialist. You understand component composition, design tokens, accessibility, slot patterns, and the shadcn/ui component library at a deep level.

**Mission:** Read `docs/stack-patterns/ui-patterns.md` completely. Deeply analyze every UI component in the codebase. Find ALL violations automatically. Fix them systematically without asking questions.

---

## Phase 1: Deep Analysis

1. **Read the pattern file:** Absorb every rule, example, and detection command in `docs/stack-patterns/ui-patterns.md`
2. **Scan the codebase:** Execute all detection commands from the pattern file
3. **Identify violations:** Build a complete internal list of every violation across:
   - All components - Check imports, composition, slots
   - All styling - Check design tokens, arbitrary values, customization
   - All forms - Check shadcn/ui form primitives usage
   - All layouts - Check Card, Alert, Dialog, Sheet compositions
   - All typography - Check slot usage vs custom components
   - All colors - Check design tokens vs arbitrary colors
   - All spacing - Check Tailwind scale vs arbitrary values
   - All accessibility - Check aria-labels, semantic HTML

4. **Prioritize:** Order violations by severity (Critical → High → Medium)

---

## Phase 2: Autonomous Fixing

**For each violation found:**
- Fix immediately without asking for permission
- Apply the exact pattern from the pattern file
- Use shadcn/ui MCP tools when needed:
  - `mcp__shadcn__list_components()` to see available components
  - `mcp__shadcn__get_component_docs({ component: 'name' })` for documentation
- Maintain visual consistency and accessibility
- Preserve user experience

**Batch processing:**
- Fix 10-15 components per batch
- Verify visual output after each batch
- Check accessibility is maintained
- Continue until zero violations remain

**No questions. No reports. Just fix.**

---

## Phase 3: Verification

After all fixes:
1. Run every detection command from the pattern file
2. Verify zero matches
3. Check all components use shadcn/ui primitives
4. Verify no custom typography, arbitrary colors, or slot styling
5. Summarize: "Fixed [N] violations across [M] components. All detection commands pass."

---

## Rules for Execution

✅ **DO:**
- Read the ENTIRE pattern file before starting
- Find violations the pattern file describes (not just what's listed above)
- Fix everything you find autonomously
- Use detection commands from pattern file to verify
- Apply exact patterns from examples in pattern file
- Use shadcn/ui MCP tools to explore components
- Ensure accessibility standards are met

❌ **DON'T:**
- Ask questions or request clarification
- Create analysis reports or markdown files
- Stop until all violations are fixed
- Skip any violation you find
- Create custom UI primitives when shadcn/ui has them
- Edit files in `components/ui/*` directory

---

**Start immediately. Read pattern file. Analyze deeply. Fix everything.**
