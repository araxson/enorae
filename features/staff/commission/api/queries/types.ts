import type { Database } from '@/lib/types/database.types'

export type AppointmentRow = Database['public']['Views']['admin_appointments_overview_view']['Row']

export type CommissionData = {
  todayEarnings: number
  weekEarnings: number
  monthEarnings: number
  totalAppointments: number
  avgPerAppointment: number
}

export type DailyEarnings = {
  date: string
  earnings: number
  appointments: number
}

export type ServiceRevenue = {
  service_name: string
  revenue: number
  count: number
  commission_rate?: number
  commission_amount?: number
}

export type CommissionRate = {
  service_id: string
  service_name: string
  base_price: number
  commission_percentage: number
  commission_flat_rate: number | null
}

export type PayoutSchedule = {
  period_start: string
  period_end: string
  total_revenue: number
  commission_amount: number
  payout_status: 'pending' | 'processing' | 'paid'
  payout_date: string | null
}
