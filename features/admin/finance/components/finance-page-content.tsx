import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
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
          <H1>Finance & Revenue</H1>
          <P className="text-muted-foreground">
            Monitor platform revenue, transactions, and financial metrics
          </P>
        </div>

        <FinanceDashboard startDate={startDate} endDate={endDate} />
      </Stack>
    </Section>
  )
}
