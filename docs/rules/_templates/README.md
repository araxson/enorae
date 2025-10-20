# Rule Template Usage

Use the markdown templates in this directory when authoring or editing rules so the documentation, metadata, and automation stay in sync.

- `rule-template-standard.md` — Use for critical/high rules or any rule that needs detailed background, detection workflow, and examples.
- `rule-template-minimal.md` — Use for medium/low rules or quick lint-style checks that only need a short description.

## How to Create a New Rule

1. Pick the correct template and copy it into the domain file in `docs/rules/domains/`.
2. Fill out the YAML frontmatter exactly. The `rule_id` must match the naming convention `{DOMAIN}-{SEVERITY}{NUMBER}`.
3. Replace each section placeholder. Remove any sections that are not relevant (e.g., “Real-World Example”) after you finish editing.
4. Update `_meta/rules.json` with the new metadata. Prefer using the automation script `node scripts/rebuild_rules.mjs` so the JSON stays consistent.
5. Add or update detection commands in `_automation/` if the rule can be scanned automatically.
6. Cross-link related rules with anchors so the navigation helpers in the docs stay accurate.

## Writing Tips

- Lead with the “Pattern” section. One sentence that tells developers exactly what to do.
- Always explain **why** a rule exists. Developers are more likely to follow rules when the impact is clear.
- Provide both correct and incorrect examples whenever possible. Copy real snippets from commits or PRs for authenticity.
- Keep detection copy/paste ready. If a rule needs manual review, list the manual checklist under “Manual Inspection”.
- Update references and related rules as soon as rule relationships change to avoid duplicate work later.

After you finish authoring, run:

```bash
node scripts/rebuild_rules.mjs
node scripts/generate_rule_automation.mjs
```

These commands regenerate the metadata and automation scripts so the new rule is immediately available to AI and CI tooling.
