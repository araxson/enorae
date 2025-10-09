import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { MessageReportSummary } from '../api/queries'

interface MessagesReportSummaryProps {
  summary: MessageReportSummary
}

export function MessagesReportSummary({ summary }: MessagesReportSummaryProps) {
  const { totalReports, openReports, resolvedReports, pendingReports } = summary

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Report Resolution</CardTitle>
        <CardDescription>Escalations and user reports across all threads</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total reports</p>
            <p className="text-xl font-semibold">{totalReports}</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Open reports</p>
            <p className="text-lg font-semibold text-orange-500">{openReports}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending moderator review</p>
            <p className="text-lg font-semibold text-amber-500">{pendingReports}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-lg font-semibold text-emerald-600">{resolvedReports}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Reports include customer escalations, automated abuse detections, and staff-submitted issues.
          Prioritise open and pending cases to maintain response SLAs.
        </p>
      </CardContent>
    </Card>
  )
}
