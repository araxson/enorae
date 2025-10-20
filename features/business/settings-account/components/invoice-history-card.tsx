import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex } from '@/components/layout'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'
import type { Invoice } from './billing-subscription-form'

export function InvoiceHistoryCard({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card className="p-6">
      <Stack gap="lg">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Invoice History</h3>
          <p className="text-sm text-muted-foreground">Download your past invoices</p>
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
                <p className="leading-7 font-medium">{invoice.id}</p>
                <p className="text-sm text-muted-foreground text-sm">
                  {new Date(invoice.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="leading-7 font-medium">${invoice.amount}</p>
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
