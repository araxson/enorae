import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { FinanceDashboard } from './finance-dashboard'

interface FinancePageContentProps {
  startDate?: string
  endDate?: string
}

export function FinancePageContent({ startDate, endDate }: FinancePageContentProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
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
      </div>
    </section>
  )
}
