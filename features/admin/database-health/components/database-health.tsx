import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import { AlertCircle } from 'lucide-react'
import { PerformanceDiagnostics } from '@/features/admin/database-performance'
import { StatsFreshnessMonitor } from '@/features/admin/statistics-freshness'
import { ToastStorageAudit } from '@/features/admin/database-toast'
import { getDatabaseHealthSnapshot } from '../api/queries'
import { DatabaseHealthPanel } from './database-health-panel'
import { HealthOverview } from './health-overview'
import { OptimizationPanel } from './optimization-panel'
import { QueryPerformancePanel } from './query-performance-panel'
import { SchemaValidationPanel } from './schema-validation-panel'

export function DatabaseHealthDashboard() {
  return (
    <div className="space-y-8 py-8 md:py-12">
      <PerformanceDiagnostics />
      <StatsFreshnessMonitor />
      <ToastStorageAudit />
    </div>
  )
}

export async function DatabaseHealth() {
  try {
    const snapshot = await getDatabaseHealthSnapshot()

    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <ItemGroup className="gap-6">
            <Item variant="muted" className="flex-col items-start gap-2">
              <ItemContent>
                <CardTitle>Database Health Monitor</CardTitle>
                <CardDescription>
                  Observe schema validation, database performance, and storage signals in real
                  time.
                </CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>

          <div className="mt-6 flex flex-col gap-6">
            <HealthOverview snapshot={snapshot} />
            <SchemaValidationPanel data={snapshot.schemaValidation} />
            <QueryPerformancePanel data={snapshot.queryPerformance} />
            <DatabaseHealthPanel data={snapshot.databaseHealth} />
            <OptimizationPanel data={snapshot.optimization} />
          </div>
        </div>
      </section>
    )
  } catch (error) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load database health data'}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }
}
