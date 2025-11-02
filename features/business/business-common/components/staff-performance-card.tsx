'use client'

import { Fragment } from 'react'
import { TrendingUp, Calendar, DollarSign } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface StaffPerformanceCardProps {
  staff: {
    id: string
    name: string
    title?: string | null
    avatar?: string | null
    appointmentCount: number
    totalRevenue: number
    trend?: 'up' | 'down' | 'stable'
    trendPercentage?: number
  }[]
  title?: string
  description?: string
  limit?: number
}

export function StaffPerformanceCard({
  staff,
  title = 'Top Performing Staff',
  description = 'Based on appointments and revenue',
  limit = 5
}: StaffPerformanceCardProps) {
  const topStaff = staff.slice(0, limit)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (topStaff.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No staff performance data</EmptyTitle>
              <EmptyDescription>Performance analytics will appear once activity is recorded.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ItemGroup className="space-y-3">
          {topStaff.map((member, index) => (
            <Fragment key={member.id}>
              <Item variant="outline" size="sm" className="items-center transition-colors hover:bg-muted/50">
                <ItemMedia className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center text-sm font-semibold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <Avatar>
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback>
                      {member.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="flex-1">
                  <ItemTitle>{member.name}</ItemTitle>
                  {member.title ? <ItemDescription>{member.title}</ItemDescription> : null}
                </ItemContent>
                <ItemActions className="grid w-52 grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{member.appointmentCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{formatCurrency(member.totalRevenue)}</span>
                  </div>
                </ItemActions>
                {member.trend && member.trendPercentage !== undefined ? (
                  <Badge
                    variant={
                      member.trend === 'up' ? 'default' : member.trend === 'down' ? 'destructive' : 'secondary'
                    }
                    className="ml-2"
                  >
                    <TrendingUp className="mr-1 size-3" />
                    {member.trendPercentage}%
                  </Badge>
                ) : null}
              </Item>
              {index < topStaff.length - 1 ? <Separator /> : null}
            </Fragment>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
