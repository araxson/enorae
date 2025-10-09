import { AlertCircle, UserX } from 'lucide-react'
import { Section } from '@/components/layout'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ErrorState({ message, retryHref }: { message: string; retryHref: string }) {
  return (
    <Section size="lg" fullWidth>
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
    </Section>
  )
}

export function MissingProfileState() {
  return (
    <Section size="lg" fullWidth>
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
    </Section>
  )
}
