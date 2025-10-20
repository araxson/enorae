import type { AdminSalon } from '@/lib/types/app.types'
import type { Database } from '@/lib/types/database.types'

export type AdminRevenueOverviewRow =
  Database['public']['Views']['admin_revenue_overview']['Row']
export type AdminAnalyticsOverviewRow =
  Database['public']['Views']['admin_analytics_overview']['Row']
export type AdminAppointmentsOverviewRow =
  Database['public']['Views']['admin_appointments_overview']['Row']
export type AdminReviewsOverviewRow =
  Database['public']['Views']['admin_reviews_overview']['Row']
export type AdminInventoryOverviewRow =
  Database['public']['Views']['admin_inventory_overview']['Row']
export type AdminMessagesOverviewRow =
  Database['public']['Views']['admin_messages_overview']['Row']
export type AdminStaffOverviewRow =
  Database['public']['Views']['admin_staff_overview']['Row']
export type SecurityIncidentLogRow =
  Database['public']['Views']['security_incident_logs']['Row']
export type AdminUsersOverviewRow =
  Database['public']['Views']['admin_users_overview']['Row']

export interface PlatformMetrics {
  totalSalons: number
  totalUsers: number
  totalAppointments: number
  activeAppointments: number
  completedAppointments: number
  revenue: number
  activeUsers: number
  lowStockAlerts: number
  pendingVerifications: number
  avgUtilization: number
}

export interface DashboardUserStats {
  roleCounts: Record<string, number>
  totalUsers: number
}

export interface AdminOverview {
  analytics: AdminAnalyticsOverviewRow | null
  revenue: AdminRevenueOverviewRow[]
  appointments: AdminAppointmentsOverviewRow[]
  reviews: AdminReviewsOverviewRow[]
  inventory: AdminInventoryOverviewRow[]
  messages: AdminMessagesOverviewRow[]
  staff: AdminStaffOverviewRow[]
}

export type { AdminSalon }
