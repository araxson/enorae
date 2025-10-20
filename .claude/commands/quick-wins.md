# Quick Wins - High Impact / Low Effort Fixes

Launch the orchestrator to identify and fix high-impact, low-effort issues.

## Task

Invoke the @orchestrator agent with "quick wins" command.

## Expected Workflow

The orchestrator will:
1. Read all analysis reports
2. Identify issues that are:
   - Easy to fix (automated patterns)
   - High impact (security, build, performance)
   - Low effort (5-15 minutes)
3. Group quick wins by type
4. Fix them in optimal order
5. Report results

## Common Quick Wins

- Missing 'server-only' imports (2-5 min)
- Missing revalidatePath calls (5-10 min)
- Remove typography imports; use shadcn slots (5-15 min)
- Missing auth checks (10-20 min)
- Type safety issues (10-20 min)

## Execute Now

@orchestrator quick wins
