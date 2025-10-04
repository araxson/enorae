import { StatCard } from '@/components/shared'
import { MetricsGrid } from '@/components/dashboard'
import { Building2, Users, Calendar, CheckCircle } from 'lucide-react'

interface PlatformMetricsProps {
  metrics: {
    totalSalons: number
    totalUsers: number
    totalAppointments: number
    activeAppointments: number
  }
}

export function PlatformMetrics({ metrics }: PlatformMetricsProps) {
  return (
    <MetricsGrid maxColumns={4}>
      <StatCard
        label="Total Salons"
        value={metrics.totalSalons}
        icon={<Building2 className="h-4 w-4" />}
        description="Active salons on platform"
      />
      <StatCard
        label="Total Users"
        value={metrics.totalUsers}
        icon={<Users className="h-4 w-4" />}
        description="Registered users"
      />
      <StatCard
        label="Total Appointments"
        value={metrics.totalAppointments}
        icon={<Calendar className="h-4 w-4" />}
        description="All-time bookings"
      />
      <StatCard
        label="Active Appointments"
        value={metrics.activeAppointments}
        icon={<CheckCircle className="h-4 w-4" />}
        description="Upcoming bookings"
      />
    </MetricsGrid>
  )
}
