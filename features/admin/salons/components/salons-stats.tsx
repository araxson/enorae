'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Flex } from '@/components/layout'
import { P } from '@/components/ui/typography'
import { Building2, CheckCircle, TrendingUp } from 'lucide-react'

type SalonsStatsProps = {
  stats: {
    total: number
    active: number
    byTier: Record<string, number>
    byType: Record<string, number>
  }
}

export function SalonsStats({ stats }: SalonsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <div>
              <P className="text-sm text-muted-foreground">Total Salons</P>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Building2 className="h-4 w-4 text-blue-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <div>
              <P className="text-sm text-muted-foreground">Accepting Bookings</P>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <div>
              <P className="text-sm text-muted-foreground">Premium Tier</P>
              <p className="text-2xl font-bold">{stats.byTier.premium || 0}</p>
            </div>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div>
            <P className="text-sm text-muted-foreground mb-2">By Tier</P>
            <div className="space-y-1">
              {Object.entries(stats.byTier).map(([tier, count]) => (
                <div key={tier} className="flex justify-between text-xs">
                  <span className="capitalize">{tier}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
