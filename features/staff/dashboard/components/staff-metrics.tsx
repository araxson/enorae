import { StatCard } from '@/components/shared'
import { MetricsGrid } from '@/components/dashboard'
import { Calendar, CheckCircle, Clock } from 'lucide-react'

interface StaffMetricsProps {
  metrics: {
    todayAppointments: number
    weekAppointments: number
    monthCompleted: number
  }
}

export function StaffMetrics({ metrics }: StaffMetricsProps) {
  return (
    <MetricsGrid maxColumns={3}>
      <StatCard
        label="Today's Appointments"
        value={metrics.todayAppointments}
        icon={<Clock className="h-4 w-4" />}
        description="Scheduled for today"
      />
      <StatCard
        label="This Week"
        value={metrics.weekAppointments}
        icon={<Calendar className="h-4 w-4" />}
        description="Total appointments"
      />
      <StatCard
        label="Completed This Month"
        value={metrics.monthCompleted}
        icon={<CheckCircle className="h-4 w-4" />}
        description="Successfully completed"
      />
    </MetricsGrid>
  )
}
