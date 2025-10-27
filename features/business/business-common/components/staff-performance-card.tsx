'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

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
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">No staff performance data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {topStaff.map((member, index) => (
            <Fragment key={member.id}>
              <article className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-muted/50">
                <div className="flex flex-1 items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center text-sm font-semibold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <Avatar>
                      <AvatarImage src={member.avatar || undefined} />
                      <AvatarFallback>
                        {member.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">{member.name}</div>
                    {member.title ? (
                      <p className="text-sm font-medium text-muted-foreground">{member.title}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid w-52 grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{member.appointmentCount}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{formatCurrency(member.totalRevenue)}</p>
                  </div>
                </div>

                {member.trend && member.trendPercentage !== undefined ? (
                  <Badge
                    variant={
                      member.trend === 'up' ? 'default' : member.trend === 'down' ? 'destructive' : 'secondary'
                    }
                    className="ml-2"
                  >
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {member.trendPercentage}%
                  </Badge>
                ) : null}
              </article>
              {index < topStaff.length - 1 ? <Separator /> : null}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
