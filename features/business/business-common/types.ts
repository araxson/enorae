export type ServicePerformance = {
  name: string
  count: number
  revenue: number
}

export type StaffPerformance = {
  name: string
  title: string | null
  count: number
  revenue: number
}

export type AnalyticsOverview = {
  revenue: {
    total: number
    service: number
    product: number
    growth: number
  }
  appointments: {
    total: number
    completed: number
    cancelled: number
    noShow: number
    completionRate: number
  }
  customers: {
    total: number
    new: number
    returning: number
    retentionRate: number
  }
  staff: {
    active: number
    utilization: number
  }
}

export function isServicePerformance(data: unknown): data is ServicePerformance {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'count' in data &&
    'revenue' in data &&
    typeof (data as ServicePerformance).name === 'string' &&
    typeof (data as ServicePerformance).count === 'number' &&
    typeof (data as ServicePerformance).revenue === 'number'
  )
}

export function isStaffPerformance(data: unknown): data is StaffPerformance {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'title' in data &&
    'count' in data &&
    'revenue' in data &&
    typeof (data as StaffPerformance).name === 'string' &&
    typeof (data as StaffPerformance).count === 'number' &&
    typeof (data as StaffPerformance).revenue === 'number'
  )
}
