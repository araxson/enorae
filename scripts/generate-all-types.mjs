#!/usr/bin/env node

/**
 * Generate TypeScript types for all Supabase schemas
 * Uses Supabase client to introspect database directly
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

// Read from .env.local
const envPath = join(PROJECT_ROOT, '.env.local')
const envContent = execSync(`cat "${envPath}"`).toString()
const env = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    env[match[1].trim()] = match[2].trim()
  }
})

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

// All schemas to include
const SCHEMAS = [
  'public',
  'graphql_public',
  'organization',
  'catalog',
  'scheduling',
  'identity',
  'communication',
  'analytics',
  'engagement',
  'admin',
  'audit',
  'security',
  'monitoring',
  'billing',
  'archive',
  'utility',
  'integration',
  'compliance',
  'patterns',
  'cache'
]

console.log('🔄 Generating Supabase TypeScript types...')
console.log(`📊 Schemas (${SCHEMAS.length}): ${SCHEMAS.join(', ')}`)

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function getTableColumns(schema, tableName) {
  const query = `
    SELECT
      column_name,
      data_type,
      udt_name,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = $2
    ORDER BY ordinal_position
  `

  const { data, error } = await supabase.rpc('exec_sql', {
    query: query.replace('$1', `'${schema}'`).replace('$2', `'${tableName}'`)
  })

  if (error) throw error
  return typeof data === 'string' ? JSON.parse(data) : data
}

async function getEnums(schema) {
  const query = `
    SELECT
      t.typname as name,
      array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = '${schema}'
    GROUP BY t.typname
    ORDER BY t.typname
  `

  const { data, error } = await supabase.rpc('exec_sql', { query })
  if (error) return []
  const result = typeof data === 'string' ? JSON.parse(data) : data
  return Array.isArray(result) ? result : []
}

async function getTables(schema) {
  const query = `
    SELECT tablename as name, 'table' as type
    FROM pg_tables
    WHERE schemaname = '${schema}'
    UNION ALL
    SELECT viewname as name, 'view' as type
    FROM pg_views
    WHERE schemaname = '${schema}'
    ORDER BY name
  `

  const { data, error } = await supabase.rpc('exec_sql', { query })
  if (error) return []
  const result = typeof data === 'string' ? JSON.parse(data) : data
  return Array.isArray(result) ? result : []
}

function mapPgType(dataType, udtName, schemaEnums) {
  // Check for enum
  if (schemaEnums[udtName]) {
    return `Database['${schemaEnums[udtName].schema}']['Enums']['${udtName}']`
  }

  // Handle arrays
  if (dataType.startsWith('ARRAY') || udtName.startsWith('_')) {
    const baseUdt = udtName.replace('_', '')
    const baseType = mapPgType(dataType.replace('ARRAY', ''), baseUdt, schemaEnums)
    return `${baseType}[]`
  }

  const types = {
    bigint: 'number',
    integer: 'number',
    smallint: 'number',
    numeric: 'number',
    real: 'number',
    'double precision': 'number',
    boolean: 'boolean',
    text: 'string',
    'character varying': 'string',
    character: 'string',
    uuid: 'string',
    'timestamp with time zone': 'string',
    'timestamp without time zone': 'string',
    date: 'string',
    time: 'string',
    interval: 'string',
    json: 'Json',
    jsonb: 'Json',
    bytea: 'string',
    inet: 'string',
    money: 'string'
  }

  return types[dataType.toLowerCase()] || 'unknown'
}

async function introspectSchema(schemaName) {
  console.log(`  Processing ${schemaName}...`)

  const result = {
    Tables: {},
    Views: {},
    Functions: {},
    Enums: {},
    CompositeTypes: {}
  }

  // Get enums
  const enums = await getEnums(schemaName)
  const enumMap = {}
  enums.forEach(e => {
    enumMap[e.name] = { schema: schemaName, values: e.values }
    result.Enums[e.name] = e.values
  })

  // Get tables and views
  const tables = await getTables(schemaName)

  for (const table of tables) {
    const columns = await getTableColumns(schemaName, table.name)

    const row = {}
    const insert = {}
    const update = {}

    for (const col of columns) {
      const tsType = mapPgType(col.data_type, col.udt_name, enumMap)
      const nullable = col.is_nullable === 'YES' ? ' | null' : ''
      row[col.column_name] = tsType + nullable

      const hasDefault = col.column_default !== null
      const isGenerated = hasDefault && (
        col.column_default?.includes('nextval') ||
        col.column_default?.includes('gen_random_uuid') ||
        col.column_default?.includes('now()')
      )

      const optional = col.is_nullable === 'YES' || hasDefault || isGenerated

      if (table.type === 'view') {
        insert[col.column_name] = 'never'
        update[col.column_name] = 'never'
      } else {
        insert[col.column_name] = { type: tsType + nullable, optional }
        update[col.column_name] = { type: tsType + nullable, optional: true }
      }
    }

    const def = { Row: row, Insert: insert, Update: update, Relationships: [] }

    if (table.type === 'view') {
      result.Views[table.name] = def
    } else {
      result.Tables[table.name] = def
    }
  }

  return result
}

function generateTS(database) {
  let ts = `/**
 * Supabase Database Types
 * Generated on ${new Date().toISOString()}
 * DO NOT EDIT THIS FILE MANUALLY.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
`

  for (const [schema, data] of Object.entries(database)) {
    ts += `  ${schema}: {\n`

    // Tables
    ts += `    Tables: {\n`
    if (Object.keys(data.Tables).length === 0) {
      ts += `      [_ in never]: never\n`
    } else {
      for (const [name, def] of Object.entries(data.Tables)) {
        ts += `      ${name}: {\n`
        ts += `        Row: {\n`
        for (const [col, type] of Object.entries(def.Row)) {
          ts += `          ${col}: ${type}\n`
        }
        ts += `        }\n        Insert: {\n`
        for (const [col, info] of Object.entries(def.Insert)) {
          const opt = info.optional ? '?' : ''
          ts += `          ${col}${opt}: ${info.type}\n`
        }
        ts += `        }\n        Update: {\n`
        for (const [col, info] of Object.entries(def.Update)) {
          ts += `          ${col}?: ${info.type}\n`
        }
        ts += `        }\n        Relationships: []\n      }\n`
      }
    }
    ts += `    }\n`

    // Views
    ts += `    Views: {\n`
    if (Object.keys(data.Views).length === 0) {
      ts += `      [_ in never]: never\n`
    } else {
      for (const [name, def] of Object.entries(data.Views)) {
        ts += `      ${name}: {\n        Row: {\n`
        for (const [col, type] of Object.entries(def.Row)) {
          ts += `          ${col}: ${type}\n`
        }
        ts += `        }\n        Insert: never\n        Update: never\n        Relationships: []\n      }\n`
      }
    }
    ts += `    }\n`

    // Functions, Enums, CompositeTypes
    ts += `    Functions: {\n      [_ in never]: never\n    }\n`
    ts += `    Enums: {\n`
    if (Object.keys(data.Enums).length === 0) {
      ts += `      [_ in never]: never\n`
    } else {
      for (const [name, values] of Object.entries(data.Enums)) {
        const vals = values.map(v => `"${v}"`).join(' | ')
        ts += `      ${name}: ${vals}\n`
      }
    }
    ts += `    }\n`
    ts += `    CompositeTypes: {\n      [_ in never]: never\n    }\n  }\n`
  }

  ts += `}\n\n`
  ts += `export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
`

  return ts
}

async function main() {
  try {
    const database = {}

    for (const schema of SCHEMAS) {
      database[schema] = await introspectSchema(schema)
    }

    const typescript = generateTS(database)
    const outputPath = join(PROJECT_ROOT, 'lib', 'types', 'database.types.ts')
    writeFileSync(outputPath, typescript, 'utf-8')

    console.log(`\n✅ Successfully generated types!`)
    console.log(`📁 Output: lib/types/database.types.ts`)
    console.log(`📊 Schemas: ${SCHEMAS.length}`)

    const schemaCount = Object.keys(database).length
    let tableCount = 0
    let viewCount = 0
    Object.values(database).forEach(s => {
      tableCount += Object.keys(s.Tables).length
      viewCount += Object.keys(s.Views).length
    })

    console.log(`📋 Tables: ${tableCount}`)
    console.log(`👁️  Views: ${viewCount}`)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
