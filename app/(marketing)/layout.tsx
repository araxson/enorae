import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { MarketingHeader, MarketingFooter } from '@/features/marketing/layout-components'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense
        fallback={
          <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-center">
              <Spinner className="size-5 text-muted-foreground" />
            </div>
          </header>
        }
      >
        <MarketingHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}
