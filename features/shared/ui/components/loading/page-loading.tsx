import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Section, SectionBody } from '../layout'
import { TableSkeleton } from './table-skeleton'

interface PageLoadingProps {
  message?: string
}

/**
 * Shared page-level loading state used across Suspense boundaries.
 */
export function PageLoading({ message }: PageLoadingProps = {}) {
  return (
    <Section width="lg">
      <SectionBody className="gap-10">
        <div className="flex flex-col items-center gap-3" role="status" aria-live="polite" aria-busy="true">
          <Spinner />
          {message && (
            <p className="text-muted-foreground text-sm">{message}</p>
          )}
          <span className="sr-only">Loading content, please wait...</span>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-7 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-7 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </CardHeader>
          <CardContent>
            <TableSkeleton columns={4} rows={4} />
          </CardContent>
        </Card>
      </SectionBody>
    </Section>
  )
}
