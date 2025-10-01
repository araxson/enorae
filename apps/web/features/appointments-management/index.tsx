import { Card, CardContent, CardHeader, CardTitle } from '@enorae/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@enorae/ui'
import { getUserSalons } from '../dashboard/dal/dashboard.queries'
import { getSalonAppointments, getTodayAppointments, getUpcomingAppointments } from './dal/appointments.queries'
import { AppointmentsTable } from './components/appointments-table'

export async function AppointmentsManagement() {
  const salons = await getUserSalons()

  if (salons.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">
          Please create a salon first.
        </p>
      </div>
    )
  }

  const selectedSalon = salons[0]
  const [allAppointments, todayAppointments, upcomingAppointments] = await Promise.all([
    getSalonAppointments(selectedSalon.id!),
    getTodayAppointments(selectedSalon.id!),
    getUpcomingAppointments(selectedSalon.id!),
  ])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-muted-foreground mt-1">{selectedSalon.name}</p>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">
            Today ({todayAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({allAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentsTable appointments={todayAppointments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentsTable appointments={upcomingAppointments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentsTable appointments={allAppointments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}