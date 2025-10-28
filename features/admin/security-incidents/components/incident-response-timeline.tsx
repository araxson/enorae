import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { AlertTriangle, ShieldAlert, Timer } from 'lucide-react'
import { getSecurityIncidents } from '../api/queries'
import { AdminMetricCard } from '@/features/admin/admin-common/components'
import { IncidentTimeline } from './incident-timeline'

export async function IncidentResponseTimeline() {
  const snapshot = await getSecurityIncidents({ limit: 100, offset: 0 })
  const summaryCards = [
    {
      key: 'total',
      icon: ShieldAlert,
      title: 'Total Incidents',
      value: snapshot.totalCount.toLocaleString(),
      helper: 'All recorded incidents',
    },
    {
      key: 'critical',
      icon: AlertTriangle,
      title: 'Critical',
      value: snapshot.criticalCount.toLocaleString(),
      valueAdornment: <Badge variant="destructive">Critical</Badge>,
      helper: 'Highest priority cases',
    },
    {
      key: 'pending',
      icon: Timer,
      title: 'Pending',
      value: snapshot.pendingCount.toLocaleString(),
      valueAdornment: <Badge variant="secondary">Pending</Badge>,
      helper: 'Awaiting resolution',
    },
  ] as const

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Incident Response Timeline</ItemTitle>
              <ItemDescription>
                Track security incidents and manage remediation status
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {summaryCards.map(({ key, icon, ...card }) => {
            const Icon = icon
            return (
              <AdminMetricCard
                key={key}
                icon={<Icon className="size-5" aria-hidden="true" />}
                {...card}
              />
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemTitle>Incident Log</ItemTitle>
                  <ItemDescription>
                    Recent security incidents and their remediation status
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <IncidentTimeline incidents={snapshot.incidents} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
