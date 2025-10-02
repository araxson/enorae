import { Calendar } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Section, Stack } from '@/components/layout'
import { H1, Muted } from '@/components/ui/typography'
import { Skeleton } from '@/components/ui/skeleton'
import { getStaffSchedules, getSalonStaff, getScheduleSalon } from './dal/staff-schedule.queries'
import { ScheduleCalendar } from './components/schedule-calendar'

type StaffScheduleManagementProps = {
  startDate?: string
  endDate?: string
}

export async function StaffScheduleManagement({
  startDate,
  endDate
}: StaffScheduleManagementProps = {}) {
  // Get salon from DAL
  let salon
  try {
    salon = await getScheduleSalon()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  // Default to next 14 days
  const start = startDate || new Date().toISOString().split('T')[0]
  const end = endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Fetch data in parallel
  const [schedules, staff] = await Promise.all([
    getStaffSchedules(salon.id, start, end),
    getSalonStaff(salon.id),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Staff Schedules</H1>
          <Muted className="flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" />
            {new Date(start).toLocaleDateString()} - {new Date(end).toLocaleDateString()}
          </Muted>
        </div>

        <ScheduleCalendar schedules={schedules} />
      </Stack>
    </Section>
  )
}

export function StaffScheduleManagementSkeleton() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </Stack>
    </Section>
  )
}
