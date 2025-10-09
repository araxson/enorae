import type { OperationEntry, Row, StubState, TableName } from './types'
import { createSelectBuilder } from './select-builder'

export function createInsertResponse(
  state: StubState,
  operations: OperationEntry[],
  table: TableName,
  generateId: () => string,
) {
  const rowFactory = (payload: Row) => {
    const row = { ...payload }
    if (!row.id) {
      row.id = generateId()
    }
    state[table].push(row)
    operations.push({ table, type: 'insert', payload: row })
    return row
  }

  return (payload: Row) => ({
    select() {
      return {
        async single<T = { id: string }>() {
          const row = rowFactory(payload)
          return { data: ({ id: row.id } as unknown as T), error: null }
        },
      }
    },
    then<TResult1 = unknown>(onfulfilled?: (value: { data: Row[]; error: null }) => TResult1 | PromiseLike<TResult1>) {
      const row = rowFactory(payload)
      const result = { data: [row], error: null as null }
      if (onfulfilled) {
        return Promise.resolve(onfulfilled(result)) as Promise<TResult1>
      }
      return Promise.resolve(result) as Promise<TResult1>
    },
  })
}

export function createUpdateResponse(state: StubState, operations: OperationEntry[], table: TableName) {
  const filters: Array<(row: Row) => boolean> = []
  let payload: Row = {}

  const response = {
    eq(column: string, value: unknown) {
      filters.push((row) => row[column] === value)
      return response
    },
    then<TResult1 = unknown>(onfulfilled?: (value: { data: Row[]; error: null }) => TResult1 | PromiseLike<TResult1>) {
      const matching = state[table].filter((row) => filters.every((filter) => filter(row)))
      for (const row of matching) {
        Object.assign(row, payload)
        operations.push({ table, type: 'update', payload: { id: row.id, ...payload } })
      }
      const result = { data: matching, error: null as null }
      if (onfulfilled) {
        return Promise.resolve(onfulfilled(result)) as Promise<TResult1>
      }
      return Promise.resolve(result) as Promise<TResult1>
    },
  }

  const update = (value: Row) => {
    payload = value
    return response
  }

  return update
}

export function createDeleteResponse(state: StubState, operations: OperationEntry[], table: TableName) {
  const filters: Array<(row: Row) => boolean> = []

  return {
    eq(column: string, value: unknown) {
      filters.push((row) => row[column] === value)
      return this
    },
    then<TResult1 = unknown>(onfulfilled?: (value: { data: Row[]; error: null }) => TResult1 | PromiseLike<TResult1>) {
      const remaining: Row[] = []
      const removed: Row[] = []

      for (const row of state[table]) {
        if (filters.every((filter) => filter(row))) {
          removed.push(row)
          operations.push({ table, type: 'delete', payload: { id: row.id } })
        } else {
          remaining.push(row)
        }
      }

      state[table] = remaining as StubState[typeof table]

      const result = { data: removed, error: null as null }
      if (onfulfilled) {
        return Promise.resolve(onfulfilled(result)) as Promise<TResult1>
      }
      return Promise.resolve(result) as Promise<TResult1>
    },
  }
}

export function buildTableInterface(
  state: StubState,
  operations: OperationEntry[],
  table: TableName,
  generateId: () => string,
) {
  return {
    insert(payload: Row) {
      return createInsertResponse(state, operations, table, generateId)(payload)
    },
    update(payload: Row) {
      return createUpdateResponse(state, operations, table)(payload)
    },
    delete() {
      return createDeleteResponse(state, operations, table)
    },
    select() {
      return createSelectBuilder(state, table)
    },
  }
}
