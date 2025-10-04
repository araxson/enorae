import { StatCard } from '@/components/shared'
import { MetricsGrid } from '@/components/dashboard'
import { Calendar, CheckCircle, Heart } from 'lucide-react'

interface CustomerMetricsProps {
  metrics: {
    upcomingAppointments: number
    completedAppointments: number
    favorites: number
  }
}

export function CustomerMetrics({ metrics }: CustomerMetricsProps) {
  return (
    <MetricsGrid maxColumns={3}>
      <StatCard
        label="Upcoming Appointments"
        value={metrics.upcomingAppointments}
        icon={<Calendar className="h-4 w-4" />}
        description="Scheduled bookings"
      />
      <StatCard
        label="Completed Appointments"
        value={metrics.completedAppointments}
        icon={<CheckCircle className="h-4 w-4" />}
        description="Total visits"
      />
      <StatCard
        label="Favorites"
        value={metrics.favorites}
        icon={<Heart className="h-4 w-4" />}
        description="Saved items"
      />
    </MetricsGrid>
  )
}
