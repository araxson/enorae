import { Section, Stack, Box, Grid } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </Box>

        <div className="w-full max-w-md">
          <Skeleton className="h-10 w-full" />
        </div>

        <Stack gap="lg">
          <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="lg">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <Stack gap="sm">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </Stack>
              </Card>
            ))}
          </Grid>

          <Card className="p-6">
            <Stack gap="md">
              <Skeleton className="h-6 w-40" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="pb-4 border-b last:border-0">
                  <Stack gap="xs">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </Stack>
                </div>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Section>
  )
}
