import { Skeleton } from '@/components/ui/skeleton'
import { Section, Stack, Grid } from '@/components/layout'

/**
 * Shared Dashboard Loading Skeleton
 * Used across all role-based dashboards (Admin, Business, Staff, Customer)
 */
export function DashboardSkeleton() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="sm">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </Stack>
        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </Grid>
        <Skeleton className="h-96" />
      </Stack>
    </Section>
  )
}
