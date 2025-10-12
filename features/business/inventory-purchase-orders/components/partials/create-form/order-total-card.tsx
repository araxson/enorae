'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Flex } from '@/components/layout'
import { P } from '@/components/ui/typography'

const formatTotal = (total: number) => `$${total.toFixed(2)}`

type Props = {
  totalAmount: number
}

export function OrderTotalCard({ totalAmount }: Props) {
  return (
    <Card>
      <CardContent>
        <Flex justify="between" align="center">
          <P className="font-semibold">Total Order Amount</P>
          <P className="text-xl font-bold">{formatTotal(totalAmount)}</P>
        </Flex>
      </CardContent>
    </Card>
  )
}
