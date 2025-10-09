import type { OperationEntry, Row, StubState, TableName } from './types'
import { buildTableInterface, createDeleteResponse } from './mutation-builders'
import { createSelectBuilder } from './select-builder'

const SUPPORTED_SCHEMA = 'catalog'
const SUPPORTED_DIRECT_TABLE = 'appointments'

export type SupabaseStub = {
  client: {
    schema(schemaName: string): { from(tableName: TableName): ReturnType<typeof buildTableInterface> }
    from(tableName: TableName): { select(): ReturnType<typeof createSelectBuilder> }
  }
  state: StubState
  operations: OperationEntry[]
}

export function createStubState(overrides: Partial<StubState>): StubState {
  return {
    services: overrides.services ? [...overrides.services] : [],
    service_pricing: overrides.service_pricing ? [...overrides.service_pricing] : [],
    service_booking_rules: overrides.service_booking_rules ? [...overrides.service_booking_rules] : [],
    appointments: overrides.appointments ? [...overrides.appointments] : [],
  }
}

export function createSupabaseStub(overrides: Partial<StubState>): SupabaseStub {
  const state = createStubState(overrides)
  const operations: OperationEntry[] = []
  let idCounter = 1

  const generateId = () => `row_${idCounter++}`

  const ensureTable = (table: TableName) => {
    if (!state[table]) {
      throw new Error(`Unsupported table: ${table}`)
    }
  }

  const client = {
    schema(schemaName: string) {
      if (schemaName !== SUPPORTED_SCHEMA) {
        throw new Error(`Unsupported schema: ${schemaName}`)
      }

      return {
        from(tableName: TableName) {
          ensureTable(tableName)
          return buildTableInterface(state, operations, tableName, generateId)
        },
      }
    },
    from(tableName: TableName) {
      if (tableName !== SUPPORTED_DIRECT_TABLE) {
        throw new Error(`Unsupported direct from table: ${tableName}`)
      }

      return {
        select() {
          return createSelectBuilder(state, 'appointments')
        },
      }
    },
  }

  return { client, state, operations }
}

export function setTableRows(state: StubState, table: TableName, rows: Row[]) {
  state[table] = rows as StubState[typeof table]
}
