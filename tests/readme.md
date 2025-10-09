# Tests

This directory contains the automated checks for the Enorae project. The initial
suite focuses on business-service utilities (slug generation and related helpers)
and is intended to be expanded with additional feature coverage over time.

## Structure

```
tests/
├── business/
│   ├── inventory/          # Business inventory feature tests
│   │   └── products.mutations.test.ts
│   └── services/           # Business portal service unit tests
│       ├── calculations.test.ts
│       ├── create-service.mutation.test.ts
│       └── update-service.mutation.test.ts
├── services/               # Shared service-layer tests (legacy location)
│   └── generate-unique-service-slug.test.ts
├── utils/                  # Shared testing utilities and stubs
│   ├── create-session-stub.ts
│   ├── create-supabase-client-stub.ts
│   └── create-supabase-stub.ts
└── readme.md               # This file
```

## Running the Tests

The project now includes a dedicated npm script that uses the fast `tsx` runner
paired with Node's native test framework:

```bash
npm run test
```

> Behind the scenes this executes `tsx --test tests`, so any additional
> TypeScript test files placed under the `tests/` directory will be discovered
> automatically.

## Writing New Tests

- Prefer small, deterministic unit tests that isolate feature logic.
- Reuse utilities from `tests/utils/` to avoid duplicating common stubs.
- Follow the existing folder structure (`tests/<portal>/<feature>/...`) to keep
  related tests grouped together.
- When a regression is found, add a failing test first, fix the code, and keep
  the test to prevent future breakage.
