import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, CreditCard } from 'lucide-react'
import type { Subscription } from '../types'

export function PaymentMethodCard({
  subscription,
}: {
  subscription: Subscription
}) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Update
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Separator />

        <div className="flex items-center gap-6">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              <CreditCard className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
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
            {new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
