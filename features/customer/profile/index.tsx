import { getProfile, getUserAppointments } from './api/queries'
import { ProfileHeader } from './components/profile-header'
import { AppointmentsList } from './components/appointments-list'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { UsernameForm } from '@/features/shared/profile/components/username-form'

export async function CustomerProfile() {
  let profile
  let appointments

  try {
    // Both functions check auth internally
    profile = await getProfile()
    appointments = await getUserAppointments()
  } catch {
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

        <UsernameForm currentUsername={profile.username} />

        <div>
          <H1>My Appointments</H1>
          <Lead>View and manage your bookings</Lead>
        </div>

        <AppointmentsList appointments={appointments} />
      </Stack>
    </Section>
  )
}
