import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function DashboardErrorState() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Empty>
        <EmptyMedia variant="icon">
          <AlertCircle className="h-6 w-6" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Error loading dashboard</EmptyTitle>
          <EmptyDescription>
            We couldn't load your dashboard data. Please try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
            <Link href="/customer">Refresh</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
