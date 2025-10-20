# React Analysis - Violation Detection

Scan codebase for React 19 pattern violations. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/framework/react.md` completely before scanning.

**Additional Context**:
- Rules Index: `docs/rules/01-rules-index.md#react-*`
- Related Rules: NEXT-L701, PERF-L701

## Scan Targets

### Critical Priority Files
- Files with `'use client'` directive
- `features/**/components/**/*.tsx`

### High Priority Files
- `app/**/*.tsx`
- Custom hooks in `lib/hooks/`

## Violation Rules

### CRITICAL

#### Rule: REACT-P001 {#react-p001}
- **Pattern**: Server Components fetch data, Client Components add interactivity
- **Detection**: Flag client components importing `@/lib/supabase/server` or `createClient`
- **Example**:
  ```tsx
  // ❌ WRONG
  'use client'
  export function Notes() {
    useEffect(() => { fetchNotes().then(setNotes) }, [])
  }

  // ✅ CORRECT
  export async function Notes() {
    const notes = await getNotes()
    return notes.map((note) => <ExpandableNote key={note.id} note={note} />)
  }
  ```
- **Reference**: `docs/rules/framework/react.md#react-p001`

#### Rule: REACT-P002 {#react-p002}
- **Pattern**: Avoid client-side data waterfalls (nested useEffect fetches)
- **Detection**: Search for `useEffect(` followed by `fetch` inside client components
- **Reference**: `docs/rules/framework/react.md#react-p002`
- **Related**: NEXT-L701

### HIGH PRIORITY

#### Rule: REACT-H101 {#react-h101}
- **Pattern**: Place metadata tags directly in components
- **Detection**: Search for custom Head components or metadata utilities
- **Example**:
  ```tsx
  export function BlogPost({ post }) {
    return (
      <article>
        <h1>{post.title}</h1>
        <title>{post.title}</title>
        <meta name="author" content={post.author} />
      </article>
    )
  }
  ```
- **Reference**: `docs/rules/framework/react.md#react-h101`

#### Rule: REACT-H102 {#react-h102}
- **Pattern**: Use use() hook for server-started promises
- **Detection**: Check client components receiving promise props
- **Example**:
  ```tsx
  'use client'
  import { use } from 'react'
  export function Comments({ commentsPromise }) {
    const comments = use(commentsPromise)
    return comments.map(comment => <CommentCard key={comment.id} comment={comment} />)
  }
  ```
- **Reference**: `docs/rules/framework/react.md#react-h102`

### MEDIUM PRIORITY

#### Rule: REACT-M301 {#react-m301}
- **Pattern**: Use React 19 context shorthand
- **Detection**: Search for `.Provider` usage
- **Example**:
  ```tsx
  // ✅ CORRECT
  return <ThemeContext value={value}>{children}</ThemeContext>
  ```
- **Reference**: `docs/rules/framework/react.md#react-m301`

#### Rule: REACT-M302 {#react-m302}
- **Pattern**: Define hook helpers inline
- **Detection**: Helpers exported solely for hook usage
- **Reference**: `docs/rules/framework/react.md#react-m302`

### LOW PRIORITY

#### Rule: REACT-L701 {#react-l701}
- **Pattern**: Server Components import heavy libraries server-side only
- **Detection**: Check for markdown/chart libraries in client components
- **Reference**: `docs/rules/framework/react.md#react-l701`
- **Related**: PERF-L701

## Output Files

1. `docs/analyze-fixes/react/analysis-report.json`
2. `docs/analyze-fixes/react/analysis-report.md`

Use REACT domain prefix.

## Execute now following steps 1-9.
