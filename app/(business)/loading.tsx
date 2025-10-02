import { Section, Stack } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </Stack>
    </Section>
  )
}
