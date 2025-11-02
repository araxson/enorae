import { Calendar, CreditCard } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import type { Subscription } from '../types'

export function PaymentMethodCard({
  subscription,
}: {
  subscription: Subscription
}) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader className="flex items-center justify-between">
        <div>
          <ItemTitle>Payment Method</ItemTitle>
          <ItemDescription>Manage your payment information</ItemDescription>
        </div>
        <Button variant="outline" size="sm">
          Update
        </Button>
      </ItemHeader>
      <ItemContent className="flex flex-col gap-6">
        <Separator />

        <div className="flex items-center gap-6">
          <Avatar className="size-12">
            <AvatarFallback>
              <CreditCard className="size-5" />
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
          <Calendar className="size-4 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            Next billing date:{' '}
            {new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      </ItemContent>
    </Item>
  )
}
