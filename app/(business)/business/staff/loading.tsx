import { Section, Stack, Grid } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function StaffLoading() {
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

        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6">
              <Stack gap="md" className="items-center text-center">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="w-full">
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
                <Skeleton className="h-10 w-full" />
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
