import { notFound } from 'next/navigation'
import { Section, Stack } from '@/components/layout'
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
      email: staff.email || null,
      title: staff.title,
      avatar_url: staff.avatar_url,
      bio: staff.bio,
      experience_years: staff.experience_years,
      status: staff.status,
      services: assignedServices,
    },
  ]

  return (
    <Section size="lg">
      <Stack gap="xl">
        <StaffServicesManager staff={staffWithServices} availableServices={availableServices} />
      </Stack>
    </Section>
  )
}
