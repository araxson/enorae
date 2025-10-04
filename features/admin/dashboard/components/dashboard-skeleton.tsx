import { Section, Stack, Grid, Box } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box className="flex items-center justify-between">
          <Box>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </Box>
          <Skeleton className="h-10 w-32" />
        </Box>

        <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="lg">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid cols={{ base: 1, lg: 2 }} gap="lg">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Stack gap="sm">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="h-16 w-full" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
