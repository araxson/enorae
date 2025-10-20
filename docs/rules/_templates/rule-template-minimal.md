---
rule_id: {DOMAIN}-{SEVERITY}{NUMBER}
domain: {DOMAIN}
severity: {Critical|High|Medium|Low}
priority: {P|H|M|L}
number: {001-999}
tags: [tag1, tag2]
auto_fixable: {true|false}
related_rules: [{RULE-ID}]
---

# Rule: {DOMAIN}-{SEVERITY}{NUMBER} {#domain-severity-number}

> **{🔴|🟠|🟡|🟢} {SEVERITY}** | **Auto-Fix:** {✅|❌}

## 📋 Pattern

{One-sentence description}

## ❓ Why This Matters

{Brief explanation of why this rule exists}

## 🔍 Detection

```bash
{detection command}
```

## ✅ Fix Instructions

{Quick fix description}

## 📝 Examples

### ❌ WRONG
```{language}
{code showing violation}
```

### ✅ CORRECT
```{language}
{code showing correct pattern}
```

## 🔗 References

- {Reference link or file path}

## 🔀 Related Rules

- [{RULE-ID}](#{rule-id})

---
