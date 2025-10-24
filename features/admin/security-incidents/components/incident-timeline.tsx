'use client'

import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SecurityIncidentRecord } from '@/features/admin/security-incidents/api/queries'

interface IncidentTimelineProps {
  incidents: SecurityIncidentRecord[]
}

export function IncidentTimeline({ incidents }: IncidentTimelineProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'warning':
        return <Badge variant="outline">Warning</Badge>
      case 'info':
        return <Badge variant="secondary">Info</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge variant="secondary">Resolved</Badge>
      case 'in_progress':
        return <Badge variant="outline">In Progress</Badge>
      case 'pending':
        return <Badge variant="default">Pending</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {incidents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No incidents recorded</p>
          </CardContent>
        </Card>
      ) : (
        incidents.map((incident) => (
          <Card key={incident.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{incident.event_type}</CardTitle>
                  <CardDescription>
                    {format(new Date(incident.occurred_at), 'PPp')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {getSeverityBadge(incident.severity)}
                  {getStatusBadge(incident.remediation_status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{incident.description}</p>
              {incident.impacted_resources.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1">Impacted Resources:</p>
                  <div className="flex flex-wrap gap-2">
                    {incident.impacted_resources.map((resource) => (
                      <Badge key={resource} variant="outline" className="text-xs">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {incident.user_email && (
                <p className="text-xs text-muted-foreground">User: {incident.user_email}</p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
