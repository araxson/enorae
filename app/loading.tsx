import { Section, Stack } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="sm">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </Stack>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </Stack>
    </Section>
  )
}
