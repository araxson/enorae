import { getSecurityIncidents } from './api/queries'
import { IncidentTimeline } from './components/incident-timeline'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function IncidentResponseTimeline() {
  const snapshot = await getSecurityIncidents({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Incident Response Timeline</h1>
          <p className="mt-2 text-muted-foreground">
            Track security incidents and manage remediation status
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{snapshot.criticalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{snapshot.pendingCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Incident Log</CardTitle>
            <CardDescription>Recent security incidents and their remediation status</CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentTimeline incidents={snapshot.incidents} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
