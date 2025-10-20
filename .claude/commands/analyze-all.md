# Analyze All - Complete Codebase Analysis

Launch the orchestrator to run all 9 analyzer agents in parallel and aggregate results.

## Task

Invoke the @orchestrator agent with "analyze all" command.

## Expected Workflow

The orchestrator will:
1. Launch all 9 analyzer agents in parallel (database, security, architecture, ui, typescript, nextjs, react, performance, accessibility)
2. Wait for all to complete (~5-10 minutes)
3. Read all 9 analysis reports from docs/analyze-fixes/{domain}/
4. Aggregate results into comprehensive summary
5. Present totals by priority and domain
6. Recommend next steps (fix critical, focus on specific domain, etc.)

## Execute Now

@orchestrator analyze all
