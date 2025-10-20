# React Fix - Reusable Session

Auto-fix React issues in batches. Run multiple times to complete all fixes.

## Input File

Read: `docs/analyze-fixes/react/analysis-report.json`

## Fix Patterns by Rule

### Rule: REACT-P001 {#react-p001}

**Fix**: Move data fetching to Server Component

```tsx
// ❌ WRONG
'use client'
export function Notes() {
  const [notes, setNotes] = useState([])
  useEffect(() => { fetchNotes().then(setNotes) }, [])
}

// ✅ CORRECT
// Server Component
import ExpandableNote from './components/expandable-note'
export async function Notes() {
  const notes = await getNotes()
  return notes.map((note) => <ExpandableNote key={note.id} note={note} />)
}
```

### Rule: REACT-P002 {#react-p002}

**Fix**: Fetch related data together in Server Component

```tsx
// ❌ WRONG waterfall
useEffect(() => {
  fetch(`/api/notes/${id}`).then(async (note) => {
    const author = await fetch(`/api/authors/${note.authorId}`)
  })
}, [id])

// ✅ CORRECT
const note = await getNoteWithAuthor(id)
return <NoteCard author={note.author} note={note} />
```

### Rule: REACT-H101 {#react-h101}

**Fix**: Inline metadata tags

```tsx
export function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="author" content={post.author} />
      <h1>{post.title}</h1>
    </article>
  )
}
```

### Rule: REACT-H102 {#react-h102}

**Fix**: Use use() hook with Suspense

```tsx
// Server
const commentsPromise = getComments(note.id)
return (
  <Suspense fallback={<P>Loading comments…</P>}>
    <Comments commentsPromise={commentsPromise} />
  </Suspense>
)

// Client
'use client'
import { use } from 'react'
export function Comments({ commentsPromise }) {
  const comments = use(commentsPromise)
  return comments.map((c) => <CommentCard key={c.id} comment={c} />)
}
```

### Rule: REACT-M301 {#react-m301}

**Fix**: Use context shorthand

```tsx
// ❌ WRONG
<ThemeContext.Provider value={value}>

// ✅ CORRECT
<ThemeContext value={value}>
```

### Rule: REACT-M302 {#react-m302}

**Fix**: Move helpers inside hooks

```tsx
useEffect(() => {
  const fetchPage = async () => {
    await load()
  }
  fetchPage()
}, [load])
```

### Rule: REACT-L701 {#react-l701}

**Fix**: Move parsing to Server Components

```tsx
import marked from 'marked'
import sanitizeHtml from 'sanitize-html'

export async function MarkdownPage({ slug }) {
  const content = await readMarkdown(slug)
  return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(marked(content)) }} />
}
```

## Process

1. Load report
2. Fix 10-20 pending issues in REACT-P### → REACT-L### order
3. Update status
4. Save report

**Start now.** Fix next batch of React issues.
