
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getDatabaseHealthSnapshot } from './api/queries'
import { HealthOverview } from './components/health-overview'
import { QueryPerformancePanel } from './components/query-performance-panel'
import { DatabaseHealthPanel } from './components/database-health-panel'
import { SchemaValidationPanel } from './components/schema-validation-panel'
import { OptimizationPanel } from './components/optimization-panel'

export async function DatabaseHealth() {
  try {
    const snapshot = await getDatabaseHealthSnapshot()

    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Database Health Monitor</h1>

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
              {error instanceof Error
                ? error.message
                : 'Failed to load database health data'}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }
}
