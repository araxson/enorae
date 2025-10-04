import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack, Flex, Group, Box } from '@/components/layout'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Small } from '@/components/ui/typography'

export interface StatCardProps {
  label: string
  value: number | string
  change?: number
  trend?: 'up' | 'down'
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  trend,
  description,
  icon,
  className,
}: StatCardProps) {
  const isPositive = trend === 'up' || (change !== undefined && change > 0)
  const isNegative = trend === 'down' || (change !== undefined && change < 0)

  return (
    <Card
      className={cn(
        'w-full transition-all hover:shadow-md hover:border-primary/20',
        className
      )}
      role="article"
      aria-label={`${label}: ${value}`}
    >
      <CardHeader>
        <Flex direction="row" align="center" justify="between" gap="sm">
          <CardTitle className="text-sm font-medium" id={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            {label}
          </CardTitle>
          {icon && (
            <Box className="text-muted-foreground" aria-hidden="true">
              {icon}
            </Box>
          )}
        </Flex>
      </CardHeader>

      <CardContent>
        <Stack gap="xs">
          <div
            className="text-2xl font-bold"
            aria-describedby={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {value}
          </div>

          {(change !== undefined || description) && (
            <Group gap="xs" align="center">
              {change !== undefined && (
                <Group
                  gap="xs"
                  align="center"
                  className={cn(
                    'font-medium',
                    isPositive && 'text-green-600 dark:text-green-400',
                    isNegative && 'text-red-600 dark:text-red-400'
                  )}
                  role="status"
                  aria-label={`${isPositive ? 'Increased' : 'Decreased'} by ${Math.abs(change)}%`}
                >
                  {isPositive && <TrendingUp className="h-3 w-3" aria-hidden="true" />}
                  {isNegative && <TrendingDown className="h-3 w-3" aria-hidden="true" />}
                  <Small>
                    {change > 0 && '+'}
                    {change}%
                  </Small>
                </Group>
              )}
              {description && <Small className="text-muted-foreground">{description}</Small>}
            </Group>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
