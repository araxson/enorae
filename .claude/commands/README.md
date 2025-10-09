# Claude Code Commands

This directory contains reusable prompts for common development tasks.

## Available Commands

### 1. UX Improvements
**File**: `improve-ux.md`

**Usage**: Copy and paste the contents when you want to improve UX using shadcn UI components.

**What it does**:
- Replaces manual patterns with shared components (ActionButton, LoadingWrapper, EmptyState)
- Ensures proper shadcn UI component usage
- Adds tooltips, loading states, and error handling
- Enforces layout and typography consistency

**Example**:
```
@improve-ux.md

Please improve the UX for features/business/staff/index.tsx
```

---

### 2. Create New Feature
**File**: `new-feature.md`

**Usage**: Copy and paste the contents when creating a new feature following portal-based architecture.

**What it does**:
- Guides you through proper feature structure
- Ensures correct database patterns (views for queries, tables for mutations)
- Enforces ultra-thin pages (5-15 lines)
- Validates auth checks and type safety
- Ensures shared component usage

**Example**:
```
@new-feature.md

Create a new "reviews" feature for the customer portal that allows customers to view and manage their reviews.
```

## How to Use

1. Copy the content of the command file
2. Paste it into your Claude Code chat
3. Add specific context about what you want to improve
4. Claude Code will follow the command's guidelines

## Creating New Commands

To create a new command:
1. Add a new `.md` file in this directory
2. Structure it with:
   - Clear role definition
   - Specific task description
   - Examples to follow
   - Success criteria
   - Important rules
3. Update this README with the new command
