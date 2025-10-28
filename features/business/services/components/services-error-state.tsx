import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AlertCircle, Scissors } from 'lucide-react'

export function ServicesAuthError() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <Empty>
        <EmptyMedia variant="icon">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Authentication required</EmptyTitle>
          <EmptyDescription>Please log in to manage services.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Sign in with a business account to continue.</EmptyContent>
      </Empty>
    </section>
  )
}

export function ServicesNoSalonError() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <Empty>
        <EmptyMedia variant="icon">
          <Scissors className="h-6 w-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No salon found</EmptyTitle>
          <EmptyDescription>Please create a salon to manage services.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Launch the salon setup flow to add services.</EmptyContent>
      </Empty>
    </section>
  )
}
