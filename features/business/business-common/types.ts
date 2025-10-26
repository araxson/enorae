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
