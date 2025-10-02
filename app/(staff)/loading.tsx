import { Section, Stack } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </Stack>
    </Section>
  )
}
