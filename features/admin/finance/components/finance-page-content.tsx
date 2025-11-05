import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { AdminSection } from '@/features/admin/common/components'
import { FinanceDashboard } from './finance-dashboard'

interface FinancePageContentProps {
  startDate?: string
  endDate?: string
}

export function FinancePageContent({ startDate, endDate }: FinancePageContentProps) {
  return (
    <AdminSection>
      <div className="flex flex-col gap-10">
        <ItemGroup className="gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Finance & Revenue</ItemTitle>
              <ItemDescription>
                Monitor platform revenue, transactions, and financial metrics
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <FinanceDashboard startDate={startDate} endDate={endDate} />
      </div>
    </AdminSection>
  )
}
