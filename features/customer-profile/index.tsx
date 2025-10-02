import { getProfile, getUserAppointments } from './dal/customer-profile.queries'
import { ProfileHeader } from './components/profile-header'
import { AppointmentsList } from './components/appointments-list'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'

export async function CustomerProfile() {
  let profile
  let appointments

  try {
    // Both functions check auth internally
    profile = await getProfile()
    appointments = await getUserAppointments()
  } catch (error) {
    return (
      <Section size="lg">
        <H1>Please log in to view your profile</H1>
      </Section>
    )
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <ProfileHeader profile={profile} />

        <div>
          <H1>My Appointments</H1>
          <Lead>View and manage your bookings</Lead>
        </div>

        <AppointmentsList appointments={appointments} />
      </Stack>
    </Section>
  )
}
