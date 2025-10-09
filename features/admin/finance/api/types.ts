import type { Database } from '@/lib/types/database.types'

export type AdminRevenueRow = Database['public']['Views']['admin_revenue_overview']['Row']
export type ManualTransactionRow = Database['public']['Views']['manual_transactions']['Row']

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
