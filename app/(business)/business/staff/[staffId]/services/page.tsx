import { notFound } from 'next/navigation'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getStaffById } from '@/features/business/staff/api/queries'
import { getStaffServices, getAvailableServices } from '@/features/business/staff/api/staff-services-queries'
import { StaffServicesManager } from '@/features/business/staff/components/staff-services-manager'
import { generateMetadata as genMeta } from '@/lib/metadata'

type PageProps = {
  params: Promise<{ staffId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { staffId } = await params
  const staff = await getStaffById(staffId).catch(() => null)

  return genMeta({
    title: staff ? `${staff.full_name || 'Staff'} - Services` : 'Staff Services',
    description: 'Manage services for staff member',
    noIndex: true,
  })
}

export default async function StaffServicesPage({ params }: PageProps) {
  const { staffId } = await params

  let staff, salon, assignedServices, availableServices

  try {
    const { getUserSalon } = await import('@/features/business/staff/api/queries')
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

  // Format staff member in StaffWithServices format
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
