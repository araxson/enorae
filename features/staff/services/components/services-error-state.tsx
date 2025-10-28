import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

type ServicesErrorProps = {
  error?: Error | unknown
}

export function ServicesUnavailableError({ error }: ServicesErrorProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Services unavailable</EmptyTitle>
          <EmptyDescription>
            {error instanceof Error ? error.message : 'Please log in to view your services'}
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
