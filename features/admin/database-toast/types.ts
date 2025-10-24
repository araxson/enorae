export interface ToastUsageRecord {
  id: string
  table_name: string
  toast_bytes: number
  table_bytes: number
  toast_percentage: number
  suggested_compression: string | null
}

export interface ToastUsageSnapshot {
  tables: ToastUsageRecord[]
  totalCount: number
  highToastCount: number
  totalToastBytes: number
}
