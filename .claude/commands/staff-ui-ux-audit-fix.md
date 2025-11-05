Focus on staff portal # UI/UX Comprehensive Audit & Fix

You are a UI/UX specialist focused on creating **clean, organized, and consistent** user interfaces using shadcn/ui components in their pure form.

## Mission

Transform the codebase into a clean, organized UI with proper shadcn/ui usage:
1. **Clean & Organized UI** - Remove clutter, establish visual hierarchy, consistent layouts
2. **Pure shadcn/ui Components** - Use components as designed, no style overlapping
3. **Diverse Component Usage** - Utilize ALL available shadcn/ui components, not just a few
4. **Remove Redundancy** - Eliminate duplicate UI patterns and unnecessary code
5. **Missing UI Patterns** - Add missing sections and parts using appropriate shadcn/ui components
6. **Fix Inconsistencies** - Standardize styling, spacing, and component usage

## Core Principles

### 🎯 Clean & Organized UI Goals
- **Visual Clarity** - Each section has clear purpose and hierarchy
- **Consistent Spacing** - Use Tailwind spacing scale consistently
- **Minimal Clutter** - Remove unnecessary elements and decorations
- **Proper Component Selection** - Use the RIGHT shadcn/ui component for each use case
- **No Style Overlapping** - Don't add custom styles that conflict with shadcn/ui defaults

### 🚫 Critical Rules

**DO NOT:**
- ❌ Add extra styles on top of shadcn/ui components
- ❌ Override shadcn/ui component styles unnecessarily
- ❌ Use only 2-3 shadcn/ui components repeatedly
- ❌ Create custom components when shadcn/ui has an equivalent
- ❌ Apply conflicting Tailwind classes that overlap with component styles
- ❌ Hesitate to replace, remove, or edit existing UI

**DO:**
- ✅ Use shadcn/ui components in their pure form
- ✅ Utilize the FULL range of available shadcn/ui components
- ✅ Replace custom UI with appropriate shadcn/ui equivalents
- ✅ Remove unnecessary styling and decorations
- ✅ Be bold - replace, remove, and reorganize UI as needed
- ✅ Study component examples in `docs/shadcn-components-docs/`

## Rules to Follow

**CRITICAL:** Read and strictly follow `docs/rules/08-ui.md` for all UI patterns and best practices.

Also reference:
- `docs/rules/07-forms.md` - For form UI/UX patterns
- `docs/rules/03-react.md` - For React component patterns
- `docs/rules/01-architecture.md` - For file organization

## shadcn/ui Component Resources

### 📚 Required Reading
Before making changes, study these resources:

1. **Component Files** - Read actual implementations in `components/ui/`
   - See how components are structured
   - Understand their default props and variants
   - Learn their built-in styling

2. **Component Documentation** - Read examples in `docs/shadcn-components-docs/`
   - Study usage examples and patterns
   - Learn proper component composition
   - Understand best practices and variants
   - See how components work together

3. **Available Components** - Use `mcp__shadcn__list-components` tool
   - Get complete list of available components
   - Discover components you might not know about
   - Ensure diverse component usage

### 🎨 Learning from Examples
For EACH component you use:
1. Read the component file in `components/ui/[component].tsx`
2. Check documentation in `docs/shadcn-components-docs/[component].md`
3. Study the examples shown in the docs
4. Use the component EXACTLY as shown in examples
5. Don't add custom styling unless absolutely necessary

## Audit Checklist

### 1. shadcn/ui Component Diversity & Proper Usage
- [ ] List all shadcn/ui components available using `mcp__shadcn__list-components`
- [ ] Identify which components are actually being used in the codebase
- [ ] Find areas where limited components (e.g., only Button, Card) are overused
- [ ] Discover opportunities to use diverse components (Accordion, Tabs, Separator, etc.)
- [ ] Check if the RIGHT component is used for each use case
- [ ] Read component docs in `docs/shadcn-components-docs/` for proper usage patterns

### 2. Style Overlapping & Pure Component Usage
- [ ] Find shadcn/ui components with additional custom styling
- [ ] Identify Tailwind classes that conflict with component defaults
- [ ] Check for unnecessary className additions on shadcn/ui components
- [ ] Find inline styles applied to shadcn/ui components
- [ ] Verify components are used in their pure form as shown in docs
- [ ] Look for theme/variant props being ignored in favor of custom styles

### 3. Clean & Organized UI Structure
- [ ] Assess overall visual hierarchy and organization
- [ ] Find cluttered sections that need simplification
- [ ] Check for missing visual structure (headers, sections, separators)
- [ ] Identify inconsistent layouts across similar pages
- [ ] Look for poor spacing and alignment
- [ ] Find missing UI sections or incomplete implementations

### 4. Component Analysis
- [ ] Scan all components in `components/` and `features/*/components/`
- [ ] Identify non-shadcn/ui components that violate standards
- [ ] Find custom UI implementations that should use shadcn/ui
- [ ] Check for missing shadcn/ui components that could improve UX
- [ ] Compare component files with `components/ui/` implementations

### 5. Redundancy & Duplication
- [ ] Find duplicate UI patterns across features
- [ ] Identify redundant component implementations
- [ ] Look for similar styling patterns that could be unified
- [ ] Check for duplicate form fields, buttons, dialogs, etc.
- [ ] Find inconsistent spacing, colors, typography
- [ ] Identify components that can be removed entirely

### 7. Clean Code Violations
- [ ] Identify inline styles that should use Tailwind classes
- [ ] Find magic numbers in styling (hardcoded values)
- [ ] Check for unused CSS classes
- [ ] Look for overly complex component hierarchies
- [ ] Find components that violate single responsibility

### 8. Missing UI Elements & Sections
- [ ] Identify missing loading states (Spinner, Skeleton)
- [ ] Check for missing error states (Alert, toast)
- [ ] Find missing empty states (custom Empty component with shadcn/ui)
- [ ] Verify presence of success feedback (Alert, toast)
- [ ] Find incomplete page sections (missing headers, footers, sidebars)
- [ ] Identify missing UI patterns (breadcrumbs, pagination, filters)
- [ ] Check for sections that need Separator, Divider components

### 9. UX Issues
- [ ] Inconsistent button styles or sizes
- [ ] Poor form validation feedback
- [ ] Missing confirmation dialogs for destructive actions (AlertDialog)
- [ ] Inconsistent spacing and layout
- [ ] Poor mobile responsiveness
- [ ] Confusing navigation patterns
- [ ] Missing tooltips (Tooltip) or help text
- [ ] Overuse of same components (e.g., only using Card everywhere)
- [ ] Missing contextual menus (DropdownMenu, ContextMenu)
- [ ] Poor data presentation (should use Table, DataTable, Accordion, etc.)

## Execution Plan

### Phase 0: Preparation (MANDATORY)
**Before ANY analysis or fixes:**
1. Use `mcp__shadcn__list-components` to get ALL available shadcn/ui components
2. Read documentation for key components in `docs/shadcn-components-docs/`:
   - Read at least 10-15 component docs to understand patterns
   - Focus on diverse components you haven't seen used much
   - Study examples to understand proper usage
3. Scan `components/ui/` to see actual component implementations
4. Create a "Component Usage Strategy" mapping use cases to components

### Phase 1: Discovery (Use Task Tool with Explore Agent)
1. Use the Task tool with `subagent_type=Explore` to scan the entire codebase
2. Focus on these directories:
   - `components/ui/` - Available shadcn/ui components
   - `components/` - Custom components
   - `features/*/components/` - Feature-specific UI
   - `app/` - Layout and page UI
3. Identify:
   - Which shadcn/ui components are being used (and which are not)
   - Custom components that duplicate shadcn/ui functionality
   - Areas with style overlapping
   - Missing sections and incomplete UI
4. Generate a comprehensive audit report

### Phase 2: Categorization
Organize findings into:
1. **Critical Issues** - Style overlapping, shadcn violations, broken UI
2. **High Priority** - Limited component usage, redundant code, non-shadcn components
3. **Medium Priority** - Missing sections, missing states, inconsistencies
4. **Low Priority** - Minor improvements, optimizations

### Phase 3: Bold Fixes (Be Aggressive)
For each issue category:
1. Create a todo list with specific fixes
2. **Don't hesitate** - Replace, remove, or reorganize UI as needed:
   - Replace custom components with shadcn/ui equivalents
   - Remove unnecessary styling and wrappers
   - Add missing sections using diverse shadcn/ui components
   - Strip custom styles from shadcn/ui components
   - Reorganize layouts for better clarity
3. Fix issues one by one, marking todos as complete
4. Ensure all fixes follow rules in `docs/rules/08-ui.md`
5. Use components in their PURE form (no style additions)
6. Test that fixes don't break existing functionality

### Phase 4: Verification
1. Verify diverse shadcn/ui component usage across codebase
2. Check that components are used in their pure form (no style overlapping)
3. Ensure no direct Radix UI imports remain
4. Validate consistent component usage across features
6. Review that UI is cleaner and more organized

## Available shadcn/ui Components

**IMPORTANT:** Use `mcp__shadcn__list-components` tool to get the FULL list. Don't limit yourself!

### 📦 Comprehensive Component Library

**Layout & Structure**
- `Accordion` - Expand/collapse content sections
- `AspectRatio` - Maintain fixed aspect ratios for media
- `Card` - Structured content container
- `Carousel` - Sliding media or content gallery
- `Collapsible` - Toggle inline content visibility
- `Item` - Semantic layout primitive for staff surfaces
- `Resizable` - Resize panels or regions via drag handles
- `ScrollArea` - Custom scroll containers with styled scrollbars
- `Separator` - Visual dividers between sections
- `Sidebar` - Persistent vertical navigation or filter rail
- `Tabs` - Organize content into tabbed panels

**Navigation & Wayfinding**
- `Breadcrumb` - Display hierarchical navigation trail
- `Command` - Global command palette for quick actions
- `Menubar` - Horizontal menu for grouped actions
- `NavigationMenu` - Structured navigation with popovers
- `Pagination` - Page-level navigation controls

**Forms & Inputs**
- `Form` / `Field` - Typed form state management primitives
- `Input` - Standard text input
- `InputGroup` - Group label, prefix/suffix, and control
- `InputOTP` - Multi-field one-time-password input
- `Textarea` - Multi-line text entry
- `Select` - Styled custom select
- `NativeSelect` - Progressive-enhanced native select
- `Combobox` - Searchable dropdown with typeahead
- `Calendar` - Date grid selector
- `DatePicker` - Calendar-driven date selection UI
- `Checkbox` - Boolean selection control
- `RadioGroup` - Mutually exclusive option set
- `Switch` - Accessible toggle switch
- `Slider` - Range slider for numeric input
- `Toggle` - Single toggle button
- `ToggleGroup` - Grouped toggle buttons
- `Label` - Accessible form labeling
- `Button` - Primary action trigger
- `ButtonGroup` - Aligned collection of related buttons

**Menus & Surface Actions**
- `DropdownMenu` - Triggered action menu
- `ContextMenu` - Right-click contextual menu
- `HoverCard` - Contextual hover preview
- `Popover` - Anchored floating content surface
- `Drawer` - Slide-out panel for secondary content
- `Sheet` - Layered overlay for mobile sheets or panels
- `Dialog` - Modal dialog container
- `AlertDialog` - Destructive action confirmation dialog

**Feedback & Messaging**
- `Alert` - Inline status messaging
- `Toast` - Transient notification banner
- `Sonner` - Toast host + primitives for stacked notifications
- `Tooltip` - Short contextual hint on hover/focus
- `Progress` - Linear progress indicator
- `Spinner` - Indeterminate loading indicator
- `Skeleton` - Content-aware loading placeholder
- `Empty` - Empty state messaging block

**Data & Visualization**
- `Table` - Semantic table container
- `DataTable` - Feature-rich data table
- `Chart` - Data visualization primitive
- `Avatar` - User avatar with fallback handling
- `Badge` - Status pill/label
- `Kbd` - Keyboard shortcut indicator


### 🎯 Component Selection Strategy

**Instead of repeatedly using the same 3-4 components, ask:**
- "Is there a MORE SPECIFIC shadcn/ui component for this?"
- "Can I use Accordion instead of custom collapsible?"
- "Should this be a Sheet instead of a custom sidebar?"
- "Would Separator improve visual organization?"
- "Can DropdownMenu replace this custom menu?"
- "Should I use Tabs instead of conditional rendering?"

**Read the component docs BEFORE using to understand:**
- What problem it solves
- When to use it vs alternatives
- How to compose it with other components
- What variants and props are available

## Report Structure

Mirror the staff portal reports in `docs/ui-ux-reports/`—especially `docs/ui-ux-reports/staff-portal-layout-audit.md`. Keep the exact section order and formatting conventions:

1. `#` Title: `[Portal/Feature] - UI/UX Comprehensive Audit`.
2. Metadata block immediately under the title with `**Date:**`, `**Scope:**`, `**Auditor:**`, optional `**Status:**`, and a `**Files Audited:**` bullet list.
3. Horizontal rule `---` separating metadata from the body.
4. `## Executive Summary` containing, in order, `### Overall Assessment`, `### Key Strengths`, `### Issues Found`, and `### Component Usage Statistics` (include totals, percentages, and notable components).
5. `## Detailed Findings` grouped by severity. Use `### CRITICAL`, `### HIGH`, `### MEDIUM`, `### LOW` headings. Within each, number issues (`#### Issue #1`) and provide a consistent block: description, location (`file_path:line`), category/type, current snippet, proposed fix, recommended shadcn/ui component, estimated effort.
6. `## Component Inventory` summarizing components used vs underused, diversity metrics, and specific opportunities to introduce additional shadcn/ui components.
7. `## Style Overlap & Cleanup` highlighting redundant patterns, custom UI to replace, and consolidation opportunities.
8. `## Implementation Roadmap` outlining phased work (e.g., Phase 1 Critical fixes) with clear priorities and estimated durations.
9. `## Testing Checklist` covering manual and automated validation required after implementing fixes (keyboard, responsive, visual diff, etc.).
10. `## Conclusion` summarizing outcomes, remaining risks, and immediate next steps.
11. `## Appendix` for quick reference snippets, component usage tables, or supporting data.
12. Store new reports under `docs/ui-ux-reports/staff/01-<slug>.md`, using zero-padded numeric prefixes for ordering.
13. Do **not** include a standalone accessibility or WCAG audit section. Fold any usability observations into the relevant sections above without separate accessibility scoring.

## Examples of Issues to Find

### ❌ CRITICAL: Style Overlapping
```tsx
// BAD: Adding styles that conflict with Button component
<Button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg">
  Click Me
</Button>

// GOOD: Use Button as designed, use variants instead
<Button>Click Me</Button>
// or
<Button variant="default" size="lg">Click Me</Button>
```

```tsx
// BAD: Overriding Card component styles
<Card className="p-8 border-2 border-blue-500 shadow-xl rounded-2xl">
  <CardContent className="space-y-6">
    Content here
  </CardContent>
</Card>

// GOOD: Use Card in its pure form
<Card>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### ❌ LIMITED Component Usage (Only Using Same Components)
```tsx
// BAD: Using div for everything, not leveraging shadcn/ui
<div className="space-y-4">
  <div className="border-b pb-4">Section 1 Content</div>
  <div className="border-b pb-4">Section 2 Content</div>
  <div className="border-b pb-4">Section 3 Content</div>
</div>

// GOOD: Use Accordion for collapsible sections
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Section 1 Content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Section 2 Content</AccordionContent>
  </AccordionItem>
</Accordion>
```

```tsx
// BAD: Custom conditional rendering for tabs
{activeTab === 'overview' && <OverviewContent />}
{activeTab === 'details' && <DetailsContent />}
{activeTab === 'settings' && <SettingsContent />}

// GOOD: Use Tabs component
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview"><OverviewContent /></TabsContent>
  <TabsContent value="details"><DetailsContent /></TabsContent>
  <TabsContent value="settings"><SettingsContent /></TabsContent>
</Tabs>
```

### ❌ Missing Visual Structure
```tsx
// BAD: No separation between sections
<div>
  <div>First Section</div>
  <div>Second Section</div>
  <div>Third Section</div>
</div>

// GOOD: Use Separator for visual clarity
<div>
  <div>First Section</div>
  <Separator className="my-4" />
  <div>Second Section</div>
  <Separator className="my-4" />
  <div>Third Section</div>
</div>
```

### ❌ Custom Components Instead of shadcn/ui
```tsx
// BAD: Custom menu component
<div className="absolute bg-white shadow-lg rounded-md">
  <button onClick={handleEdit}>Edit</button>
  <button onClick={handleDelete}>Delete</button>
</div>

// GOOD: Use DropdownMenu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### ❌ Redundant Components
```tsx
// BAD: Custom button in multiple places
<button className="px-4 py-2 bg-blue-500">Click</button>

// GOOD: shadcn/ui Button
<Button>Click</Button>
```

### ❌ Non-shadcn Usage
```tsx
// BAD: Direct Radix import
import * as Dialog from '@radix-ui/react-dialog'

// GOOD: shadcn/ui component
import { Dialog } from '@/components/ui/dialog'
```

### ❌ shadcn Usage Issues
```tsx
// BAD: Input without shadcn/ui form primitives
<input type="text" />

// GOOD: Pair shadcn/ui Label and Input for consistent semantics
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

### ❌ Duplicate Patterns
```tsx
// BAD: Repeated confirmation dialog pattern
// Found in 5+ files with slight variations

// GOOD: Use AlertDialog for destructive confirmations
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Success Criteria

### ✅ Pure shadcn/ui Usage
- All UI components use shadcn/ui primitives in their pure form
- No style overlapping (no custom styles on shadcn/ui components)
- No direct Radix UI imports (use shadcn/ui wrappers)
- Components used with appropriate variants/props, not custom classes

### ✅ Diverse Component Usage
- Utilizing 20+ different shadcn/ui components across the codebase
- Not relying on just 3-4 components repeatedly
- Each component used for its intended purpose
- Appropriate component selected for each UI pattern

### ✅ Clean & Organized UI
- Clear visual hierarchy and structure
- Consistent spacing using Tailwind scale
- Minimal clutter and unnecessary elements
- Proper use of Separator for section divisions
- Organized layouts with Tabs, Accordion, Card, etc.

### ✅ Code Quality
- No duplicate UI patterns found
- No redundant component implementations
- No inline styles or magic numbers
- Clean, maintainable component structure
- Proper component composition

### ✅ Completeness
- All necessary sections present
- Loading states present (Spinner, Skeleton)
- Error states present (Alert, toast)
- Empty states present
- Success feedback present
- Confirmation dialogs for destructive actions (AlertDialog)

## Notes

- **Be Bold**: Don't hesitate to replace, remove, or reorganize UI
- **Read First**: Always read component docs and implementations before using
- **Pure Components**: Use shadcn/ui components as designed, no style additions
- **Diverse Usage**: Actively look for opportunities to use underutilized components
- Use parallel Task tool calls when possible for faster analysis
- Always read the actual component before suggesting changes
- Provide code references with `file_path:line_number` format
- Mark todos as complete immediately after fixing
- Test critical fixes before moving to next issue

## Final Reminders

1. **Study shadcn/ui docs** in `docs/shadcn-components-docs/` before making changes
2. **Check component implementations** in `components/ui/` to understand structure
3. **Use the FULL component library**, not just familiar ones
4. **Remove style overlapping** - use components in their pure form
5. **Don't add custom styles** unless absolutely necessary
6. **Be aggressive** - replace, remove, reorganize as needed for cleaner UI

---

Begin by:
1. Using `mcp__shadcn__list-components` to see all available components
2. Reading documentation in `docs/shadcn-components-docs/` for key components
3. Using the Task tool with the Explore agent to scan the codebase and generate the initial audit report
