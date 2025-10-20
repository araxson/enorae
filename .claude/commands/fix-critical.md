# Fix Critical - Auto-Fix All Critical Issues

Launch the orchestrator to fix all critical (P*) priority issues across all domains.

## Task

Invoke the @orchestrator agent with "fix critical" command.

## Expected Workflow

The orchestrator will:
1. Launch @critical-fixer agent to process all P* priority issues
2. Monitor fixing progress across all domains
3. Track status: fixed, needs_manual, failed
4. Present comprehensive fix summary
5. Identify issues requiring manual intervention
6. Recommend next steps (fix high priority, verify fixes, etc.)

## Execute Now

@orchestrator fix critical
