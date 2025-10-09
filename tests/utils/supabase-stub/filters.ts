import type { FilterFn, Row, SelectFilters } from './types'

export function createSelectFilters(): SelectFilters {
  return {
    filters: [],
    ilikeFilter: null,
    isFilters: [],
    limit: undefined,
  }
}

export function applyFilters(
  rows: Row[],
  selectFilters: SelectFilters,
): Row[] {
  const { filters, ilikeFilter, isFilters, limit } = selectFilters
  let result = [...rows]

  for (const filter of filters) {
    result = result.filter(filter)
  }

  if (ilikeFilter) {
    const regex = new RegExp(
      `^${ilikeFilter.pattern.replace(/%/g, '.*').replace(/_/g, '.')}`,
      'i',
    )
    result = result.filter((row) => {
      const value = row[ilikeFilter.column]
      if (value == null) return regex.test('')
      return regex.test(typeof value === 'string' ? value : String(value))
    })
  }

  for (const { column, value } of isFilters) {
    result = result.filter((row) => (value === null ? row[column] == null : row[column] === value))
  }

  if (typeof limit === 'number') {
    result = result.slice(0, limit)
  }

  return result
}

export function registerEqFilter(filters: FilterFn[], column: string, value: unknown) {
  filters.push((row) => row[column] === value)
}
