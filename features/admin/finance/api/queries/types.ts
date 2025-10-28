import type { Database } from '@/lib/types/database.types'

export type AdminRevenueRow = Database['public']['Views']['admin_revenue_overview_view']['Row']

export interface SalonRevenueRow {
  salon_id: string
  salon_name: string
  chain_name: string | null
  total_revenue: number
  service_revenue: number
  product_revenue: number
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  completion_rate: number
}

// Manual transactions feature not implemented - placeholder type
export interface ManualTransactionRow {
  id: string
  salon_id: string | null
  customer_id: string | null
  amount: number
  payment_method: string | null
  transaction_type: string | null
  created_at: string | null
}

export interface RevenueMetrics {
  totalRevenue: number
  serviceRevenue: number
  productRevenue: number
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowAppointments: number
  avgRevenuePerAppointment: number
  period: {
    start: string | null
    end: string | null
  }
}

export interface TransactionMetrics {
  totalTransactions: number
  uniqueSalons: number
  uniqueCustomers: number
  paymentMethods: Record<string, number>
  transactionTypes: Record<string, number>
  recentTransactions: ManualTransactionRow[]
}

export interface PaymentMethodStats {
  method: string
  count: number
  percentage: number
  lastUsed: string | null
}

export interface ChainRevenueData {
  chainName: string
  totalRevenue: number
  salonCount: number
}

export interface RevenueForecast {
  date: string
  forecast: number
  actual?: number
}

export interface FinancialExportData {
  summary: RevenueMetrics
  revenueByDate: { date: string; revenue: number; appointments: number }[]
  transactions: ManualTransactionRow[]
}
