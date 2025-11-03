import { Download } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import type { Invoice } from '../api/types'

export function InvoiceHistoryCard({ invoices }: { invoices: Invoice[] }) {
  return (
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <ItemTitle>Invoice History</ItemTitle>
        <ItemDescription>Download your past invoices</ItemDescription>
      </ItemHeader>
      <ItemContent className="flex flex-col gap-6">
        <Separator />
        <div className="flex flex-col gap-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex gap-4 items-center justify-between py-2">
              <div className="flex-1">
                <div className="font-medium">{invoice.id}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(invoice.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-medium">${invoice.amount}</div>
                <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                  {invoice.status}
                </Badge>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ItemContent>
    </Item>
  )
}
