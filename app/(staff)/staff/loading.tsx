import { Skeleton } from '@/components/ui/skeleton'
import { Stack, Section, Grid } from '@/components/layout'

export default function StaffLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Skeleton className="h-10 w-64" />
        <Grid cols={{ base: 1, md: 2 }} gap="lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
