import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'
import type { Invoice } from './billing-subscription-form'

export function InvoiceHistoryCard({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold">Invoice History</h3>
          <p className="text-sm text-muted-foreground">Download your past invoices</p>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex gap-4 items-center justify-between py-2"
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
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
