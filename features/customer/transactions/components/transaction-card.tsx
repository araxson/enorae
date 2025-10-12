import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Stack, Flex, Box } from '@/components/layout'
import { H3, P, Small, Muted } from '@/components/ui/typography'
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
    <Card className="p-6">
      <Stack gap="md">
        <Flex justify="between" align="start">
          <Box>
            <H3>{transaction.salon?.name || 'Unknown Salon'}</H3>
            <Small className="text-muted-foreground">
              {format(transactionDate, 'PPP')} at {format(transactionDate, 'p')}
            </Small>
          </Box>
          <Badge variant={getTypeColor(transaction.transaction_type)}>
            {transaction.transaction_type || 'Unknown'}
          </Badge>
        </Flex>

        {transaction.staff && (
          <Box>
            <Muted>Staff Member</Muted>
            <P>{transaction.staff.full_name}</P>
          </Box>
        )}

        {transaction.payment_method && (
          <Box>
            <Muted>Payment Method</Muted>
            <P className="capitalize">{transaction.payment_method}</P>
          </Box>
        )}

        {transaction.appointment && (
          <Box>
            <Muted>Related Appointment</Muted>
            <Small>
              {format(new Date(transaction.appointment.scheduled_at || ''), 'PPP')}
            </Small>
          </Box>
        )}
      </Stack>
    </Card>
  )
}
