import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import type { CustomerTransactionWithDetails } from '@/features/customer/transactions/api/queries'

interface TransactionCardProps {
  transaction: CustomerTransactionWithDetails
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const transactionDate = new Date(transaction['transaction_at'] || new Date())

  const getTypeColor = (type: string | null): "default" | "destructive" | "secondary" | "outline" => {
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
            <CardTitle>{transaction.salon?.['name'] || 'Unknown Salon'}</CardTitle>
            <CardDescription>
              {format(transactionDate, 'PPP')} at {format(transactionDate, 'p')}
            </CardDescription>
          </div>
          <Badge variant={getTypeColor(transaction['transaction_type'])}>
            {transaction['transaction_type'] || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {transaction.staff && (
            <div>
              <p className="text-sm text-muted-foreground">Staff Member</p>
              <p className="leading-7">{transaction.staff['full_name']}</p>
            </div>
          )}

          {transaction['payment_method'] && (
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="leading-7 capitalize">{transaction['payment_method']}</p>
            </div>
          )}

          {transaction.appointment && (
            <div>
              <p className="text-sm text-muted-foreground">Related Appointment</p>
              <p className="text-sm">
                {format(new Date(transaction.appointment.scheduled_at || ''), 'PPP')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
