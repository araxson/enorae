import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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
        <div className="flex flex-col gap-3">
          {salon.payment_methods.map((method: string) => (
            <div key={method} className="flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">{method}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
