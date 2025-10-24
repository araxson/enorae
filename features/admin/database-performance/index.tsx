import { getQueryPerformance } from './api/queries'
import { QueryPerformanceTable } from './components/query-performance-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function PerformanceDiagnostics() {
  const snapshot = await getQueryPerformance({ limit: 50, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Performance Diagnostics</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor query performance and identify optimization opportunities
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Slow Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{snapshot.slowQueryCount}</div>
              <p className="text-xs text-muted-foreground">&gt; 100ms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Mean Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{snapshot.avgMeanTime}ms</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Query Performance Summary</CardTitle>
            <CardDescription>
              Analyze query execution times and recommended indexes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QueryPerformanceTable queries={snapshot.queries} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
