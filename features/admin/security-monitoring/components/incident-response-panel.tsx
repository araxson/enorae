import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SecurityIncident } from '@/features/admin/security-monitoring/api/types'

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
  RESPONSE_GUIDANCE[severity.toLowerCase()] ?? RESPONSE_GUIDANCE.info

export function IncidentResponsePanel({ incidents }: IncidentResponsePanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <CardTitle>Security Incident Response</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <CardDescription>No active security incidents detected.</CardDescription>
        ) : (
          <div className="flex flex-col gap-2">
            {incidents.slice(0, 6).map((incident) => (
              <Card key={incident.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{incident.eventType}</CardTitle>
                    {severityBadge(incident.severity)}
                  </div>
                  <CardDescription>
                    Detected at {new Date(incident.createdAt).toLocaleString()} · IP {incident.ipAddress ?? 'Unknown'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {incident.description ? (
                      <CardDescription>{incident.description}</CardDescription>
                    ) : null}
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      <CardDescription>{guidanceFor(incident.severity)}</CardDescription>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
