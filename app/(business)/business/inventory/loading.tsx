import { Section, Stack, Grid } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function InventoryLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats cards */}
        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Stack gap="sm">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-16" />
              </Stack>
            </Card>
          ))}
        </Grid>

        {/* Products table skeleton */}
        <Card className="p-6">
          <Stack gap="md">
            <Skeleton className="h-6 w-32 mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Section>
  )
}
