import { Skeleton } from '@/components/ui/skeleton'
import { Stack, Section, Grid, Flex } from '@/components/layout'

export default function BusinessLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="between" align="center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </Flex>
        <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </Grid>
        <Skeleton className="h-96 w-full" />
      </Stack>
    </Section>
  )
}
