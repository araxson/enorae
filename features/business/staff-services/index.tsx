import { notFound } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  StaffServicesNotFoundError,
  getStaffServicesData,
} from './api/queries'
import { StaffServicesPanel } from './components/staff-services-panel'

type StaffServicesProps = {
  params: Promise<{ 'staff-id': string }>
}

export async function StaffServices({ params }: StaffServicesProps) {
  const resolvedParams = await params
  const staffId = resolvedParams['staff-id']
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
          <AlertTitle>Staff services unavailable</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </section>
    )
  }
}
