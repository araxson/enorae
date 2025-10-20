import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack, Flex, Box } from '@/components/layout'
import { format } from 'date-fns'
import type { CustomerTransactionWithDetails } from '../api/queries'

interface TransactionCardProps {
  transaction: CustomerTransactionWithDetails
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const transactionDate = new Date(transaction.transaction_at || new Date())

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
      <CardHeader className="p-6 pb-4">
        <Flex justify="between" align="start">
          <Box>
            <CardTitle>{transaction.salon?.name || 'Unknown Salon'}</CardTitle>
            <CardDescription>
              {format(transactionDate, 'PPP')} at {format(transactionDate, 'p')}
            </CardDescription>
          </Box>
          <Badge variant={getTypeColor(transaction.transaction_type)}>
            {transaction.transaction_type || 'Unknown'}
          </Badge>
        </Flex>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Stack gap="md">
          {transaction.staff && (
            <Box>
              <p className="text-sm text-muted-foreground">Staff Member</p>
              <p className="leading-7">{transaction.staff.full_name}</p>
            </Box>
          )}

          {transaction.payment_method && (
            <Box>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="leading-7 capitalize">{transaction.payment_method}</p>
            </Box>
          )}

          {transaction.appointment && (
            <Box>
              <p className="text-sm text-muted-foreground">Related Appointment</p>
              <small className="text-sm font-medium leading-none">
                {format(new Date(transaction.appointment.scheduled_at || ''), 'PPP')}
              </small>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
