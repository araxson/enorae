import { Section, Stack } from '@/components/layout'
import { Spinner } from '@/components/ui/spinner'

/**
 * Shared page-level loading state used across Suspense boundaries.
 */
export function PageLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl" className="min-h-[60vh] items-center justify-center">
        <Spinner className="size-8" />
      </Stack>
    </Section>
  )
}
