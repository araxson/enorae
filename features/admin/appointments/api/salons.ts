import type { SalonPerformance } from './types'

interface SalonStatEntry {
  salonId: string
  salonName: string | null
  data?: {
    avg_service_duration: number
    cancelled_appointments: number
    completed_appointments: number
    no_show_appointments: number
    total_appointments: number
    total_revenue: number
  } | null
}

export const mergeSalonPerformance = (entries: SalonStatEntry[]): SalonPerformance[] =>
  entries.map((entry) => ({
    salonId: entry.salonId,
    salonName: entry.salonName,
    total: entry.data?.total_appointments ?? 0,
    completed: entry.data?.completed_appointments ?? 0,
    cancelled: entry.data?.cancelled_appointments ?? 0,
    noShow: entry.data?.no_show_appointments ?? 0,
    totalRevenue: entry.data?.total_revenue ?? 0,
    avgDuration: entry.data?.avg_service_duration ?? 0,
  }))
