#!/usr/bin/env ts-node

/**
 * Migration Validation Script
 *
 * Validates migration files against ENORAE standards before commit.
 * Run this script to check migration compliance with best practices.
 *
 * Usage:
 *   npm run validate:migration [file-path]
 *   npm run validate:migration supabase/migrations/20251022_103045_create_table_salons.sql
 *
 * Or validate all new migrations:
 *   npm run validate:migrations:all
 */

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)

// ============================================================================
// Types
// ============================================================================

interface ValidationResult {
  file: string
  passed: boolean
  score: number
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  recommendations: ValidationIssue[]
  summary: string
}

interface ValidationIssue {
  code: string
  severity: 'error' | 'warning' | 'info'
  message: string
  line?: number
  suggestion?: string
}

// ============================================================================
// Configuration
// ============================================================================

const NAMING_PATTERN = /^\d{8}_\d{6}_[a-z_]+\.sql$/
const TIMESTAMP_ONLY_PATTERN = /^\d{8}_\d{6}\.sql$/
const DATE_TIME_PATTERN = /^\d{8}_\d{6}\.sql$/

const REQUIRED_SECTIONS = [
  'Purpose:',
  'Dependencies:',
  'Rollback',
]

const DANGEROUS_PATTERNS = [
  { pattern: /DROP TABLE(?! IF EXISTS)/i, message: 'DROP TABLE without IF EXISTS' },
  { pattern: /DROP COLUMN(?! IF EXISTS)/i, message: 'DROP COLUMN without IF EXISTS' },
  { pattern: /DROP INDEX(?! IF EXISTS)/i, message: 'DROP INDEX without IF EXISTS' },
  { pattern: /ALTER TABLE .+ DROP/i, message: 'ALTER TABLE DROP - verify intentional' },
  { pattern: /TRUNCATE/i, message: 'TRUNCATE - permanent data loss' },
  { pattern: /DELETE FROM .+ WHERE/i, message: 'DELETE with WHERE - verify conditions' },
]

const IDEMPOTENCY_CHECKS = [
  { pattern: /CREATE TABLE(?! IF NOT EXISTS)/i, message: 'CREATE TABLE without IF NOT EXISTS' },
  { pattern: /CREATE INDEX(?! IF NOT EXISTS|CONCURRENTLY)/i, message: 'CREATE INDEX without IF NOT EXISTS' },
  { pattern: /ALTER TABLE .+ ADD COLUMN(?! IF NOT EXISTS)/i, message: 'ADD COLUMN without IF NOT EXISTS' },
]

const BEST_PRACTICES = [
  { pattern: /CREATE INDEX(?!.*CONCURRENTLY)/i, message: 'CREATE INDEX without CONCURRENTLY (may lock table)' },
  { pattern: /CREATE TABLE(?!.*ROW LEVEL SECURITY)/i, message: 'New table without RLS consideration' },
  { pattern: /REFERENCES [^\)]+\)(?!.*ON DELETE)/i, message: 'Foreign key without ON DELETE clause' },
  { pattern: /CREATE TABLE(?!.*COMMENT ON)/i, message: 'Table without COMMENT ON statement' },
]

// ============================================================================
// Main Validation Function
// ============================================================================

async function validateMigration(filePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    file: filePath,
    passed: true,
    score: 100,
    errors: [],
    warnings: [],
    recommendations: [],
    summary: '',
  }

  try {
    // Read file
    const content = await readFile(filePath, 'utf-8')
    const lines = content.split('\n')
    const fileName = path.basename(filePath)

    // Validate naming convention
    validateNaming(fileName, result)

    // Validate documentation
    validateDocumentation(content, result)

    // Check for dangerous patterns
    checkDangerousPatterns(content, lines, result)

    // Check idempotency
    checkIdempotency(content, lines, result)

    // Check best practices
    checkBestPractices(content, lines, result)

    // Calculate final score
    calculateScore(result)

    // Generate summary
    generateSummary(result)

    // Determine pass/fail
    result.passed = result.errors.length === 0

  } catch (error) {
    result.passed = false
    result.errors.push({
      code: 'FILE_ERROR',
      severity: 'error',
      message: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    })
  }

  return result
}

// ============================================================================
// Validation Checks
// ============================================================================

function validateNaming(fileName: string, result: ValidationResult): void {
  // Check if filename matches expected pattern
  if (!NAMING_PATTERN.test(fileName)) {
    result.errors.push({
      code: 'INVALID_NAMING',
      severity: 'error',
      message: `Migration filename does not follow convention: YYYYMMDD_HHMMSS_action_object_context.sql`,
      suggestion: 'Use descriptive naming like: 20251022_103045_create_table_salons.sql',
    })
    result.score -= 20
  }

  // Check if it's timestamp-only (old pattern)
  if (TIMESTAMP_ONLY_PATTERN.test(fileName)) {
    result.warnings.push({
      code: 'TIMESTAMP_ONLY',
      severity: 'warning',
      message: 'Migration uses timestamp-only naming (missing description)',
      suggestion: 'Add descriptive suffix: action_object_context',
    })
    result.score -= 10
  }

  // Check filename components
  const parts = fileName.replace('.sql', '').split('_')
  if (parts.length < 3) {
    result.warnings.push({
      code: 'MISSING_DESCRIPTION',
      severity: 'warning',
      message: 'Migration filename lacks detailed description',
      suggestion: 'Include action (create/add/drop), object type (table/index/column), and context',
    })
    result.score -= 5
  }

  // Check for generic names
  const genericNames = ['migration', 'update', 'fix', 'temp', 'new']
  if (genericNames.some(name => fileName.toLowerCase().includes(name))) {
    result.warnings.push({
      code: 'GENERIC_NAME',
      severity: 'warning',
      message: 'Migration name is too generic',
      suggestion: 'Be specific about what is being changed',
    })
    result.score -= 5
  }
}

function validateDocumentation(content: string, result: ValidationResult): void {
  // Check for header comment block
  if (!content.includes('/**') && !content.includes('/*')) {
    result.errors.push({
      code: 'MISSING_HEADER',
      severity: 'error',
      message: 'Migration missing header documentation',
      suggestion: 'Add header with Purpose, Dependencies, and Rollback instructions',
    })
    result.score -= 15
  }

  // Check for required sections
  REQUIRED_SECTIONS.forEach(section => {
    if (!content.includes(section)) {
      result.warnings.push({
        code: 'MISSING_SECTION',
        severity: 'warning',
        message: `Migration header missing "${section}" section`,
        suggestion: `Add ${section} section to migration header`,
      })
      result.score -= 5
    }
  })

  // Check for COMMENT ON statements
  if (content.includes('CREATE TABLE') && !content.includes('COMMENT ON')) {
    result.recommendations.push({
      code: 'MISSING_COMMENTS',
      severity: 'info',
      message: 'Consider adding COMMENT ON statements for tables/columns',
      suggestion: 'Add descriptive comments to document database schema',
    })
    result.score -= 3
  }

  // Check for risk assessment
  if (!content.includes('Risk Level:') && !content.includes('Risk Assessment:')) {
    result.warnings.push({
      code: 'MISSING_RISK_ASSESSMENT',
      severity: 'warning',
      message: 'Migration missing risk assessment',
      suggestion: 'Add risk level (Low/Medium/High/Critical) to header',
    })
    result.score -= 5
  }
}

function checkDangerousPatterns(content: string, lines: string[], result: ValidationResult): void {
  DANGEROUS_PATTERNS.forEach(({ pattern, message }) => {
    const matches = content.match(new RegExp(pattern, 'gi'))
    if (matches) {
      // Find line numbers
      const lineNumbers: number[] = []
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          lineNumbers.push(index + 1)
        }
      })

      result.errors.push({
        code: 'DANGEROUS_OPERATION',
        severity: 'error',
        message: `⚠️ DANGEROUS: ${message}`,
        line: lineNumbers[0],
        suggestion: 'Add IF EXISTS clause or verify this is intentional and documented',
      })
      result.score -= 10
    }
  })

  // Check for DROP operations without rollback mention
  if (/DROP (TABLE|COLUMN|INDEX)/i.test(content) && !content.includes('Rollback')) {
    result.errors.push({
      code: 'DROP_WITHOUT_ROLLBACK',
      severity: 'error',
      message: 'DROP operation without rollback documentation',
      suggestion: 'Document rollback procedure for DROP operations',
    })
    result.score -= 15
  }
}

function checkIdempotency(content: string, lines: string[], result: ValidationResult): void {
  IDEMPOTENCY_CHECKS.forEach(({ pattern, message }) => {
    const matches = content.match(new RegExp(pattern, 'gi'))
    if (matches) {
      const lineNumbers: number[] = []
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          lineNumbers.push(index + 1)
        }
      })

      result.warnings.push({
        code: 'NOT_IDEMPOTENT',
        severity: 'warning',
        message: `⚠️ ${message} - migration may fail if run twice`,
        line: lineNumbers[0],
        suggestion: 'Add IF NOT EXISTS to make migration idempotent',
      })
      result.score -= 8
    }
  })
}

function checkBestPractices(content: string, lines: string[], result: ValidationResult): void {
  BEST_PRACTICES.forEach(({ pattern, message }) => {
    if (pattern.test(content)) {
      result.recommendations.push({
        code: 'BEST_PRACTICE',
        severity: 'info',
        message: `💡 ${message}`,
        suggestion: 'Follow best practices for production safety',
      })
      result.score -= 2
    }
  })

  // Check for pre-flight validation
  if (!content.includes('DO $$') && !content.includes('BEGIN') && content.length > 500) {
    result.recommendations.push({
      code: 'MISSING_VALIDATION',
      severity: 'info',
      message: 'Consider adding pre-flight validation checks',
      suggestion: 'Add DO $$ block to verify dependencies before migration',
    })
  }

  // Check for post-migration validation
  if (!content.includes('validation') && !content.includes('verify') && content.length > 500) {
    result.recommendations.push({
      code: 'MISSING_POST_VALIDATION',
      severity: 'info',
      message: 'Consider adding post-migration validation',
      suggestion: 'Add checks to verify migration succeeded',
    })
  }

  // Check for RLS on new tables
  if (content.includes('CREATE TABLE') && !content.includes('ROW LEVEL SECURITY')) {
    result.recommendations.push({
      code: 'MISSING_RLS',
      severity: 'info',
      message: 'New table may need Row Level Security enabled',
      suggestion: 'Add ALTER TABLE ... ENABLE ROW LEVEL SECURITY if appropriate',
    })
  }

  // Check for indexes on foreign keys
  if (content.includes('REFERENCES') && !content.includes('CREATE INDEX')) {
    result.recommendations.push({
      code: 'MISSING_FK_INDEX',
      severity: 'info',
      message: 'Foreign key columns should have indexes',
      suggestion: 'Create indexes on foreign key columns for performance',
    })
  }
}

// ============================================================================
// Scoring & Summary
// ============================================================================

function calculateScore(result: ValidationResult): void {
  // Ensure score doesn't go below 0
  result.score = Math.max(0, result.score)

  // Cap score at 100
  result.score = Math.min(100, result.score)
}

function generateSummary(result: ValidationResult): void {
  const errorCount = result.errors.length
  const warningCount = result.warnings.length
  const recommendationCount = result.recommendations.length

  let grade = 'F'
  if (result.score >= 95) grade = 'A+'
  else if (result.score >= 90) grade = 'A'
  else if (result.score >= 85) grade = 'B+'
  else if (result.score >= 80) grade = 'B'
  else if (result.score >= 75) grade = 'C+'
  else if (result.score >= 70) grade = 'C'
  else if (result.score >= 60) grade = 'D'

  result.summary = `
Migration Quality Score: ${result.score}/100 (${grade})

Issues Found:
  - Errors: ${errorCount} 🔴
  - Warnings: ${warningCount} ⚠️
  - Recommendations: ${recommendationCount} 💡

Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}
${!result.passed ? '\n⚠️  Fix all errors before committing this migration.' : ''}
${result.score < 80 ? '\n💡 Consider addressing warnings and recommendations for better quality.' : ''}
  `.trim()
}

// ============================================================================
// Output Formatting
// ============================================================================

function printResult(result: ValidationResult): void {
  console.log('\n' + '='.repeat(80))
  console.log(`Migration Validation Report: ${path.basename(result.file)}`)
  console.log('='.repeat(80) + '\n')

  // Print summary
  console.log(result.summary)
  console.log('\n' + '-'.repeat(80) + '\n')

  // Print errors
  if (result.errors.length > 0) {
    console.log('🔴 ERRORS (Must Fix):')
    console.log('-'.repeat(80))
    result.errors.forEach((error, index) => {
      console.log(`\n${index + 1}. [${error.code}] ${error.message}`)
      if (error.line) console.log(`   Line: ${error.line}`)
      if (error.suggestion) console.log(`   💡 ${error.suggestion}`)
    })
    console.log('\n' + '-'.repeat(80) + '\n')
  }

  // Print warnings
  if (result.warnings.length > 0) {
    console.log('⚠️  WARNINGS (Should Fix):')
    console.log('-'.repeat(80))
    result.warnings.forEach((warning, index) => {
      console.log(`\n${index + 1}. [${warning.code}] ${warning.message}`)
      if (warning.line) console.log(`   Line: ${warning.line}`)
      if (warning.suggestion) console.log(`   💡 ${warning.suggestion}`)
    })
    console.log('\n' + '-'.repeat(80) + '\n')
  }

  // Print recommendations
  if (result.recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS (Consider):')
    console.log('-'.repeat(80))
    result.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. [${rec.code}] ${rec.message}`)
      if (rec.suggestion) console.log(`   💡 ${rec.suggestion}`)
    })
    console.log('\n' + '-'.repeat(80) + '\n')
  }

  // Print next steps
  if (!result.passed) {
    console.log('NEXT STEPS:')
    console.log('-'.repeat(80))
    console.log('1. Fix all errors listed above')
    console.log('2. Re-run validation: npm run validate:migration <file>')
    console.log('3. Once validation passes, commit the migration')
    console.log('4. Create corresponding rollback script in rollback/ directory')
    console.log('\n' + '='.repeat(80) + '\n')
  } else {
    console.log('✅ Migration passed validation!')
    console.log('-'.repeat(80))
    console.log('Next steps:')
    console.log('1. Create rollback script: supabase/migrations/rollback/<filename>_rollback.sql')
    console.log('2. Test migration in local environment: supabase migration up')
    console.log('3. Test idempotency: run migration twice')
    console.log('4. Commit migration and rollback script together')
    console.log('\n' + '='.repeat(80) + '\n')
  }
}

// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: npm run validate:migration <file-path>')
    console.error('Example: npm run validate:migration supabase/migrations/20251022_103045_create_table_salons.sql')
    process.exit(1)
  }

  const filePath = args[0]

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`)
    process.exit(1)
  }

  console.log('Validating migration...')
  const result = await validateMigration(filePath)

  printResult(result)

  // Exit with appropriate code
  process.exit(result.passed ? 0 : 1)
}

// ============================================================================
// Batch Validation (for CI/CD)
// ============================================================================

export async function validateAllMigrations(migrationDir: string): Promise<ValidationResult[]> {
  const files = await readdir(migrationDir)
  const sqlFiles = files.filter(f => f.endsWith('.sql') && !f.includes('TEMPLATE'))

  const results: ValidationResult[] = []

  for (const file of sqlFiles) {
    const filePath = path.join(migrationDir, file)
    const result = await validateMigration(filePath)
    results.push(result)
  }

  return results
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Validation failed:', error)
    process.exit(1)
  })
}

export { validateMigration }
export type { ValidationResult, ValidationIssue }
