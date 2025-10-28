import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ButtonGroup } from '@/components/ui/button-group'

export default function NotFound() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center justify-center gap-6 px-4 sm:px-6 lg:px-8">
        <Empty className="w-full max-w-md">
          <EmptyMedia variant="icon">
            <span className="text-6xl font-bold" aria-hidden="true">404</span>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Page not found</EmptyTitle>
            <EmptyDescription>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Check the URL or head back to the dashboard to continue exploring salons.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <ButtonGroup aria-label="Navigation options">
              <Button asChild className="flex-1">
                <Link href="/">
                  <Home className="mr-2 size-4" aria-hidden="true" />
                  Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/salons">
                  <Search className="mr-2 size-4" aria-hidden="true" />
                  Explore
                </Link>
              </Button>
            </ButtonGroup>
          </EmptyContent>
        </Empty>
      </div>
    </section>
  )
}
