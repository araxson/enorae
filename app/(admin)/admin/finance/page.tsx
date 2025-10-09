import { Suspense } from 'react'
import { FinanceDashboard, FinanceDashboardSkeleton } from '@/features/admin/finance'
import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export const metadata = {
  title: 'Finance & Revenue | Admin',
  description: 'Platform-wide revenue analytics and financial management',
}

interface FinancePageProps {
  searchParams: Promise<{
    startDate?: string
    endDate?: string
  }>
}

export default async function FinancePage({ searchParams }: FinancePageProps) {
  const params = await searchParams
  const { startDate, endDate } = params

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Finance & Revenue</H1>
          <P className="text-muted-foreground">
            Monitor platform revenue, transactions, and financial metrics
          </P>
        </div>

        <Suspense fallback={<FinanceDashboardSkeleton />}>
          <FinanceDashboard startDate={startDate} endDate={endDate} />
        </Suspense>
      </Stack>
    </Section>
  )
}
