import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Calendar } from '@enorae/ui'
import { getStaffSchedules } from './dal/schedule.queries'
import { Plus, Clock, UserCheck, UserX, Calendar as CalendarIcon } from 'lucide-react'

export async function StaffScheduleManager() {
  const { schedules, timeOffRequests } = await getStaffSchedules()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Schedules</h1>
          <p className="text-muted-foreground">Manage working hours and time-off requests</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Schedule Overview */}
        <Card>
          <CardHeader>
            <CardTitle>This Week's Schedule</CardTitle>
            <CardDescription>Staff availability for current week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedules.map((schedule: any) => (
                <div key={schedule.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{schedule.staff_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.day_of_week}: {schedule.start_time} - {schedule.end_time}
                      </p>
                    </div>
                  </div>
                  <Badge variant={schedule.is_available ? 'default' : 'secondary'}>
                    {schedule.is_available ? 'Available' : 'Off'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time-Off Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Time-Off Requests</CardTitle>
            <CardDescription>Pending and approved time-off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeOffRequests.length > 0 ? (
                timeOffRequests.map((request: any) => (
                  <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                        <UserX className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{request.staff_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.start_date).toLocaleDateString()} -
                          {new Date(request.end_date).toLocaleDateString()}
                        </p>
                        {request.reason && (
                          <p className="text-xs text-muted-foreground">{request.reason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={
                        request.status === 'approved' ? 'default' :
                        request.status === 'pending' ? 'secondary' :
                        'destructive'
                      }>
                        {request.status}
                      </Badge>
                      {request.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 px-2">
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive">
                            Deny
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No time-off requests
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Working Hours Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
            <CardDescription>Default schedule for all staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">{day}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {day === 'Sunday' ? 'Closed' : '9:00 AM - 6:00 PM'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common scheduling tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Set Business Hours
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <UserX className="mr-2 h-4 w-4" />
              Block Time Slots
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              View Full Calendar
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}