import { Skeleton } from '@/components/ui/skeleton'
import { Stack, Section } from '@/components/layout'

export default function AdminLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </Stack>
    </Section>
  )
}
