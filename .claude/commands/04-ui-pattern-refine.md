# 04 UI Pattern Refine

**Core Principle:** The Supabase database defines the canonical data shape; UI components must present only schema-backed fields while leaving database structures untouched.

**Role:** shadcn/ui enforcer focusing on accessibility, slot fidelity, and pattern adherence across all 54+ available shadcn components.

**Action Mode:** Identify UI violations and **directly apply fixes** to code. NO documentation or report files—fix violations immediately.

**Mission:** Audit and refactor UI components to strictly follow `docs/ruls/ui.md` patterns without altering primitives. Apply fixes directly without generating reports.

---

## 🚨 CRITICAL SAFETY RULE - READ FIRST 🚨

**ABSOLUTE PROHIBITION:** You are FORBIDDEN from reading, editing, or modifying ANY files in `components/ui/`.

**Before ANY file operations:**
1. ✅ **ONLY target files matching:** `features/**/components/*.tsx`
2. ✅ **ONLY target files matching:** `app/**/components/*.tsx`
3. ❌ **NEVER touch:** `components/ui/*.tsx` (shadcn primitives are READ-ONLY)
4. ❌ **NEVER touch:** `components/ui/**/*.tsx` (all shadcn files are protected)

**If you detect a violation in a shadcn primitive:**
- ❌ DO NOT attempt to fix it
- ❌ DO NOT edit the primitive file
- ✅ Report it as "Cannot fix: violation in protected shadcn primitive"
- ✅ Move on to the next file

**Pre-flight check before starting:**
```bash
# Verify you're only targeting feature components, NOT shadcn primitives
echo "Target files:"
find features app -name "*.tsx" -path "*/components/*" | head -10
echo ""
echo "Protected files (NEVER touch these):"
find components/ui -name "*.tsx" | head -5
```

## Available Component Library (54+ Components)

**CRITICAL: Leverage the FULL variety of shadcn components. Do NOT create custom UI when a primitive exists.**

**ALWAYS check if a shadcn component exists before creating custom UI:**
```typescript
mcp__shadcn__list_components()
mcp__shadcn__get_component_docs({ component: 'name' })
```

**Use these 54+ components across 8 categories:**

1. **Layout & Content:** Card, Accordion, Tabs, Collapsible, Separator, Scroll Area, Resizable
2. **Forms & Inputs:** Form, Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Input OTP, Calendar, Date Picker, Field, Label
3. **Charts & Data Visualization:** Chart (line, bar, area, pie, radar, radial variants), Data Table, Table, Avatar
4. **Overlays:** Dialog, Drawer, Sheet, Alert Dialog, Popover, Tooltip, Hover Card, Command
5. **Navigation:** Navigation Menu, Menubar, Breadcrumb, Pagination, Sidebar
6. **Buttons & Actions:** Button, Button Group, Toggle, Toggle Group, Dropdown Menu, Context Menu
7. **Feedback:** Alert, Toast (Sonner), Progress, Skeleton, Spinner, Badge
8. **Utilities:** Carousel, KBD

**Latest Updates (October 2025):** Use shadcn MCP to check the changelog for new components and improvements:
```typescript
mcp__shadcn__get_component_docs({ component: 'changelog' })
```
**Find opportunities to use new components** - Don't assume a component doesn't exist. Check MCP first, especially for newer UI patterns.

## Strict Rules from docs/ruls/ui.md

### Rule 0: Semantic Richness Over Repetition

**Mandate:** Replace generic shadcn components with semantically richer primitives wherever possible, avoiding repetitive use of any single component such as Card.

**Process:**
1. Identify the UI intent in each section (data display, navigation, feedback, action, etc.)
2. Consult the shadcn component catalog before choosing replacements
3. Select the primitive that best matches that intent

**Accountability:** Only fall back to the original primitive when no better match exists, and document the reasoning.

**Examples:**
- Statistics display → Use **Chart** components instead of multiple Cards
- Navigation sections → Use **Tabs**, **Accordion**, or **Navigation Menu** instead of Card groups
- Action-oriented content → Use **Alert**, **Dialog**, or **Sheet** instead of Card
- Data lists → Use **Table** or **Data Table** instead of Card lists

### Rule 1: NO Custom Styles - shadcn Components ONLY
Use ONLY shadcn/ui primitives. Custom styling is FORBIDDEN.

### Rule 2: NO Unnecessary Wrappers
Don't add unnecessary wrapper elements anywhere:
- **Title/Description slots** (CardTitle, AlertDescription, etc.) → Plain text only, no wrappers
- **Content/Footer slots** (CardContent, CardFooter, etc.) → Direct elements (divs, buttons, forms), no unnecessary `<p>` wrappers
- Use semantic HTML only when structurally necessary (`<form>`, `<div>` for layout)

### Rule 3: ALWAYS Replace Ad-Hoc Markup
Assume a shadcn primitive exists (54+ available). Never write custom UI first. Check MCP if unsure.

### Rule 4: ALWAYS Preserve Documented Composition
Every shadcn component has required structure. Follow it EXACTLY (CardHeader → CardTitle + CardDescription → CardContent).

### Rule 5: Component Slots vs Standalone HTML
- **Inside slots:** Use plain text (e.g., `<CardTitle>Text</CardTitle>`)
- **Outside slots:** Use shadcn typography patterns (e.g., `<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Text</h2>`)

### Rule 6: 🚨 NEVER Edit components/ui/*.tsx 🚨
**ABSOLUTE PROHIBITION - ZERO EXCEPTIONS:**
- ❌ NO reading files in `components/ui/`
- ❌ NO editing files in `components/ui/`
- ❌ NO suggesting changes to files in `components/ui/`
- ✅ ALL changes happen in `features/**/components/` ONLY
- ✅ ALL changes happen in `app/**/components/` ONLY

**shadcn component source files are READ-ONLY and managed by the shadcn CLI.**

**Violation = Immediate failure. If you edit a `components/ui/*.tsx` file, STOP and report the error.**

## Inputs
- **Pattern rules:** `docs/ruls/ui.md` (source of truth)
- **Component docs:** shadcn MCP tools and https://ui.shadcn.com/docs/changelog
- **Target files:** Components under `features/**/components/` and shared UI compositions
- **Detection commands:** 8 automated violation detectors

## Execution Plan (Code-Only)

1. **🚨 MANDATORY PRE-FLIGHT CHECK 🚨** - Run the safety verification:
   ```bash
   # Verify you're only targeting feature components, NOT shadcn primitives
   echo "=== Target files (OK to edit) ==="
   find features app -name "*.tsx" -path "*/components/*" | wc -l
   echo ""
   echo "=== Protected files (NEVER TOUCH) ==="
   find components/ui -name "*.tsx" | wc -l
   ```
   **If you accidentally target a `components/ui/*.tsx` file, STOP IMMEDIATELY.**

2. **Read `docs/ruls/ui.md`** - Get all rules and approved patterns

3. **Run all 8 detection commands** - Find violations **ONLY in feature files**:
   - Custom sizing on component slots
   - Wrappers inside slots
   - Arbitrary colors/spacing
   - Inline styles
   - Incomplete compositions
   - Ad-hoc UI containers

   **CRITICAL:** All detection commands MUST exclude `components/ui/`:
   ```bash
   # Example: Exclude shadcn primitives from search
   rg "pattern" features/ app/ --type tsx  # ✅ CORRECT
   rg "pattern" . --type tsx                # ❌ WRONG - includes components/ui/
   ```

4. **Check component availability** - Use MCP before creating custom UI:
   ```typescript
   mcp__shadcn__list_components()
   mcp__shadcn__get_component_docs({ component: 'chart' }) // Example
   mcp__shadcn__get_component_docs({ component: 'changelog' }) // Check October 2025 updates
   ```
   **CRITICAL:** Actively look for opportunities to use October 2025 new components. Don't settle for older patterns when newer, better primitives exist.
4. **Normalize compositions and promote semantic richness** - Replace custom markup with shadcn primitives AND replace repetitive generic components with richer alternatives:

   **⚠️ SAFETY CHECK:** Before editing ANY file, verify it's NOT in `components/ui/`:
   ```bash
   # If file path contains "components/ui/", SKIP IT
   if [[ "$file" == *"components/ui/"* ]]; then
     echo "SKIPPING protected shadcn file: $file"
     continue
   fi
   ```

   **Only edit feature component files:**
   - Custom cards → Card + CardHeader + CardTitle + CardDescription + CardContent
   - Custom notices → Alert + AlertTitle + AlertDescription
   - Custom modals → Dialog/Sheet with proper composition
   - Custom charts → Chart component with appropriate variant (line, bar, area, pie, radar, radial)
   - Custom data tables → Data Table component
   - **Repetitive Cards** → Replace with semantically richer primitives (Tabs for navigation, Chart for stats, Table for lists, Alert for feedback)
   - **Look for opportunities to use October 2025 new components** - Check MCP changelog for latest primitives

5. **Remove violations** - Fix all detected issues **ONLY in feature files**:
   - Remove custom sizing from title/description slots (use plain text)
   - Remove unnecessary wrappers everywhere (no `<span>` in titles, no `<p>` wrapping buttons)
   - Use direct elements in content slots (divs for layout, buttons directly, forms directly)
   - Replace arbitrary colors with design tokens (bg-primary, text-foreground)
   - Complete incomplete compositions
6. **Validate accessibility** - Ensure proper semantics:
   - Icon-only buttons have `aria-label`
   - Form fields use shadcn Form primitives
   - Proper heading hierarchy maintained
7. **Run typecheck** - Verify no regressions after changes

## Deliverable

**Directly fixed code (NO documentation files):**
- Code updated with violations fixed
- Zero violations from detection commands
- All UI using approved shadcn primitives (54+ available)
- Proper composition structures maintained
- Design tokens only (no arbitrary colors/spacing)
- Accessibility standards met

**🚨 MANDATORY POST-COMPLETION SAFETY CHECK 🚨**
Run this verification BEFORE reporting completion:
```bash
# Verify NO shadcn components were modified
git status | grep "components/ui/" && echo "❌ FAILURE: shadcn files modified" || echo "✅ SAFE: No shadcn files touched"
```

**If ANY `components/ui/*.tsx` files appear in git status, you have FAILED the task.**

**Brief message only (no files):**
- "Fixed X violations across Y files"
- "✅ Safety check passed: Zero shadcn component files modified"
- Final detection command verification (all return 0)
- NO markdown reports, NO documentation files, NO analysis documents
