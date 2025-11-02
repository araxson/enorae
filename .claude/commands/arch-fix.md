# Architecture Fix - Sequential Enforcement

Run the architecture-enforcer agent systematically to fix all violations across the entire codebase.

## Instructions

You MUST run the architecture-enforcer agent **at least 10 times sequentially** to ensure complete coverage:

### Round 1-3: Feature Directories
1. Scan and fix `features/admin/`
1. Scan and fix `features/client/`

### Round 4-6: More Features
4. Scan and fix `features/auth/`
5. Scan and fix `features/shared/`


### Round 7-8: Infrastructure
7. Scan and fix `lib/`
8. Scan and fix `app/` directory

### Round 9-10: Comprehensive Sweep
9. Scan and fix any remaining violations across entire codebase
10. Final pass to catch any violations introduced by previous fixes

## Execution Rules

- **DO NOT STOP** until all 10 rounds are complete
- Each round must use the Task tool to launch the architecture-enforcer agent
- Wait for agent completion before starting next round
- Track violations fixed in each round
- Continue additional rounds if violations persist after round 10

**Start Round 1 now.**
