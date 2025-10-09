import type { StubState } from './supabase-stub/types'
import type { TableName } from './supabase-stub/types'
import { createSupabaseStub } from './supabase-stub/client'
import { buildTableInterface } from './supabase-stub/mutation-builders'
import { createSelectBuilder } from './supabase-stub/select-builder'

interface StubOptions {
  state?: Partial<StubState>
}

export function createSupabaseClientStub(options: StubOptions = {}) {
  const { client, state, operations } = createSupabaseStub(options.state ?? {})

  const ensureTable = (table: TableName) => {
    if (!state[table]) {
      throw new Error(`Unsupported table: ${table}`)
    }
  }

  const withTable = (table: TableName) => {
    ensureTable(table)
    return buildTableInterface(state, operations, table, () => `${table}_${operations.length + 1}`)
  }

  const schemaInterface = {
    from(tableName: TableName) {
      return withTable(tableName)
    },
  }

  const rootClient = {
    schema(schemaName: string) {
      if (schemaName !== 'catalog') {
        throw new Error(`Unsupported schema: ${schemaName}`)
      }
      return schemaInterface
    },
    from(tableName: TableName) {
      if (tableName !== 'appointments') {
        throw new Error(`Unsupported direct from table: ${tableName}`)
      }
      return {
        select() {
          return createSelectBuilder(state, tableName)
        },
      }
    },
  }

  return { client: rootClient, state, operations }
}
