import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { AlertTriangle, Database, Layers, Package } from 'lucide-react'
import { getToastUsage } from '../api/queries'
import { AdminMetricCard } from '@/features/admin/admin-common/components'
import { ToastUsageTable } from './toast-usage-table'

export async function ToastStorageAudit() {
  const snapshot = await getToastUsage({ limit: 100, offset: 0 })

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }
  const summaryCards = [
    {
      key: 'totalTables',
      icon: Database,
      title: 'Total Tables',
      value: snapshot.totalCount.toLocaleString(),
      helper: 'Tables analyzed',
    },
    {
      key: 'highUsage',
      icon: AlertTriangle,
      title: 'High TOAST Usage',
      value: snapshot.highToastCount.toLocaleString(),
      valueAdornment: <Badge variant="destructive">High usage</Badge>,
      helper: '> 20% bloat',
    },
    {
      key: 'totalToast',
      icon: Package,
      title: 'Total TOAST',
      value: formatBytes(snapshot.totalToastBytes),
      helper: 'Total compressed storage',
    },
  ] as const

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>TOAST Storage Audit</ItemTitle>
              <ItemDescription>
                Analyze TOAST usage and identify optimization opportunities
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
                  <Layers className="size-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>TOAST Usage Summary</ItemTitle>
                  <ItemDescription>
                    Table bloat and compression recommendations
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ToastUsageTable tables={snapshot.tables} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
