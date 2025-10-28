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
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Briefcase, CreditCard, Calendar as CalendarIcon } from 'lucide-react'
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
        <CardTitle>{transaction.salon?.name || 'Unknown Salon'}</CardTitle>
        <CardDescription>
          {format(transactionDate, 'PPP')} at {format(transactionDate, 'p')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Badge variant={getTypeColor(transaction.transaction_type || null)}>
            {transaction.transaction_type || 'Unknown'}
          </Badge>
        </div>
        <ItemGroup className="gap-3">
          {transaction.staff ? (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Briefcase className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Staff member</ItemTitle>
                <p className="text-sm text-foreground">{transaction.staff.full_name}</p>
              </ItemContent>
            </Item>
          ) : null}

          {transaction.payment_method ? (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <CreditCard className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Payment method</ItemTitle>
                <p className="capitalize text-sm text-foreground">{transaction.payment_method}</p>
              </ItemContent>
            </Item>
          ) : null}

          {transaction.appointment ? (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <CalendarIcon className="size-4" aria-hidden="true" />
              </ItemMedia>
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
