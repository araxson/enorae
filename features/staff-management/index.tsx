import { getStaff, getUserSalon } from './dal/staff.queries'
import { StaffList } from './components/staff-list'
import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'

export async function StaffManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch (error) {
    return (
      <Section size="lg">
        <H1>Please log in to manage staff</H1>
      </Section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <Section size="lg">
        <H1>No salon found</H1>
        <Lead>Please create a salon to manage staff</Lead>
      </Section>
    )
  }

  const staff = await getStaff(salon.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Staff Management</H1>
          <Lead>Manage your salon team</Lead>
        </Box>
        <StaffList staff={staff} />
      </Stack>
    </Section>
  )
}
