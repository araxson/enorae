import { notFound } from 'next/navigation'
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
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </section>
    )
  }
}
