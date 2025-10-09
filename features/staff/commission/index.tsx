import { Alert, AlertDescription } from '@/components/ui/alert'
import { getStaffProfile } from '../appointments/api/queries'
import { getStaffCommission, getDailyEarnings, getServiceBreakdown } from './api/queries'
import { CommissionClient } from './components/commission-client'

export async function StaffCommission() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view commission data'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!staffProfile) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  const staff = staffProfile as { id: string }

  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()

  const [commission, dailyEarnings, serviceBreakdown] = await Promise.all([
    getStaffCommission(staff.id),
    getDailyEarnings(staff.id, 30),
    getServiceBreakdown(staff.id, startOfMonth, endOfMonth),
  ])

  return (
    <CommissionClient
      commission={commission}
      dailyEarnings={dailyEarnings}
      serviceBreakdown={serviceBreakdown}
    />
  )
}
