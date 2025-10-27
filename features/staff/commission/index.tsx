import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { getStaffProfile } from '@/features/staff/appointments/api/queries'
import {
  getStaffCommission,
  getDailyEarnings,
  getServiceBreakdown,
  getCommissionRates,
  getPayoutSchedule,
  getServiceCommissionBreakdown,
} from './api/queries'
import { CommissionClient } from './components/commission-client'

export async function StaffCommission() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <section className="p-4">
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Commission unavailable</EmptyTitle>
                <EmptyDescription>
                  {error instanceof Error ? error.message : 'Please log in to view commission data'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!staffProfile) {
    return (
      <section className="p-4">
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Profile not found</EmptyTitle>
                <EmptyDescription>Staff profile not found</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </section>
    )
  }

  const staff = staffProfile as { id: string }

  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()

  const [commission, dailyEarnings, serviceBreakdown, commissionRates, payoutSchedule] = await Promise.all([
    getStaffCommission(staff.id),
    getDailyEarnings(staff.id, 30),
    getServiceCommissionBreakdown(staff.id, startOfMonth, endOfMonth),
    getCommissionRates(staff.id),
    getPayoutSchedule(staff.id),
  ])

  return (
    <CommissionClient
      staffId={staff.id}
      commission={commission}
      dailyEarnings={dailyEarnings}
      serviceBreakdown={serviceBreakdown}
      commissionRates={commissionRates}
      payoutSchedule={payoutSchedule}
    />
  )
}
