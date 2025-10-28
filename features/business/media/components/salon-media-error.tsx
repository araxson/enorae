import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

export function SalonMediaUnavailableError() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Salon media unavailable</EmptyTitle>
            <EmptyDescription>No salon found. Please create a salon first.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </section>
  )
}
