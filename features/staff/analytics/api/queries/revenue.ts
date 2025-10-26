import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/lib/auth/staff'

export interface StaffRevenueBreakdown {
  service_id: string
  service_name: string
  bookings_count: number
  total_revenue: number
  avg_price: number
}

export async function getStaffRevenueBreakdown(
  staffId?: string,
  startDate?: string,
  endDate?: string
): Promise<StaffRevenueBreakdown[]> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { staffProfile } = await verifyStaffOwnership(staffId)
  // NOTE: The current database schema does not expose per-appointment pricing or
  // service breakdown data via public views. Until pricing data is available,
  // return an empty dataset to keep the API aligned with the database.
  void startDate
  void endDate
  void staffProfile

  return []
}
