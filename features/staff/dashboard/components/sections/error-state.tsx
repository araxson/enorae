import { AlertCircle, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function ErrorState({ message, retryHref }: { message: string; retryHref: string }) {
  return (
    <section className="py-10 w-full px-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Error Loading Dashboard</EmptyTitle>
          <EmptyDescription>{message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
            <Link href={retryHref}>Refresh</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  )
}

export function MissingProfileState() {
  return (
    <section className="py-10 w-full px-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserX className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No Staff Profile Found</EmptyTitle>
          <EmptyDescription>You don&apos;t have a staff profile. Please contact your administrator.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  )
}
