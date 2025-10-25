import { getStatisticsFreshness } from './api/queries'
import { FreshnessTable } from './components/freshness-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function StatsFreshnessMonitor() {
  const snapshot = await getStatisticsFreshness({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Stats Freshness Monitor</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor table statistics freshness and trigger maintenance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Stale Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{snapshot.staleCount}</div>
              <p className="text-xs text-muted-foreground">Maintenance needed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Table Statistics</CardTitle>
            <CardDescription>
              Last analyze timestamp and maintenance recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FreshnessTable tables={snapshot.tables} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
