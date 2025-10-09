import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SecurityIncident } from '../api/types'

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
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          Security Incident Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {incidents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active security incidents detected.
          </p>
        ) : (
          <ul className="space-y-2">
            {incidents.slice(0, 6).map((incident) => (
              <li key={incident.id} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-foreground">{incident.eventType}</div>
                  {severityBadge(incident.severity)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Detected at {new Date(incident.createdAt).toLocaleString()} · IP {incident.ipAddress ?? 'Unknown'}
                </div>
                {incident.description && (
                  <div className="mt-2 text-xs text-muted-foreground">{incident.description}</div>
                )}
                <div className="mt-3 flex items-center gap-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                  {guidanceFor(incident.severity)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
