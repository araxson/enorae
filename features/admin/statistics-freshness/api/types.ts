export interface StatsFreshnessRecord {
  id: string
  table_name: string
  last_analyze: string
  row_estimate: number
  dead_rows: number
  maintenance_recommended: boolean
}

export interface StatsFreshnessSnapshot {
  tables: StatsFreshnessRecord[]
  totalCount: number
  staleCount: number
}
