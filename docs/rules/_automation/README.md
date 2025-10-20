# Rules Automation Scripts

Automated helpers that surface potential rule violations across every domain.  
Most checks currently require manual review; critical rules flip to automated detection
as commands become available.

## Quick Start

```bash
# Check all rules
./detect-all.sh

# Check a single domain
./detect-ui-violations.sh
./detect-db-violations.sh
./detect-arch-violations.sh
# ...see full list below
```

## Available Scripts

All scripts run from the repository root. They share the same exit semantics:

- `0`: No violations detected (or only manual reviews required)
- `1`: One or more automated checks failed

| Script | Description | Notes |
| ------ | ----------- | ----- |
| `detect-all.sh` | Runs every domain checker sequentially | Fails fast on first automation error |
| `detect-a11y-violations.sh` | Accessibility rules (A11Y) | Manual review only |
| `detect-arch-violations.sh` | Architecture rules (ARCH) | Manual review only |
| `detect-db-violations.sh` | Database rules (DB) | Manual review only |
| `detect-next-violations.sh` | Next.js rules (NEXT) | Manual review only |
| `detect-perf-violations.sh` | Performance rules (PERF) | Manual review only |
| `detect-react-violations.sh` | React rules (REACT) | Manual review only |
| `detect-sec-violations.sh` | Security rules (SEC) | Manual review only |
| `detect-ts-violations.sh` | TypeScript rules (TS) | Manual review only |
| `detect-ui-violations.sh` | User Interface rules (UI) | Manual review only |

Automation scripts intentionally err on the side of caution—any time we lack a
high-confidence command (e.g., `rg` search) the output highlights the rule and
asks for manual inspection.

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/rules-check.yml
name: Rules Validation
on: [push, pull_request]
jobs:
  check-rules:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check Rules
        run: ./docs/rules/_automation/detect-all.sh
```

### Pre-Commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash
./docs/rules/_automation/detect-all.sh || {
    echo "❌ Rules violations detected. Commit aborted."
    exit 1
}
```

## Adding New Detection Scripts

1. Create new script in this directory
2. Make it executable: `chmod +x script-name.sh`
3. Add to `detect-all.sh`
4. Update this README

## Metadata

All detection commands are defined in `_meta/rules.json` for programmatic access.

---

**Last Updated:** 2025-10-19
