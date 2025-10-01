import { Card, CardContent } from '@enorae/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@enorae/ui'
import { AppointmentCard } from './appointment-card'
import type { Appointment } from '../types/profile.types'

interface AppointmentsListProps {
  upcoming: Appointment[]
  past: Appointment[]
}

export function AppointmentsList({ upcoming, past }: AppointmentsListProps) {
  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <TabsList>
        <TabsTrigger value="upcoming">
          Upcoming ({upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past ({past.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4">
        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No upcoming appointments. Browse salons to book your next appointment.
              </p>
            </CardContent>
          </Card>
        ) : (
          upcoming.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        {past.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No past appointments.
              </p>
            </CardContent>
          </Card>
        ) : (
          past.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isPast
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}