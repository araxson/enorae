export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  hasMore: boolean
}
