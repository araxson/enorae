import { notFound } from 'next/navigation'
import { Section } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  StaffServicesNotFoundError,
  getStaffServicesData,
} from './api/queries'
import { StaffServicesPanel } from './components/staff-services-panel'

type StaffServicesProps = {
  staffId: string
}

export async function StaffServices({ staffId }: StaffServicesProps) {
  try {
    const { staff, availableServices } = await getStaffServicesData(staffId)

    return (
      <StaffServicesPanel staff={staff} availableServices={availableServices} />
    )
  } catch (error) {
    if (error instanceof StaffServicesNotFoundError) {
      notFound()
    }

    const message =
      error instanceof Error ? error.message : 'Failed to load staff services'

    return (
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </Section>
    )
  }
}
