'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { LoyaltyTransaction } from '@/features/customer/loyalty/api/queries'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'

type Props = {
  transactions: LoyaltyTransaction[]
  formatNumber: (value: number) => string
}

export function LoyaltyActivityList({ transactions, formatNumber }: Props) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemContent>
              <CardTitle>Recent activity</CardTitle>
            </ItemContent>
            <ItemActions className="flex-none">
              <History className="size-5" aria-hidden="true" />
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No loyalty activity yet</EmptyTitle>
              <EmptyDescription>Earn points by booking appointments or completing promotions.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="gap-2">
            {transactions.map((transaction, index) => (
              <Fragment key={transaction.id}>
                <Item>
                  <ItemContent>
                    <ItemTitle>{transaction.description}</ItemTitle>
                    <ItemDescription>
                      {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="flex-none">
                    <Badge>
                      {transaction.type === 'earned' ? '+' : '-'}
                      {formatNumber(Math.abs(transaction.points))}
                    </Badge>
                  </ItemActions>
                </Item>
                {index < transactions.length - 1 ? <ItemSeparator /> : null}
              </Fragment>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
