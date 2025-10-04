import { Section, Stack, Grid } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function AnalyticsLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* KPI Cards */}
        <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="lg">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <Stack gap="sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </Stack>
            </Card>
          ))}
        </Grid>

        {/* Charts */}
        <Grid cols={{ base: 1, lg: 2 }} gap="lg">
          <Card className="p-6">
            <Stack gap="md">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-64 w-full" />
            </Stack>
          </Card>
          <Card className="p-6">
            <Stack gap="md">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-64 w-full" />
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Section>
  )
}
