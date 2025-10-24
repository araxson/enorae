import { getToastUsage } from './api/queries'
import { ToastUsageTable } from './components/toast-usage-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function ToastStorageAudit() {
  const snapshot = await getToastUsage({ limit: 100, offset: 0 })

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">TOAST Storage Audit</h1>
          <p className="mt-2 text-muted-foreground">
            Analyze TOAST usage and identify optimization opportunities
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High TOAST Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{snapshot.highToastCount}</div>
              <p className="text-xs text-muted-foreground">&gt; 20% bloat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total TOAST</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(snapshot.totalToastBytes)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>TOAST Usage Summary</CardTitle>
            <CardDescription>
              Table bloat and compression recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ToastUsageTable tables={snapshot.tables} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
