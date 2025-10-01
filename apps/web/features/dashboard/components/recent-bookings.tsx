import { Card, CardContent, CardHeader, CardTitle } from '@enorae/ui'
import { Badge } from '@enorae/ui'
import type { Appointment } from '../types/dashboard.types'

interface RecentBookingsProps {
  bookings: Appointment[]
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent bookings</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div>
                <p className="font-medium">
                  {booking.confirmation_code || 'No code'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {booking.start_time
                    ? new Date(booking.start_time).toLocaleString()
                    : 'No time'}
                </p>
              </div>
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                {booking.status || 'pending'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}