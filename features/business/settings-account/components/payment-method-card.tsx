import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calendar, CreditCard } from 'lucide-react'
import type { Subscription } from './billing-subscription-form'

export function PaymentMethodCard({
  subscription,
}: {
  subscription: Subscription
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-semibold">Payment Method</div>
            <div className="text-sm text-muted-foreground">Manage your payment information</div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>

        <Separator />

        <div className="flex items-center gap-6">
          <div className="flex h-12 w-16 items-center justify-center rounded border bg-card">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-medium">•••• •••• •••• 4242</div>
            <div className="text-sm text-muted-foreground">Expires 12/2026</div>
          </div>
          <Badge variant="outline">Default</Badge>
        </div>

        <Separator />

        <div className="flex items-center gap-4 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            Next billing date:{' '}
            {new Date(subscription.nextBillingDate).toLocaleDateString(
              'en-US',
              {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              },
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
