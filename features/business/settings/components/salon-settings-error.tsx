import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Store } from 'lucide-react'

export function SalonSettingsNoSalonError() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Store className="size-8" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No salon found</EmptyTitle>
            <EmptyDescription>Please create a salon first to manage settings.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </section>
  )
}
