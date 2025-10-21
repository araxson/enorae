import { AlertCircle, UserX } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ErrorState({ message, retryHref }: { message: string; retryHref: string }) {
  return (
    <section className="py-10 w-full px-6">
      <EmptyState
        icon={AlertCircle}
        title="Error Loading Dashboard"
        description={message}
        action={
          <Button asChild variant="outline">
            <Link href={retryHref}>Refresh</Link>
          </Button>
        }
      />
    </section>
  )
}

export function MissingProfileState() {
  return (
    <section className="py-10 w-full px-6">
      <EmptyState
        icon={UserX}
        title="No Staff Profile Found"
        description="You don't have a staff profile. Please contact your administrator."
        action={
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        }
      />
    </section>
  )
}
