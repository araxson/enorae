'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Flex } from '@/components/layout'
const formatTotal = (total: number) => `$${total.toFixed(2)}`

type Props = {
  totalAmount: number
}

export function OrderTotalCard({ totalAmount }: Props) {
  return (
    <Card>
      <CardContent>
        <Flex justify="between" align="center">
          <p className="leading-7 font-semibold">Total Order Amount</p>
          <p className="leading-7 text-xl font-bold">{formatTotal(totalAmount)}</p>
        </Flex>
      </CardContent>
    </Card>
  )
}
