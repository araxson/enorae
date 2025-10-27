### Rule 0: Semantic Richness Over Repetition
- **Mandate**: Replace generic components with semantically richer primitives wherever possible
- **Avoid**: Repetitive use of any single component (especially Card)
- **Process**: Identify UI intent → Consult component catalog → Select best-matching primitive
- **Accountability**: Only use generic fallback when no better match exists, document why
- **Examples**: Stats → Chart components; Navigation → Tabs/Accordion; Actions → Alert/Dialog; Lists → Table/DataTable

### Rule 1: NO Custom Styles - shadcn Components ONLY
- Use ONLY shadcn/ui primitives from the 54+ available components
- Custom styling is FORBIDDEN
- If unsure whether a component exists, check using `mcp__shadcn__list_components()` or `mcp__shadcn__get_component_docs()`

### Rule 2: NO Unnecessary Wrappers
- **Title/Description slots** (CardTitle, AlertDescription, etc.): Plain text only, no `<span>`, no `<p>`, no wrappers
- **Content/Footer slots** (CardContent, CardFooter, etc.): Direct elements only (divs for layout, buttons directly, forms directly)
- Use semantic HTML only when structurally necessary (`<form>`, `<div>` for layout)

### Rule 3: ALWAYS Replace Ad-Hoc Markup
- Assume a shadcn primitive exists (54+ available)
- Never write custom UI first
- Check MCP if unsure: `mcp__shadcn__get_component_docs({ component: 'name' })`
- Check changelog for October 2025 updates: `mcp__shadcn__get_component_docs({ component: 'changelog' })`

### Rule 4: ALWAYS Preserve Documented Composition
- Every shadcn component has required structure
- Follow composition EXACTLY (e.g., CardHeader → CardTitle + CardDescription → CardContent)
- Never break or reorder documented composition patterns

### Rule 5: Component Slots vs Standalone HTML
- **Inside slots**: Use plain text (e.g., `<CardTitle>Text</CardTitle>`)
- **Outside slots**: Use shadcn typography patterns (e.g., `<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Text</h2>`)

### Rule 6: NEVER Edit components/ui/*.tsx
- Never modify shadcn component source files in `components/ui/`
