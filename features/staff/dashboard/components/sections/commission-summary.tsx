import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
type Props = {
  commission: {
    todayRevenue: number
    todayCommission: number
    weekRevenue: number
    weekCommission: number
    monthRevenue: number
    monthCommission: number
  }
}

export function CommissionSummary({ commission }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Commission Summary
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Stat label="Today's Revenue" value={`$${commission.todayRevenue.toFixed(2)}`} />
          <Stat
            label="Today's Commission"
            value={`$${commission.todayCommission.toFixed(2)}`}
            highlight
          />
          <Stat label="Week Revenue" value={`$${commission.weekRevenue.toFixed(2)}`} />
          <Stat
            label="Week Commission"
            value={`$${commission.weekCommission.toFixed(2)}`}
            highlight
          />
          <Stat label="Month Revenue" value={`$${commission.monthRevenue.toFixed(2)}`} />
          <Stat
            label="Month Commission"
            value={`$${commission.monthCommission.toFixed(2)}`}
            highlight
          />
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className={`text-2xl font-bold ${highlight ? 'text-success' : ''}`}>
        {value}
      </div>
    </div>
  )
}
