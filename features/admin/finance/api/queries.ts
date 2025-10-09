import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type {
  AdminRevenueRow,
  ManualTransactionRow,
  RevenueMetrics,
  TransactionMetrics,
  PaymentMethodStats
} from './types'

async function requireAdminClient() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  return createServiceRoleClient()
}

/**
 * Get platform-wide revenue analytics
 */
export async function getPlatformRevenueAnalytics(
  startDate?: string,
  endDate?: string
): Promise<RevenueMetrics> {
  const supabase = await requireAdminClient()

  let query = supabase
    .from('admin_revenue_overview')
    .select('*')
    .order('date', { ascending: false })

  if (startDate) {
    query = query.gte('date', startDate)
  }

  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query

  if (error) throw error

  const revenueData = data || []

  // Calculate metrics
  const totalRevenue = revenueData.reduce((sum, row) => sum + (Number(row.total_revenue) || 0), 0)
  const serviceRevenue = revenueData.reduce((sum, row) => sum + (Number(row.service_revenue) || 0), 0)
  const productRevenue = revenueData.reduce((sum, row) => sum + (Number(row.product_revenue) || 0), 0)
  const totalAppointments = revenueData.reduce((sum, row) => sum + (row.total_appointments || 0), 0)
  const completedAppointments = revenueData.reduce((sum, row) => sum + (row.completed_appointments || 0), 0)
  const cancelledAppointments = revenueData.reduce((sum, row) => sum + (row.cancelled_appointments || 0), 0)
  const noShowAppointments = revenueData.reduce((sum, row) => sum + (row.no_show_appointments || 0), 0)

  const avgRevenuePerAppointment = completedAppointments > 0
    ? totalRevenue / completedAppointments
    : 0

  return {
    totalRevenue,
    serviceRevenue,
    productRevenue,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    avgRevenuePerAppointment,
    period: {
      start: startDate || revenueData[revenueData.length - 1]?.date || null,
      end: endDate || revenueData[0]?.date || null
    }
  }
}

/**
 * Get revenue by salon
 */
export async function getRevenueBySalon(
  startDate?: string,
  endDate?: string,
  limit: number = 20
): Promise<AdminRevenueRow[]> {
  const supabase = await requireAdminClient()

  let query = supabase
    .from('admin_revenue_overview')
    .select('*')
    .order('total_revenue', { ascending: false })
    .limit(limit)

  if (startDate) {
    query = query.gte('date', startDate)
  }

  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

/**
 * Get revenue by chain
 */
export async function getRevenueByChain(
  startDate?: string,
  endDate?: string
): Promise<{ chainName: string; totalRevenue: number; salonCount: number }[]> {
  const supabase = await requireAdminClient()

  let query = supabase
    .from('admin_revenue_overview')
    .select('*')

  if (startDate) {
    query = query.gte('date', startDate)
  }

  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query

  if (error) throw error

  const chainMap = new Map<string, { revenue: number; salons: Set<string> }>()

  data?.forEach(row => {
    const chainName = row.chain_name || 'Independent'
    if (!chainMap.has(chainName)) {
      chainMap.set(chainName, { revenue: 0, salons: new Set() })
    }
    const chain = chainMap.get(chainName)!
    chain.revenue += Number(row.total_revenue) || 0
    if (row.salon_id) {
      chain.salons.add(row.salon_id)
    }
  })

  return Array.from(chainMap.entries())
    .map(([chainName, data]) => ({
      chainName,
      totalRevenue: data.revenue,
      salonCount: data.salons.size
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
}

/**
 * Get transaction monitoring data
 */
export async function getTransactionMonitoring(
  limit: number = 100
): Promise<TransactionMetrics> {
  const supabase = await requireAdminClient()

  const { data: transactions, error } = await supabase
    .from('manual_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  const transactionData = transactions || []

  // Calculate metrics
  const totalTransactions = transactionData.length
  const uniqueSalons = new Set(transactionData.map(t => t.salon_id).filter(Boolean)).size
  const uniqueCustomers = new Set(transactionData.map(t => t.customer_id).filter(Boolean)).size

  // Payment method breakdown
  const paymentMethods = transactionData.reduce((acc, t) => {
    const method = t.payment_method || 'unknown'
    acc[method] = (acc[method] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Transaction type breakdown
  const transactionTypes = transactionData.reduce((acc, t) => {
    const type = t.transaction_type || 'unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalTransactions,
    uniqueSalons,
    uniqueCustomers,
    paymentMethods,
    transactionTypes,
    recentTransactions: transactionData.slice(0, 10)
  }
}

/**
 * Get payment processing oversight
 */
export async function getPaymentMethodStats(
  startDate?: string,
  endDate?: string
): Promise<PaymentMethodStats[]> {
  const supabase = await requireAdminClient()

  let query = supabase
    .from('manual_transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (startDate) {
    query = query.gte('created_at', startDate)
  }

  if (endDate) {
    query = query.lte('created_at', endDate)
  }

  const { data: transactions, error } = await query

  if (error) throw error

  const methodMap = new Map<string, { count: number; transactions: ManualTransactionRow[] }>()

  transactions?.forEach(t => {
    const method = t.payment_method || 'unknown'
    if (!methodMap.has(method)) {
      methodMap.set(method, { count: 0, transactions: [] })
    }
    const stats = methodMap.get(method)!
    stats.count += 1
    stats.transactions.push(t)
  })

  return Array.from(methodMap.entries())
    .map(([method, data]) => ({
      method,
      count: data.count,
      percentage: (data.count / (transactions?.length || 1)) * 100,
      lastUsed: data.transactions[0]?.created_at || null
    }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Get revenue forecast based on historical data
 */
export async function getRevenueForecast(
  days: number = 30
): Promise<{ date: string; forecast: number; actual?: number }[]> {
  const supabase = await requireAdminClient()

  // Get last 90 days of data for forecasting
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 90)

  const { data, error } = await supabase
    .from('admin_revenue_overview')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) throw error

  const revenueData = data || []

  // Simple moving average forecast
  const dailyRevenue = revenueData.reduce((acc, row) => {
    const date = row.date || ''
    acc[date] = (acc[date] || 0) + (Number(row.total_revenue) || 0)
    return acc
  }, {} as Record<string, number>)

  const revenues = Object.values(dailyRevenue)
  const avgDailyRevenue = revenues.length > 0
    ? revenues.reduce((sum, val) => sum + val, 0) / revenues.length
    : 0

  // Generate forecast for next N days
  const forecast: { date: string; forecast: number; actual?: number }[] = []

  for (let i = 0; i < days; i++) {
    const forecastDate = new Date()
    forecastDate.setDate(forecastDate.getDate() + i)
    const dateStr = forecastDate.toISOString().split('T')[0]

    forecast.push({
      date: dateStr,
      forecast: avgDailyRevenue * (1 + (Math.random() * 0.2 - 0.1)), // ±10% variance
      actual: dailyRevenue[dateStr] || undefined
    })
  }

  return forecast
}

/**
 * Get financial export data for accounting
 */
export async function getFinancialExportData(
  startDate: string,
  endDate: string
): Promise<{
  summary: RevenueMetrics
  revenueByDate: { date: string; revenue: number; appointments: number }[]
  transactions: ManualTransactionRow[]
}> {
  const supabase = await requireAdminClient()

  // Get summary
  const summary = await getPlatformRevenueAnalytics(startDate, endDate)

  // Get revenue by date
  const { data: revenueData, error: revenueError } = await supabase
    .from('admin_revenue_overview')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (revenueError) throw revenueError

  const revenueByDate = (revenueData || []).reduce((acc, row) => {
    const date = row.date || ''
    const existing = acc.find(r => r.date === date)
    if (existing) {
      existing.revenue += Number(row.total_revenue) || 0
      existing.appointments += row.total_appointments || 0
    } else {
      acc.push({
        date,
        revenue: Number(row.total_revenue) || 0,
        appointments: row.total_appointments || 0
      })
    }
    return acc
  }, [] as { date: string; revenue: number; appointments: number }[])

  // Get transactions
  const { data: transactions, error: txError } = await supabase
    .from('manual_transactions')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true })

  if (txError) throw txError

  return {
    summary,
    revenueByDate,
    transactions: transactions || []
  }
}
