import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { Toaster } from '@/components/ui/sonner'
import { MarketingHeader, MarketingFooter } from '@/features/marketing/components/layout'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>
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
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
      <Toaster position="bottom-right" />
    </>
  )
}
