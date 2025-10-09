# Feature Module Pattern

Use this as a template when adding or refactoring feature modules under `features/`.

```text
features/
  [portal]/
    [feature]/
      index.tsx
      api/
        [feature].queries.ts
        [feature].mutations.ts
      components/
        [Feature]-client.tsx
        [Component].tsx
        [component-group]/
          index.ts
          [ComponentPart].tsx
      hooks/
        use-[hook].ts
      utils/
        [helper].ts
    shared/
      api/
        [shared-scope].queries.ts
        [shared-scope].mutations.ts
      components/
        [SharedComponent].tsx
      hooks/
        use-[shared-hook].ts
      utils/
        [shared-helper].ts
  shared/
    [domain]/
      index.tsx
      api/
        [domain].queries.ts
        [domain].mutations.ts
      components/
        [DomainComponent].tsx
      hooks/
        use-[domain-hook].ts
      utils/
        [domain-helper].ts
```

## File Size Guidelines

- Page entries (`index.tsx`): keep to 5–15 lines by delegating to feature components.
- Components and hooks: ≤200 lines; break out subcomponents or hooks when approaching the limit.
- Helpers in `utils/`: ≤150 lines; prefer small, focused utilities.
- Documentation files (like this one): ≤250 lines; split into additional docs if needed.
