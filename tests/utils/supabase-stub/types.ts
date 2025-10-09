type TableName = 'services' | 'service_pricing' | 'service_booking_rules' | 'appointments'

type Row = Record<string, unknown>

type FilterFn = (row: Row) => boolean

type OperationEntry = {
  table: TableName | string
  type: 'insert' | 'update' | 'delete'
  payload: Row
}

type StubState = Record<TableName, Row[]>

type SelectFilters = {
  filters: FilterFn[]
  ilikeFilter: { column: string; pattern: string } | null
  isFilters: Array<{ column: string; value: unknown }>
  limit?: number
}

export type { TableName, Row, FilterFn, OperationEntry, StubState, SelectFilters }
