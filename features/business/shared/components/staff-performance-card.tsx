'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Stack, Grid, Flex, Box } from '@/components/layout'
import { Small, Muted } from '@/components/ui/typography'
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
        <CardContent className="flex items-center justify-center h-[200px]">
          <Muted>No staff performance data available</Muted>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <Muted className="text-sm">{description}</Muted>}
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {topStaff.map((member, index) => (
            <Flex key={member.id} justify="between" align="center" className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Flex gap="md" align="center" className="flex-1">
                <Box className="flex items-center gap-3">
                  <Small className="text-muted-foreground min-w-[20px] text-center font-semibold">
                    #{index + 1}
                  </Small>
                  <Avatar>
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Box>

                <Box className="flex-1">
                  <Box className="font-medium">{member.name}</Box>
                  {member.title && (
                    <Small className="text-muted-foreground">{member.title}</Small>
                  )}
                </Box>
              </Flex>

              <Grid cols={2} gap="md" className="min-w-[200px]">
                <Flex align="center" gap="xs">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Small className="font-medium">{member.appointmentCount}</Small>
                </Flex>

                <Flex align="center" gap="xs">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Small className="font-medium">{formatCurrency(member.totalRevenue)}</Small>
                </Flex>
              </Grid>

              {member.trend && member.trendPercentage !== undefined && (
                <Badge
                  variant={member.trend === 'up' ? 'default' : member.trend === 'down' ? 'destructive' : 'secondary'}
                  className="ml-2"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {member.trendPercentage}%
                </Badge>
              )}
            </Flex>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
