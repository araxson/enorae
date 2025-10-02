import { Section, Stack } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-6xl space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </Stack>
    </Section>
  )
}
