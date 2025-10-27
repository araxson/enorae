import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { MessageReportSummary } from '@/features/admin/messages/api/queries'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'

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
        <ItemGroup className="space-y-3">
          <Item>
            <ItemContent>
              <ItemDescription>Total reports</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none">
              <p className="text-xl font-semibold">{totalReports}</p>
            </ItemActions>
          </Item>
          <Separator />
          <Item>
            <ItemContent>
              <ItemDescription>Open reports</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none">
              <p className="text-lg font-semibold text-destructive">{openReports}</p>
            </ItemActions>
          </Item>
          <Item>
            <ItemContent>
              <ItemDescription>Pending moderator review</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none">
              <p className="text-lg font-semibold text-accent">{pendingReports}</p>
            </ItemActions>
          </Item>
          <Item>
            <ItemContent>
              <ItemDescription>Resolved</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none">
              <p className="text-lg font-semibold text-primary">{resolvedReports}</p>
            </ItemActions>
          </Item>
        </ItemGroup>

        <p className="text-xs text-muted-foreground">
          Reports include customer escalations, automated abuse detections, and staff-submitted issues.
          Prioritise open and pending cases to maintain response SLAs.
        </p>
      </CardContent>
    </Card>
  )
}
