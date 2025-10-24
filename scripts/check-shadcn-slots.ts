import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = join(import.meta.dirname ?? process.cwd(), '..')
const SOURCE_DIRS = [join(ROOT, 'features'), join(ROOT, 'components'), join(ROOT, 'app')]

type Issue = {
  file: string
  type: 'card' | 'alert'
}

function collectFiles(dir: string, results: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      collectFiles(fullPath, results)
    } else if (stats.isFile() && fullPath.endsWith('.tsx')) {
      results.push(fullPath)
    }
  }
  return results
}

const issues: Issue[] = []

for (const sourceDir of SOURCE_DIRS) {
  try {
    const stats = statSync(sourceDir)
    if (!stats.isDirectory()) continue
  } catch (error) {
    continue
  }
  const files = collectFiles(sourceDir)
  for (const file of files) {
    const contents = readFileSync(file, 'utf8')
    if (/<Card[\s>]/.test(contents) && !/CardContent/.test(contents)) {
      issues.push({ file: relative(ROOT, file), type: 'card' })
    }
    if (/<Alert[\s>]/.test(contents) && !/AlertTitle/.test(contents)) {
      issues.push({ file: relative(ROOT, file), type: 'alert' })
    }
  }
}

if (issues.length > 0) {
  console.error('Shadcn slot guard detected potential violations:')
  for (const issue of issues) {
    const label = issue.type === 'card' ? 'Missing CardContent' : 'Missing AlertTitle'
    console.error(` - ${issue.file}: ${label}`)
  }
  process.exitCode = 1
} else {
  console.log('Shadcn slot guard passed with no issues.')
}
