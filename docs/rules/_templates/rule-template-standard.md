---
rule_id: {DOMAIN}-{SEVERITY}{NUMBER}
domain: {DOMAIN}
severity: {Critical|High|Medium|Low}
priority: {P|H|M|L}
number: {001-999}
tags: [tag1, tag2, tag3]
auto_fixable: {true|false}
detection_command: "{command}"
files_affected: ["{glob pattern}"]
related_rules: [{RULE-ID1}, {RULE-ID2}]
date_added: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
---

# Rule: {DOMAIN}-{SEVERITY}{NUMBER} {#domain-severity-number}

> **{🔴|🟠|🟡|🟢} {SEVERITY}** | **Domain:** {DOMAIN} | **Auto-Fix:** {✅|❌} {Automated|Manual}

## 📋 Pattern

{One-sentence description of what developers should do}

## ❓ Why This Matters

**Problem:** {What happens if this rule is violated}

**Impact:**
- ❌ {Negative consequence 1}
- ❌ {Negative consequence 2}
- ❌ {Negative consequence 3}

**Severity:** {Why this severity level is appropriate}

## 🔍 Detection

### Automated Search
```bash
# Find violations
{detection command}

# Specific patterns
{additional search patterns}
```

### Manual Inspection
- {Manual check point 1}
- {Manual check point 2}

## ✅ Fix Instructions

### Step-by-Step
1. {Step 1}
2. {Step 2}
3. {Step 3}

### Quick Fix
```{language}
// Find: {pattern}
// Replace: {replacement}
// Add import: {import statement if needed}
```

## 📝 Examples

### ❌ WRONG - Violations
```{language}
// {Description of violation}
{code example showing violation}

// Why wrong:
// - {Reason 1}
// - {Reason 2}
```

### ✅ CORRECT - Compliant Code
```{language}
// {Description of correct pattern}
{code example showing correct usage}

// Why correct:
// ✓ {Benefit 1}
// ✓ {Benefit 2}
```

### Real-World Example
```{language}
// Before (Violation in {file:line})
{actual violation from codebase}

// After (Fixed)
{actual fix applied}
```

## 🔗 References

- **Component/File:** `{path}`
- **Local Docs:** `{docs path}`
- **External:** {URL}

## 🔀 Related Rules

- [{RULE-ID1}](#{rule-id1}) - {Brief description}
- [{RULE-ID2}](#{rule-id2}) - {Brief description}

## 📊 Violation Statistics (Optional)

- **Found in codebase:** {number} violations (as of {date})
- **Most common:** {pattern} ({count})
- **Common files:** {file types/locations}

---
