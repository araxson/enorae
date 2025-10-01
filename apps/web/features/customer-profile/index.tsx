import { Button } from '@enorae/ui'
import { getCustomerProfile, getUpcomingAppointments, getPastAppointments } from './dal/profile.queries'
import { ProfileHeader } from './components/profile-header'
import { AppointmentsList } from './components/appointments-list'

export async function CustomerProfile() {
  const [profile, upcoming, past] = await Promise.all([
    getCustomerProfile(),
    getUpcomingAppointments(),
    getPastAppointments(),
  ])

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button asChild>
          <a href="/salons">Browse Salons</a>
        </Button>
      </div>

      <ProfileHeader profile={profile} />

      <div>
        <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
        <AppointmentsList upcoming={upcoming} past={past} />
      </div>
    </div>
  )
}