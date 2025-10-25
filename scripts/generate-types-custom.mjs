#!/usr/bin/env node

/**
 * Custom TypeScript type generator for Supabase
 * Connects directly to the database and introspects the schema
 * Used when the Supabase API schema cache is unavailable
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SCHEMAS = ['public', 'organization', 'catalog', 'scheduling', 'identity', 'communication', 'analytics', 'engagement']

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables')
  console.error('Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: 'public' }
})

console.log('Generating TypeScript types from database schema...')
console.log(`Schemas: ${SCHEMAS.join(', ')}`)

// Query to get all tables and views for specified schemas
const getTablesQuery = (schemaName) => `
  SELECT
    table_schema,
    table_name,
    table_type
  FROM information_schema.tables
  WHERE table_schema = '${schemaName}'
    AND table_type IN ('BASE TABLE', 'VIEW')
  ORDER BY table_name
`

// Query to get columns for a table
const getColumnsQuery = (schemaName, tableName) => `
  SELECT
    column_name,
    data_type,
    is_nullable,
    column_default,
    udt_name
  FROM information_schema.columns
  WHERE table_schema = '${schemaName}'
    AND table_name = '${tableName}'
  ORDER BY ordinal_position
`

// Query to get enums for a schema
const getEnumsQuery = (schemaName) => `
  SELECT
    t.typname as enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
  FROM pg_type t
  JOIN pg_enum e ON t.oid = e.enumtypid
  JOIN pg_namespace n ON n.oid = t.typnamespace
  WHERE n.nspname = '${schemaName}'
  GROUP BY t.typname
  ORDER BY t.typname
`

// Map PostgreSQL types to TypeScript types
function mapPostgresType(pgType, udtName, schemaEnums) {
  // Check if it's an enum
  if (schemaEnums[udtName]) {
    return `Database['${schemaEnums[udtName].schema}']['Enums']['${udtName}']`
  }

  // Handle arrays
  if (pgType.startsWith('ARRAY') || pgType.startsWith('_')) {
    const baseType = pgType.replace('ARRAY', '').replace('_', '').trim()
    const tsType = mapPostgresType(baseType, udtName.replace('_', ''), schemaEnums)
    return `${tsType}[]`
  }

  const typeMap = {
    'bigint': 'number',
    'integer': 'number',
    'smallint': 'number',
    'numeric': 'number',
    'real': 'number',
    'double precision': 'number',
    'boolean': 'boolean',
    'text': 'string',
    'character varying': 'string',
    'character': 'string',
    'uuid': 'string',
    'timestamp with time zone': 'string',
    'timestamp without time zone': 'string',
    'date': 'string',
    'time': 'string',
    'interval': 'string',
    'json': 'Json',
    'jsonb': 'Json',
    'bytea': 'string',
    'inet': 'string',
    'cidr': 'string',
    'macaddr': 'string',
    'money': 'string',
    'USER-DEFINED': udtName in schemaEnums ? `Database['${schemaEnums[udtName].schema}']['Enums']['${udtName}']` : 'unknown'
  }

  return typeMap[pgType.toLowerCase()] || 'unknown'
}

async function introspectDatabase() {
  const database = {}

  for (const schema of SCHEMAS) {
    console.log(`Processing schema: ${schema}`)

    database[schema] = {
      Tables: {},
      Views: {},
      Functions: {},
      Enums: {},
      CompositeTypes: {}
    }

    // Get enums for this schema
    const { data: enumData, error: enumError } = await supabase.rpc('exec_sql', {
      query: getEnumsQuery(schema)
    }).single()

    const schemaEnums = {}
    if (enumData && !enumError) {
      try {
        const enums = typeof enumData === 'string' ? JSON.parse(enumData) : enumData
        if (Array.isArray(enums)) {
          enums.forEach(e => {
            schemaEnums[e.enum_name] = { schema, values: e.enum_values }
            database[schema].Enums[e.enum_name] = e.enum_values
          })
        }
      } catch (e) {
        console.warn(`Could not parse enums for schema ${schema}:`, e.message)
      }
    }

    // Get tables and views
    const { data: tableData, error: tableError } = await supabase.rpc('exec_sql', {
      query: getTablesQuery(schema)
    }).single()

    if (tableError) {
      console.warn(`Error fetching tables for schema ${schema}:`, tableError)
      continue
    }

    let tables = []
    try {
      tables = typeof tableData === 'string' ? JSON.parse(tableData) : tableData
    } catch (e) {
      console.warn(`Could not parse tables for schema ${schema}:`, e.message)
      continue
    }

    if (!Array.isArray(tables)) {
      console.warn(`Expected array of tables for schema ${schema}, got:`, typeof tables)
      continue
    }

    for (const table of tables) {
      const { table_name, table_type } = table
      const isView = table_type === 'VIEW'

      // Get columns for this table
      const { data: columnData, error: columnError } = await supabase.rpc('exec_sql', {
        query: getColumnsQuery(schema, table_name)
      }).single()

      if (columnError) {
        console.warn(`Error fetching columns for ${schema}.${table_name}:`, columnError)
        continue
      }

      let columns = []
      try {
        columns = typeof columnData === 'string' ? JSON.parse(columnData) : columnData
      } catch (e) {
        console.warn(`Could not parse columns for ${schema}.${table_name}:`, e.message)
        continue
      }

      if (!Array.isArray(columns)) {
        continue
      }

      const rowType = {}
      const insertType = {}
      const updateType = {}

      for (const col of columns) {
        const { column_name, data_type, is_nullable, column_default, udt_name } = col
        const tsType = mapPostgresType(data_type, udt_name, schemaEnums)
        const nullable = is_nullable === 'YES' ? ' | null' : ''

        rowType[column_name] = tsType + nullable

        // For insert, make columns with defaults optional
        const hasDefault = column_default !== null
        const isGenerated = column_default && (
          column_default.includes('nextval') ||
          column_default.includes('gen_random_uuid') ||
          column_default.includes('now()')
        )

        if (isView) {
          insertType[column_name] = 'never'
          updateType[column_name] = 'never'
        } else {
          const optional = is_nullable === 'YES' || hasDefault || isGenerated
          insertType[column_name] = { type: tsType + nullable, optional }
          updateType[column_name] = { type: tsType + nullable, optional: true }
        }
      }

      const tableDefinition = {
        Row: rowType,
        Insert: insertType,
        Update: updateType,
        Relationships: []
      }

      if (isView) {
        database[schema].Views[table_name] = tableDefinition
      } else {
        database[schema].Tables[table_name] = tableDefinition
      }
    }
  }

  return database
}

function generateTypeScript(database) {
  let output = `/**
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

  for (const [schemaName, schema] of Object.entries(database)) {
    output += `  ${schemaName}: {\n`

    // Tables
    output += `    Tables: {\n`
    if (Object.keys(schema.Tables).length === 0) {
      output += `      [_ in never]: never\n`
    } else {
      for (const [tableName, table] of Object.entries(schema.Tables)) {
        output += `      ${tableName}: {\n`

        // Row
        output += `        Row: {\n`
        for (const [colName, colType] of Object.entries(table.Row)) {
          output += `          ${colName}: ${colType}\n`
        }
        output += `        }\n`

        // Insert
        output += `        Insert: {\n`
        for (const [colName, colDef] of Object.entries(table.Insert)) {
          const optional = colDef.optional ? '?' : ''
          output += `          ${colName}${optional}: ${colDef.type}\n`
        }
        output += `        }\n`

        // Update
        output += `        Update: {\n`
        for (const [colName, colDef] of Object.entries(table.Update)) {
          output += `          ${colName}?: ${colDef.type}\n`
        }
        output += `        }\n`

        output += `        Relationships: []\n`
        output += `      }\n`
      }
    }
    output += `    }\n`

    // Views
    output += `    Views: {\n`
    if (Object.keys(schema.Views).length === 0) {
      output += `      [_ in never]: never\n`
    } else {
      for (const [viewName, view] of Object.entries(schema.Views)) {
        output += `      ${viewName}: {\n`
        output += `        Row: {\n`
        for (const [colName, colType] of Object.entries(view.Row)) {
          output += `          ${colName}: ${colType}\n`
        }
        output += `        }\n`
        output += `        Insert: never\n`
        output += `        Update: never\n`
        output += `        Relationships: []\n`
        output += `      }\n`
      }
    }
    output += `    }\n`

    // Functions
    output += `    Functions: {\n`
    output += `      [_ in never]: never\n`
    output += `    }\n`

    // Enums
    output += `    Enums: {\n`
    if (Object.keys(schema.Enums).length === 0) {
      output += `      [_ in never]: never\n`
    } else {
      for (const [enumName, enumValues] of Object.entries(schema.Enums)) {
        if (Array.isArray(enumValues)) {
          const values = enumValues.map(v => `"${v}"`).join(' | ')
          output += `      ${enumName}: ${values}\n`
        }
      }
    }
    output += `    }\n`

    // CompositeTypes
    output += `    CompositeTypes: {\n`
    output += `      [_ in never]: never\n`
    output += `    }\n`

    output += `  }\n`
  }

  output += `}\n\n`

  // Add helper types
  output += `export type Tables<
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

  return output
}

// Main execution
async function main() {
  try {
    const database = await introspectDatabase()
    const typescript = generateTypeScript(database)

    const outputPath = join(PROJECT_ROOT, 'lib', 'types', 'database.types.ts')
    writeFileSync(outputPath, typescript, 'utf-8')

    console.log(`✅ Types generated successfully: ${outputPath}`)
    console.log(`   Schemas: ${SCHEMAS.join(', ')}`)
  } catch (error) {
    console.error('Error generating types:', error)
    process.exit(1)
  }
}

main()
