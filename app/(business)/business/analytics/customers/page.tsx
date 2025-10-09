import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export default async function CustomersAnalyticsPage() {
  return (
    <Stack gap="xl">
      <div>
        <H1>Customer Analytics</H1>
        <P className="text-muted-foreground">
          Analyze customer behavior, lifetime value, and engagement metrics
        </P>
      </div>
      <P>Select a customer to view detailed analytics</P>
    </Stack>
  )
}
