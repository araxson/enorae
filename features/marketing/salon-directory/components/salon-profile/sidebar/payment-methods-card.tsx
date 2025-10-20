import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack, Group } from '@/components/layout'
import { CheckCircle } from 'lucide-react'
import type { Salon } from '../types'

interface PaymentMethodsCardProps {
  salon: Salon
}

export function PaymentMethodsCard({ salon }: PaymentMethodsCardProps) {
  if (!salon.payment_methods?.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          {salon.payment_methods.map((method: string) => (
            <Group gap="xs" key={method}>
              <CheckCircle className="h-4 w-4 text-success" />
              <p className="text-sm text-muted-foreground">{method}</p>
            </Group>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
