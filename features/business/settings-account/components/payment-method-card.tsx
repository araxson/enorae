import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex } from '@/components/layout'
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
      <Stack gap="lg">
        <Flex justify="between" align="center">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Payment Method</h3>
            <p className="text-sm text-muted-foreground">Manage your payment information</p>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </Flex>

        <Separator />

        <Flex gap="md" align="center">
          <div className="flex h-12 w-16 items-center justify-center rounded border bg-white">
            <CreditCard className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="leading-7 font-medium">•••• •••• •••• 4242</p>
            <p className="text-sm text-muted-foreground text-sm">Expires 12/2026</p>
          </div>
          <Badge variant="outline">Default</Badge>
        </Flex>

        <Separator />

        <Flex gap="sm" align="center" className="text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Next billing date:{' '}
            {new Date(subscription.nextBillingDate).toLocaleDateString(
              'en-US',
              {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              },
            )}
          </p>
        </Flex>
      </Stack>
    </Card>
  )
}
