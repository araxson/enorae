import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { CustomerTransactionWithDetails } from '@/features/customer/transactions/api/queries'

interface TransactionCardProps {
  transaction: CustomerTransactionWithDetails
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const transactionDate = transaction.transaction_at
    ? new Date(transaction.transaction_at)
    : new Date()

  const getTypeColor = (
    type: string | null,
  ): 'default' | 'destructive' | 'secondary' | 'outline' => {
    if (!type) return 'outline'
    switch (type.toLowerCase()) {
      case 'sale':
        return 'default'
      case 'refund':
        return 'destructive'
      case 'adjustment':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{transaction.salon?.name || 'Unknown Salon'}</CardTitle>
            <CardDescription>
              {format(transactionDate, 'PPP')} at {format(transactionDate, 'p')}
            </CardDescription>
          </div>
          <Badge variant={getTypeColor(transaction.transaction_type || null)}>
            {transaction.transaction_type || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {transaction.staff ? (
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Staff member</ItemTitle>
                <ItemDescription className="text-foreground">
                  {transaction.staff.full_name}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}

          {transaction.payment_method ? (
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Payment method</ItemTitle>
                <ItemDescription className="capitalize">
                  {transaction.payment_method}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}

          {transaction.appointment ? (
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Related appointment</ItemTitle>
                <ItemDescription>
                  {transaction.appointment.start_time
                    ? format(new Date(transaction.appointment.start_time), 'PPP')
                    : 'Scheduled time unavailable'}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
