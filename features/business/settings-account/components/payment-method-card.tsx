import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex } from '@/components/layout'
import { H3, Muted, P } from '@/components/ui/typography'
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
            <H3>Payment Method</H3>
            <Muted>Manage your payment information</Muted>
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
            <P className="font-medium">•••• •••• •••• 4242</P>
            <Muted className="text-sm">Expires 12/2026</Muted>
          </div>
          <Badge variant="outline">Default</Badge>
        </Flex>

        <Separator />

        <Flex gap="sm" align="center" className="text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Muted>
            Next billing date:{' '}
            {new Date(subscription.nextBillingDate).toLocaleDateString(
              'en-US',
              {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              },
            )}
          </Muted>
        </Flex>
      </Stack>
    </Card>
  )
}
