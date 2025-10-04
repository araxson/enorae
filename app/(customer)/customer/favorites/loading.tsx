import { Section, Stack, Grid } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function FavoritesLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Stack gap="sm">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </Stack>
              </div>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
