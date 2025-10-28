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
    <div className="h-full">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Report Resolution</CardTitle>
                <CardDescription>Escalations and user reports across all threads</CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <ItemGroup>
                <Item>
                  <ItemContent>
                    <ItemDescription>Total reports</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className="text-xl font-semibold">{totalReports}</span>
                  </ItemActions>
                </Item>
              </ItemGroup>
              <Separator />
              <ItemGroup>
                <Item>
                  <ItemContent>
                    <ItemDescription>Open reports</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className="text-lg font-semibold text-destructive">{openReports}</span>
                  </ItemActions>
                </Item>
                <Item>
                  <ItemContent>
                    <ItemDescription>Pending moderator review</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className="text-lg font-semibold text-accent">{pendingReports}</span>
                  </ItemActions>
                </Item>
                <Item>
                  <ItemContent>
                    <ItemDescription>Resolved</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className="text-lg font-semibold text-primary">{resolvedReports}</span>
                  </ItemActions>
                </Item>
              </ItemGroup>
            </div>

            <p className="text-xs text-muted-foreground">
              Reports include customer escalations, automated abuse detections, and staff-submitted
              issues. Prioritise open and pending cases to maintain response SLAs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
