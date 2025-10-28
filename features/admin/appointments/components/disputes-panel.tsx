import { Scale } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { DisputeCandidate } from '@/features/admin/appointments/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface DisputesPanelProps {
  disputes: DisputeCandidate[]
}

const formatCurrency = (value: number | null) => {
  if (!value) return '$0'
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function DisputesPanel({ disputes }: DisputesPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <ItemGroup>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <Scale className="h-4 w-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Dispute Queue</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-3">
        {disputes.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No high-risk appointments</EmptyTitle>
              <EmptyDescription>The dispute queue fills when appointments trigger elevated risk checks.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-2">
            {disputes.slice(0, 6).map((item) => (
              <Alert key={item.appointmentId} variant="default">
                <Scale className="h-4 w-4" />
                <ItemGroup>
                  <Item className="items-start gap-2" variant="muted" size="sm">
                    <ItemContent>
                      <AlertTitle>{item.customerName || 'Unknown customer'}</AlertTitle>
                      <AlertDescription>
                        {item.salonName || 'Unknown salon'} · {formatCurrency(item.amount)}
                      </AlertDescription>
                      <AlertDescription className="mt-1">{item.reason}</AlertDescription>
                      <AlertDescription className="mt-1 font-medium">
                        Recommended: {item.recommendedAction}
                      </AlertDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant="secondary">
                        {(item.status || '').replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                      </Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
