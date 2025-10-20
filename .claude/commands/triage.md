# Triage - Smart Issue Prioritization

Launch the orchestrator to analyze existing reports and recommend optimal fix strategy.

## Task

Invoke the @orchestrator agent with "triage" command.

## Expected Workflow

The orchestrator will:
1. Read all existing analysis reports (no re-analysis)
2. Identify blocking issues (build failures, security holes)
3. Identify quick wins (high impact, low effort)
4. Group related issues by file/pattern
5. Estimate effort vs impact
6. Recommend optimal fix order

## Output

Smart recommendations including:
- Blocking issues to fix immediately
- High impact / low effort quick wins
- Architectural issues requiring planning
- Recommended fix order with rationale

## Execute Now

@orchestrator triage
