import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { AlertTriangle, Database } from 'lucide-react'
import { getStatisticsFreshness } from '../api/queries'
import { AdminMetricCard } from '@/features/admin/admin-common/components'
import { FreshnessTable } from './freshness-table'

export async function StatsFreshnessMonitor() {
  const snapshot = await getStatisticsFreshness({ limit: 100, offset: 0 })
  const summaryCards = [
    {
      key: 'total',
      icon: Database,
      title: 'Total Tables',
      value: snapshot.totalCount.toLocaleString(),
      helper: 'Total monitored tables',
    },
    {
      key: 'stale',
      icon: AlertTriangle,
      title: 'Stale Statistics',
      value: snapshot.staleCount.toLocaleString(),
      helper: 'Maintenance needed',
    },
  ] as const

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Stats Freshness Monitor</ItemTitle>
              <ItemDescription>
                Monitor table statistics freshness and trigger maintenance
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
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
                  <ItemTitle>Table Statistics</ItemTitle>
                  <ItemDescription>
                    Last analyze timestamp and maintenance recommendations
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <FreshnessTable tables={snapshot.tables} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
