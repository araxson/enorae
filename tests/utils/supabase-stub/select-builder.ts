import { applyFilters, createSelectFilters, registerEqFilter } from './filters'
import type { FilterFn, Row, SelectFilters, StubState, TableName } from './types'

export function createSelectBuilder(state: StubState, table: TableName) {
  const selectFilters: SelectFilters = createSelectFilters()
  const filters: FilterFn[] = selectFilters.filters

  const builder = {
    eq(column: string, value: unknown) {
      registerEqFilter(filters, column, value)
      return builder
    },
    ilike(column: string, pattern: string) {
      selectFilters.ilikeFilter = { column, pattern }
      return builder
    },
    is(column: string, value: unknown) {
      selectFilters.isFilters.push({ column, value })
      return builder
    },
    limit(value: number) {
      selectFilters.limit = value
      return builder
    },
    order() {
      return builder
    },
    async single<T = Row>() {
      const rows = applyFilters(state[table], selectFilters)
      const first = rows[0]
      if (!first) {
        return {
          data: null as unknown as T,
          error: {
            code: 'PGRST116',
            message: 'No rows found',
            details: null,
            hint: null,
          },
        }
      }
      return { data: first as T, error: null }
    },
    async maybeSingle<T = Row>() {
      const rows = applyFilters(state[table], selectFilters)
      return { data: (rows[0] as T | undefined) ?? null, error: null }
    },
    then<TResult1 = unknown>(onfulfilled?: (value: { data: Row[]; error: null }) => TResult1 | PromiseLike<TResult1>) {
      const rows = applyFilters(state[table], selectFilters)
      const result = { data: rows, error: null as null }
      if (onfulfilled) {
        return Promise.resolve(onfulfilled(result)) as Promise<TResult1>
      }
      return Promise.resolve(result) as Promise<TResult1>
    },
  }

  return builder
}
