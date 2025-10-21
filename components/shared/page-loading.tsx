import { Spinner } from '@/components/ui/spinner'

/**
 * Shared page-level loading state used across Suspense boundaries.
 */
export function PageLoading() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center justify-center gap-6 px-4 sm:px-6 lg:px-8">
        <Spinner className="size-8" />
      </div>
    </section>
  )
}
