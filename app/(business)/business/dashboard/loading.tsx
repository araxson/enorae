import { Section, Stack, Box, Grid } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48" />
        </Box>

        {/* Tabs skeleton */}
        <div>
          <Skeleton className="h-10 w-full max-w-md mb-6" />

          {/* Metrics cards */}
          <Stack gap="lg">
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

            {/* Recent bookings */}
            <Card className="p-6">
              <Stack gap="md">
                <Skeleton className="h-6 w-40 mb-4" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </Stack>
            </Card>
          </Stack>
        </div>
      </Stack>
    </Section>
  )
}
