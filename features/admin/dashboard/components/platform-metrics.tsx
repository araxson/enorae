import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
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

interface PlatformMetricsProps {
  metrics: {
    totalSalons: number
    totalUsers: number
    totalAppointments: number
    activeAppointments: number
    revenue: number
    activeUsers: number
    lowStockAlerts: number
    pendingVerifications: number
  }
}

const formatNumber = (value: number) => value.toLocaleString()
const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

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
      accent: 'bg-green-500/10 text-green-600',
      progressValue: 100,
      progressClassName: '[&>div]:bg-green-600',
      footer: (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="secondary" className="cursor-default gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {formatCurrency(avgRevenuePerSalon)} avg / salon
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent className="w-72 text-sm text-muted-foreground">
            Average revenue per salon helps measure platform monetization. Track this metric to ensure healthy business growth.
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
      accent: 'bg-indigo-500/10 text-indigo-600',
      progressValue: 100,
      progressClassName: '[&>div]:bg-indigo-600',
      footer: (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="secondary" className="cursor-default gap-1">
              <Users className="h-3.5 w-3.5" />
              {avgUsersPerSalon} avg users / salon
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent className="w-72 text-sm text-muted-foreground">
            Average user count per salon helps you spot onboarding or retention gaps. Keep this above 8 for healthy engagement.
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
      accent: 'bg-purple-500/10 text-purple-600',
      progressValue: metrics.totalSalons
        ? Math.min(100, Math.round((metrics.totalUsers / (metrics.totalSalons * 15)) * 100))
        : 0,
      progressClassName: '[&>div]:bg-purple-600',
      footer: (
        <Badge variant="outline" className="w-fit gap-1 text-xs">
          <TrendingUp className="h-3 w-3" />
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
      accent: 'bg-cyan-500/10 text-cyan-600',
      progressValue: activeUserRate,
      progressClassName: '[&>div]:bg-cyan-600',
      footer: (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="secondary" className="cursor-default gap-1">
              <Activity className="h-3.5 w-3.5" />
              {activeUserRate}% engagement rate
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent className="w-72 text-sm text-muted-foreground">
            Active user rate measures engagement over the last 30 days. Target 40%+ for healthy platform activity.
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
      accent: 'bg-blue-500/10 text-blue-600',
      progressValue: Math.min(100, Math.round(metrics.totalAppointments / 50)),
      progressClassName: '[&>div]:bg-blue-600',
      footer: (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs font-medium text-muted-foreground">
              Activity index updates hourly
            </span>
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
      accent: 'bg-emerald-500/10 text-emerald-600',
      progressValue: activeRate,
      progressClassName: '[&>div]:bg-emerald-600',
      footer: (
        <Badge variant="outline" className="w-fit gap-1 text-xs">
          <Activity className="h-3.5 w-3.5" />
          {activeRate}% active rate
        </Badge>
      ),
    },
  ] as const

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Platform metrics</h2>
          <p className="text-sm text-muted-foreground">
            Core KPIs refresh every minute so you can respond quickly.
          </p>
        </div>
        <Badge variant="outline" className="gap-1 text-xs">
          <TrendingUp className="h-3 w-3" />
          Live stats
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(({ key, title, value, description, icon: Icon, accent, progressValue, progressClassName, footer }) => (
          <Card key={key} className="overflow-hidden border border-border/70">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-3xl font-semibold tracking-tight">{value}</CardTitle>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {description}
              </p>

              <div>
                <Progress value={progressValue} className={`h-1.5 ${progressClassName}`} />
                <Separator className="my-3" />
                {footer}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
