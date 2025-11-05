import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { AlertTriangle, BarChart3, Clock, Timer } from 'lucide-react'
import { getQueryPerformance } from '../api/queries'
import { AdminMetricCard } from '@/features/admin/common/components'
import { QueryPerformanceTable } from './query-performance-table'

export async function PerformanceDiagnostics() {
  const snapshot = await getQueryPerformance({ limit: 50, offset: 0 })
  const summaryCards = [
    {
      key: 'total',
      icon: BarChart3,
      title: 'Total Queries',
      value: snapshot.totalCount.toLocaleString(),
      helper: 'Queries analyzed',
    },
    {
      key: 'slow',
      icon: AlertTriangle,
      title: 'Slow Queries',
      value: snapshot.slowQueryCount.toLocaleString(),
      helper: '> 100ms',
    },
    {
      key: 'avg',
      icon: Clock,
      title: 'Avg Mean Time',
      value: `${snapshot.avgMeanTime}ms`,
      helper: 'Average execution time',
    },
  ] as const

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Performance Diagnostics</ItemTitle>
              <ItemDescription>
                Monitor query performance and identify optimization opportunities
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
                <ItemMedia variant="icon">
                  <Timer className="size-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Query Performance Summary</ItemTitle>
                  <ItemDescription>
                    Analyze query execution times and recommended indexes
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <QueryPerformanceTable queries={snapshot.queries} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
