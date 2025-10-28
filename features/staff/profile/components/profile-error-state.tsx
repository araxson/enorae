import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

type ProfileErrorProps = {
  error?: Error | unknown
}

export function ProfileUnavailableError({ error }: ProfileErrorProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Profile unavailable</EmptyTitle>
          <EmptyDescription>
            {error instanceof Error ? error.message : 'Please log in to view your profile'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </section>
  )
}

export function ProfileNotFoundError() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Profile not found</EmptyTitle>
          <EmptyDescription>Staff profile not found</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </section>
  )
}
