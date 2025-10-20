import { Section, Stack } from '@/components/layout'
import { FinanceDashboard } from './finance-dashboard'

interface FinancePageContentProps {
  startDate?: string
  endDate?: string
}

export function FinancePageContent({ startDate, endDate }: FinancePageContentProps) {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Finance & Revenue</h1>
          <p className="leading-7 text-muted-foreground">
            Monitor platform revenue, transactions, and financial metrics
          </p>
        </div>

        <FinanceDashboard startDate={startDate} endDate={endDate} />
      </Stack>
    </Section>
  )
}
