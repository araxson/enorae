'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Progress } from '@/components/ui/progress'
import type { TimeOffBalance } from '@/features/staff/time-off/api/queries'

interface TimeOffBalanceCardProps {
  balance: TimeOffBalance
}

export function TimeOffBalanceCard({ balance }: TimeOffBalanceCardProps) {
  const usagePercent = (balance.used_days / balance.total_days) * 100
  const pendingPercent = (balance.pending_days / balance.total_days) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Off Balance ({balance.year})</CardTitle>
        <CardDescription>Your annual time off allocation and usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 text-center sm:grid-cols-3">
            <BalanceStat label="Total" value={balance.total_days} />
            <BalanceStat label="Used" value={balance.used_days} tone="info" />
            <BalanceStat label="Remaining" value={balance.remaining_days} tone="success" />
          </div>

          <UsageRow
            label={`Used: ${balance.used_days} days`}
            percent={usagePercent}
          />

          {balance.pending_days > 0 && (
            <UsageRow
            label={`Pending approval: ${balance.pending_days} days`}
            percent={pendingPercent}
          />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function BalanceStat({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: number
  tone?: 'default' | 'info' | 'success'
}) {
  const valueClass =
    tone === 'info' ? 'text-secondary' : tone === 'success' ? 'text-primary' : undefined

  return (
    <div>
      <span className={`text-2xl font-bold ${valueClass ?? ''}`}>{value}</span>
      <span className="block text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function UsageRow({
  label,
  percent,
}: {
  label: string
  percent: number
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-sm text-foreground">{percent.toFixed(0)}%</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  )
}
