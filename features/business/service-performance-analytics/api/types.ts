export interface ServicePerformanceAnalyticsState {}

export interface ServicePerformanceAnalyticsParams {}

export interface DurationAccuracy {
  service_id: string
  service_name: string
  expected_duration: number | null
  actual_duration: number | null
  variance: number | null
}

export interface ServiceProfitability {
  service_id: string
  service_name: string
  total_revenue: number
  total_appointments: number
  avg_revenue_per_appointment: number
  profit: number
  revenue: number
  cost: number
  margin: number
}

export interface ServicePairing {
  service_1_name: string
  service_2_name: string
  pairing_count: number
  total_revenue: number
  primary: string
  paired: string
  count: number
}

export interface StaffLeader {
  service_id: string
  service_name: string
  staff: Array<{
    staff_id: string
    staff_name: string
    appointmentCount: number
    revenue: number
  }>
}
