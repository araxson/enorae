'use client'

import { format } from 'date-fns'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
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

  if (incidents.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No incidents recorded</EmptyTitle>
          <EmptyDescription>
            Security incidents will appear here when detected
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {incidents.map((incident) => (
        <AccordionItem value={incident.id} key={incident.id} className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-3 text-left">
                <span className="font-medium">{incident.event_type}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(incident.occurred_at), 'PPp')}
                </span>
              </div>
              <div className="flex gap-2">
                {getSeverityBadge(incident.severity)}
                {getStatusBadge(incident.remediation_status)}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 pb-4 space-y-3">
              <p className="text-sm">{incident.description}</p>
              {incident.impacted_resources.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1">Impacted Resources:</p>
                  <div className="flex flex-wrap gap-2">
                    {incident.impacted_resources.map((resource) => (
                      <Badge key={resource} variant="outline">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {incident.user_email && (
                <p className="text-xs text-muted-foreground">User: {incident.user_email}</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
