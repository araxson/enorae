import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { SecurityIncident } from '@/features/admin/security-monitoring/api/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'

interface IncidentResponsePanelProps {
  incidents: SecurityIncident[]
}

const RESPONSE_GUIDANCE: Record<string, string> = {
  critical: 'Escalate immediately. Initiate incident response protocol and notify engineering.',
  high: 'Investigate within the hour. Validate impact and contain affected accounts.',
  info: 'Monitor for follow-up actions.',
  warning: 'Review event details and tighten relevant controls.',
}

const severityBadge = (severity: string) => {
  const normalized = severity.toLowerCase()
  if (normalized === 'critical') return <Badge variant="destructive">Critical</Badge>
  if (normalized === 'high') return <Badge variant="secondary">High</Badge>
  if (normalized === 'warning') return <Badge variant="outline">Warning</Badge>
  return <Badge variant="outline">Info</Badge>
}

const guidanceFor = (severity: string) =>
  RESPONSE_GUIDANCE[severity.toLowerCase()] ?? RESPONSE_GUIDANCE['info']

export function IncidentResponsePanel({ incidents }: IncidentResponsePanelProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted" className="items-center gap-2">
            <ItemContent className="flex items-center gap-2">
              <ShieldCheck className="size-4" aria-hidden="true" />
              <CardTitle>Security Incident Response</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No active security incidents</EmptyTitle>
              <EmptyDescription>Response tasks populate automatically when new incidents trigger.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="flex-col gap-2">
            {incidents.slice(0, 6).map((incident) => (
              <Alert
                key={incident['id']}
                variant={incident['severity'].toLowerCase() === 'critical' ? 'destructive' : 'default'}
              >
                <AlertTriangle className="size-4" />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <AlertTitle>{incident.eventType}</AlertTitle>
                    <AlertDescription>
                      <p>
                        Detected at {new Date(incident.createdAt).toLocaleString()} · IP{' '}
                        {incident.ipAddress ?? 'Unknown'}
                      </p>
                      {incident['description'] ? (
                        <p className="mt-1">{incident['description']}</p>
                      ) : null}
                      <p className="mt-2 font-medium text-foreground">
                        {guidanceFor(incident['severity'])}
                      </p>
                    </AlertDescription>
                  </div>
                  {severityBadge(incident['severity'])}
                </div>
              </Alert>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
