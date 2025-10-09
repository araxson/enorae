'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Grid, Stack, Box, Flex } from '@/components/layout'
import { H3, Small } from '@/components/ui/typography'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react'

interface OperationalMetricsDashboardProps {
  metrics: {
    capacityUtilization: number
    averageWaitTime: number
    staffUtilization: number
    appointmentsPerDay: number
    bookingFillRate: number
    peakHours: string[]
  }
}

export function OperationalMetricsDashboard({ metrics }: OperationalMetricsDashboardProps) {
  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational Metrics</CardTitle>
        <CardDescription>Real-time operational performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <Stack gap="lg">
          {/* Utilization Metrics */}
          <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
            <Box className="p-4 rounded-lg border">
              <Flex align="center" gap="sm" className="mb-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <H3 className="text-sm">Capacity Utilization</H3>
              </Flex>
              <div className={`text-3xl font-bold mb-2 ${getUtilizationColor(metrics.capacityUtilization)}`}>
                {metrics.capacityUtilization}%
              </div>
              <Progress value={metrics.capacityUtilization} className="h-2" />
              <Small className="text-muted-foreground mt-2">Overall capacity usage</Small>
            </Box>

            <Box className="p-4 rounded-lg border">
              <Flex align="center" gap="sm" className="mb-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <H3 className="text-sm">Staff Utilization</H3>
              </Flex>
              <div className={`text-3xl font-bold mb-2 ${getUtilizationColor(metrics.staffUtilization)}`}>
                {metrics.staffUtilization}%
              </div>
              <Progress value={metrics.staffUtilization} className="h-2" />
              <Small className="text-muted-foreground mt-2">Staff productivity</Small>
            </Box>

            <Box className="p-4 rounded-lg border">
              <Flex align="center" gap="sm" className="mb-3">
                <Target className="h-5 w-5 text-muted-foreground" />
                <H3 className="text-sm">Booking Fill Rate</H3>
              </Flex>
              <div className={`text-3xl font-bold mb-2 ${getUtilizationColor(metrics.bookingFillRate)}`}>
                {metrics.bookingFillRate}%
              </div>
              <Progress value={metrics.bookingFillRate} className="h-2" />
              <Small className="text-muted-foreground mt-2">Schedule efficiency</Small>
            </Box>
          </Grid>

          {/* Performance Indicators */}
          <Grid cols={{ base: 1, md: 2 }} gap="md">
            <Box className="p-4 rounded-lg bg-muted/50">
              <Flex align="center" gap="sm" className="mb-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <H3 className="text-base">Average Wait Time</H3>
              </Flex>
              <div className="text-2xl font-bold">{metrics.averageWaitTime} min</div>
              <Small className="text-muted-foreground">Per customer</Small>
            </Box>

            <Box className="p-4 rounded-lg bg-muted/50">
              <Flex align="center" gap="sm" className="mb-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <H3 className="text-base">Appointments/Day</H3>
              </Flex>
              <div className="text-2xl font-bold">{metrics.appointmentsPerDay}</div>
              <Small className="text-muted-foreground">Average daily bookings</Small>
            </Box>
          </Grid>

          {/* Peak Hours */}
          {metrics.peakHours.length > 0 && (
            <Box className="p-4 rounded-lg border">
              <Flex align="center" gap="sm" className="mb-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <H3 className="text-base">Peak Hours</H3>
              </Flex>
              <Flex gap="xs" wrap>
                {metrics.peakHours.map((hour, index) => (
                  <Badge key={index} variant="secondary">
                    {hour}
                  </Badge>
                ))}
              </Flex>
              <Small className="text-muted-foreground mt-2">Busiest times of day</Small>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
