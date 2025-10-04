import { Section, Stack, Grid } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function AppointmentsLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        <Skeleton className="h-px w-full" />

        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6">
              <Stack gap="md">
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-full" />
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
