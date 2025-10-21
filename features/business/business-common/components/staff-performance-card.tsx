'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Calendar, DollarSign } from 'lucide-react'

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
        {description && <p className="text-sm text-muted-foreground text-sm">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {topStaff.map((member, index) => (
            <div key={member.id} className="flex gap-4 items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex gap-4 items-center flex-1">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center text-sm font-semibold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <Avatar>
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  {member.title && (
                    <small className="text-sm font-medium leading-none text-muted-foreground">{member.title}</small>
                  )}
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2 w-52">
                <div className="flex gap-2 items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <small className="text-sm font-medium leading-none font-medium">{member.appointmentCount}</small>
                </div>

                <div className="flex gap-2 items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <small className="text-sm font-medium leading-none font-medium">{formatCurrency(member.totalRevenue)}</small>
                </div>
              </div>

              {member.trend && member.trendPercentage !== undefined && (
                <Badge
                  variant={member.trend === 'up' ? 'default' : member.trend === 'down' ? 'destructive' : 'secondary'}
                  className="ml-2"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {member.trendPercentage}%
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
