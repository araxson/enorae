import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
        <Item variant="muted" size="sm">
          <ItemMedia variant="icon">
            <DollarSign className="h-5 w-5" />
          </ItemMedia>
          <ItemContent>
            <CardTitle>Commission Summary</CardTitle>
          </ItemContent>
        </Item>
      </CardHeader>
      <CardContent>
        <ItemGroup className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
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
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <Item variant="outline" size="sm">
      <ItemContent>
        <ItemDescription>{label}</ItemDescription>
        <ItemTitle>
          <span className={`text-2xl font-bold ${highlight ? 'text-primary' : ''}`}>{value}</span>
        </ItemTitle>
      </ItemContent>
    </Item>
  )
}
