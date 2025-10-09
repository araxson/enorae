import { Section } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StaffClient } from './components/staff-client'
import { getStaffDashboardData } from './api/queries'

export async function AdminStaff() {
  try {
    const data = await getStaffDashboardData()

    return (
      <Section size="lg">
        <StaffClient {...data} />
      </Section>
    )
  } catch (error) {
    return (
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load staff overview'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }
}
