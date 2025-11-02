import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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

interface MetricCardConfig {
  key: string
  title: string
  value: string
  description: string
  icon: LucideIcon
  progressValue: number
  helper?: ReactNode
}

interface MetricsData {
  totalSalons: number
  totalUsers: number
  totalAppointments: number
  activeAppointments: number
  revenue: number
  activeUsers: number
  pendingVerifications: number
}

const formatNumber = (value: number) => value.toLocaleString()
const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export function getPlatformMetricsConfig(metrics: MetricsData): MetricCardConfig[] {
  const activeRate =
    metrics.totalAppointments > 0
      ? Math.round((metrics.activeAppointments / metrics.totalAppointments) * 100)
      : 0

  const avgUsersPerSalon =
    metrics.totalSalons > 0 ? Math.round(metrics.totalUsers / metrics.totalSalons) : 0

  const avgRevenuePerSalon =
    metrics.totalSalons > 0 ? metrics.revenue / metrics.totalSalons : 0

  const activeUserRate =
    metrics.totalUsers > 0 ? Math.round((metrics.activeUsers / metrics.totalUsers) * 100) : 0

  return [
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
              <TrendingUp className="size-4" aria-hidden="true" /> {formatCurrency(avgRevenuePerSalon)} avg /
              salon
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent>
            Average revenue per salon helps measure platform monetization. Track this metric to
            ensure healthy business growth.
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
              <Users className="size-4" aria-hidden="true" /> {avgUsersPerSalon} avg users / salon
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent>
            Average user count per salon helps you spot onboarding or retention gaps. Keep this
            above 8 for healthy engagement.
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
      helper: <Badge variant="outline">Sustainable growth</Badge>,
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
              <Activity className="size-4" aria-hidden="true" /> {activeUserRate}% engagement rate
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent>
            Active user rate measures engagement over the last 30 days. Target 40%+ for healthy
            platform activity.
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
            <Badge variant="outline">Activity index updates hourly</Badge>
          </TooltipTrigger>
          <TooltipContent>
            Use the activity index to compare booking velocity week over week.
          </TooltipContent>
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
      helper: <Badge variant="outline">{activeRate}% active rate</Badge>,
    },
  ]
}
