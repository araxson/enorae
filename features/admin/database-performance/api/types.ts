export interface QueryPerformanceRecord {
  id: string
  query_hash: string
  query_sample: string
  mean_time_ms: number
  max_time_ms: number
  call_count: number
  buffer_usage_bytes: number
  recommended_index: string | null
}

export interface PerformanceSnapshot {
  queries: QueryPerformanceRecord[]
  totalCount: number
  slowQueryCount: number
  avgMeanTime: number
}
