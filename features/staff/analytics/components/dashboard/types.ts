import type {
  StaffPerformanceMetrics,
  StaffRevenueBreakdown,
  CustomerRelationship,
} from '../../api/queries'

export interface StaffAnalyticsDashboardProps {
  metrics: StaffPerformanceMetrics
  revenueBreakdown: StaffRevenueBreakdown[]
  customerRelationships: CustomerRelationship[]
  earnings: {
    total_revenue: number
    estimated_commission: number
    commission_rate: number
    completed_appointments: number
    avg_earning_per_appointment: number
  }
}
