import { notFound } from 'next/navigation'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getStaffById, getUserSalon } from '@/features/business/staff/api/queries'
import { getStaffServices, getAvailableServices } from '@/features/business/staff/api/staff-services-queries'
import { StaffServicesManager } from '@/features/business/staff/components/staff-services-manager'

type StaffServicesProps = {
  staffId: string
}

export async function StaffServices({ staffId }: StaffServicesProps) {
  let staff, salon, assignedServices, availableServices

  try {
    ;[staff, salon] = await Promise.all([
      getStaffById(staffId),
      getUserSalon(),
    ])

    if (!staff) {
      notFound()
    }

    ;[assignedServices, availableServices] = await Promise.all([
      getStaffServices(staffId),
      getAvailableServices(salon.id!),
    ])
  } catch (error) {
    return (
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load staff services'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  const staffWithServices = [
    {
      id: staff.id!,
      full_name: staff.full_name,
      title: staff.title,
      avatar_url: staff.avatar_url,
      services: assignedServices,
    },
  ]

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>{staff.full_name || 'Staff Member'} - Services</H1>
          <Lead>Assign and manage services this staff member can perform</Lead>
        </div>

        <StaffServicesManager staff={staffWithServices} availableServices={availableServices} />
      </Stack>
    </Section>
  )
}
