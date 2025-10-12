import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex } from '@/components/layout'
import { H3, Muted, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'
import type { Invoice } from './billing-subscription-form'

export function InvoiceHistoryCard({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card className="p-6">
      <Stack gap="lg">
        <div>
          <H3>Invoice History</H3>
          <Muted>Download your past invoices</Muted>
        </div>

        <Separator />

        <Stack gap="sm">
          {invoices.map((invoice) => (
            <Flex
              key={invoice.id}
              justify="between"
              align="center"
              className="py-2"
            >
              <div className="flex-1">
                <P className="font-medium">{invoice.id}</P>
                <Muted className="text-sm">
                  {new Date(invoice.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Muted>
              </div>
              <div className="flex items-center gap-4">
                <P className="font-medium">${invoice.amount}</P>
                <Badge
                  variant={invoice.status === 'paid' ? 'default' : 'destructive'}
                >
                  {invoice.status}
                </Badge>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </Flex>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}
