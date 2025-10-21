'use client'

import { Card, CardContent } from '@/components/ui/card'
const formatTotal = (total: number) => `$${total.toFixed(2)}`

type Props = {
  totalAmount: number
}

export function OrderTotalCard({ totalAmount }: Props) {
  return (
    <Card>
      <CardContent>
        <div className="flex gap-4 items-center justify-between">
          <p className="leading-7 font-semibold">Total Order Amount</p>
          <p className="leading-7 text-xl font-bold">{formatTotal(totalAmount)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
