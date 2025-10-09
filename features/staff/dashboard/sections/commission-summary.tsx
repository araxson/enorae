import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid, Box } from '@/components/layout'
import { Muted } from '@/components/ui/typography'

type Props = {
  commission: {
    todayRevenue: number
    todayCommission: number
    monthRevenue: number
    monthCommission: number
  }
}

export function CommissionSummary({ commission }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Commission Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Grid cols={{ base: 2, md: 4 }} gap="md">
          <Stat label="Today's Revenue" value={`$${commission.todayRevenue.toFixed(2)}`} />
          <Stat
            label="Today's Commission"
            value={`$${commission.todayCommission.toFixed(2)}`}
            highlight
          />
          <Stat label="Month Revenue" value={`$${commission.monthRevenue.toFixed(2)}`} />
          <Stat
            label="Month Commission"
            value={`$${commission.monthCommission.toFixed(2)}`}
            highlight
          />
        </Grid>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <Box>
      <Muted className="text-xs">{label}</Muted>
      <div className={`text-2xl font-bold ${highlight ? 'text-green-600 dark:text-green-500' : ''}`}>
        {value}
      </div>
    </Box>
  )
}
