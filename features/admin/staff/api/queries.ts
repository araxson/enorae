import 'server-only'

export { getStaffDashboardData } from './internal/staff-dashboard/get-staff-dashboard-data'

export type {
  StaffDashboardData,
  StaffDashboardStats,
  StaffPerformanceBenchmark,
  StaffWithMetrics,
} from './internal/staff-dashboard/types'
