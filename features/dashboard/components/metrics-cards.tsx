import { StatCard } from '@/components/shared'
import { Grid, Stack, Box } from '@/components/layout'
import { Separator } from '@/components/ui/separator'
import { H3 } from '@/components/ui/typography'
import { Calendar, CheckCircle, Clock, Users, Scissors } from 'lucide-react'

interface MetricsCardsProps {
  metrics: {
    totalAppointments: number
    confirmedAppointments: number
    pendingAppointments: number
    totalStaff: number
    totalServices: number
  }
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <Stack gap="lg">
      <Box>
        <H3>Key Metrics</H3>
        <Separator className="mt-2" />
      </Box>

      <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="lg">
        <StatCard
          label="Total Appointments"
          value={metrics.totalAppointments}
          icon={<Calendar className="h-4 w-4" />}
        />

        <StatCard
          label="Confirmed"
          value={metrics.confirmedAppointments}
          icon={<CheckCircle className="h-4 w-4" />}
        />

        <StatCard
          label="Pending"
          value={metrics.pendingAppointments}
          icon={<Clock className="h-4 w-4" />}
        />
      </Grid>

      <Separator />

      <Grid cols={{ base: 1, sm: 2 }} gap="lg">
        <StatCard
          label="Active Staff"
          value={metrics.totalStaff}
          icon={<Users className="h-4 w-4" />}
        />

        <StatCard
          label="Services"
          value={metrics.totalServices}
          icon={<Scissors className="h-4 w-4" />}
        />
      </Grid>
    </Stack>
  )
}
