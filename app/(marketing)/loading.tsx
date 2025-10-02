import { Section, Stack } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Stack>
    </Section>
  )
}
