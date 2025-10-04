import { Skeleton } from '@/components/ui/skeleton'
import { Stack, Section, Grid } from '@/components/layout'

export default function CustomerLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Skeleton className="h-10 w-64" />
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
