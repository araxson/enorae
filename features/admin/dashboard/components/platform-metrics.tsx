import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Activity,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'

/**
 * Input metrics required to render the platform KPIs surface.
 */
interface PlatformMetricsProps {
  metrics: {
    totalSalons: number
    totalUsers: number
    totalAppointments: number
    activeAppointments: number
    revenue: number
    activeUsers: number
    pendingVerifications: number
  }
}

const formatNumber = (value: number) => value.toLocaleString()
const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/**
 * Displays platform-level KPIs in a responsive grid of metric cards.
 */
export function PlatformMetrics({ metrics }: PlatformMetricsProps) {
  const activeRate = metrics.totalAppointments > 0
    ? Math.round((metrics.activeAppointments / metrics.totalAppointments) * 100)
    : 0

  const avgUsersPerSalon = metrics.totalSalons > 0
    ? Math.round(metrics.totalUsers / metrics.totalSalons)
    : 0

  const avgRevenuePerSalon = metrics.totalSalons > 0
    ? metrics.revenue / metrics.totalSalons
    : 0

  const activeUserRate = metrics.totalUsers > 0
    ? Math.round((metrics.activeUsers / metrics.totalUsers) * 100)
    : 0

  const cards = [
    {
      key: 'revenue',
      title: 'Total revenue',
      value: formatCurrency(metrics.revenue),
      description: 'Platform-wide revenue across all salons',
      icon: DollarSign,
      progressValue: 100,
      helper: (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="secondary">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              {' '}
              {formatCurrency(avgRevenuePerSalon)} avg / salon
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent>
            <p>
              Average revenue per salon helps measure platform monetization. Track this metric to ensure healthy business growth.
            </p>
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      key: 'salons',
      title: 'Total salons',
      value: formatNumber(metrics.totalSalons),
      description: 'Active businesses connected to the platform',
      icon: Building2,
      progressValue: 100,
      helper: (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="secondary">
              <Users className="h-4 w-4" aria-hidden="true" />
              {' '}
              {avgUsersPerSalon} avg users / salon
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent>
            <p>
              Average user count per salon helps you spot onboarding or retention gaps. Keep this above 8 for healthy engagement.
            </p>
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      key: 'users',
      title: 'Total users',
      value: formatNumber(metrics.totalUsers),
      description: 'Registered platform accounts across roles',
      icon: Users,
      progressValue: metrics.totalSalons
        ? Math.min(100, Math.round((metrics.totalUsers / (metrics.totalSalons * 15)) * 100))
        : 0,
      helper: (
        <Badge variant="outline">
          Sustainable growth
        </Badge>
      ),
    },
    {
      key: 'activeUsers',
      title: 'Active users (30d)',
      value: formatNumber(metrics.activeUsers),
      description: 'Users with platform activity in last 30 days',
      icon: UserCheck,
      progressValue: activeUserRate,
      helper: (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="secondary">
              <Activity className="h-4 w-4" aria-hidden="true" />
              {' '}
              {activeUserRate}% engagement rate
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent>
            <p>
              Active user rate measures engagement over the last 30 days. Target 40%+ for healthy platform activity.
            </p>
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      key: 'appointments',
      title: 'Total appointments',
      value: formatNumber(metrics.totalAppointments),
      description: 'All-time bookings made through the platform',
      icon: Calendar,
      progressValue: Math.min(100, Math.round(metrics.totalAppointments / 50)),
      helper: (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>Activity index updates hourly</span>
          </TooltipTrigger>
          <TooltipContent>Use the activity index to compare booking velocity week over week.</TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: 'activeAppointments',
      title: 'Active appointments',
      value: formatNumber(metrics.activeAppointments),
      description: 'Upcoming confirmed bookings',
      icon: CheckCircle2,
      progressValue: activeRate,
      helper: (
        <Badge variant="outline">
          {activeRate}% active rate
        </Badge>
      ),
    },
  ] as const satisfies Array<{
    key: string
    title: string
    value: string
    description: string
    icon: LucideIcon
    progressValue: number
    helper?: ReactNode
  }>

  return (
    <section className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Platform metrics</CardTitle>
          <CardDescription>Core KPIs refresh every minute so you can respond quickly.</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            {' '}
            Live stats
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(({ key, title, value, description, icon: Icon, progressValue, helper }) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <strong>{value}</strong>
                </div>
                <Progress value={progressValue} />
                {helper ? (
                  <div className="flex items-center gap-2">
                    {helper}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
