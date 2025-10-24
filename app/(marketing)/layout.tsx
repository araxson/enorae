import { MarketingHeader, MarketingFooter } from '@/features/marketing/layout-components'
import { Suspense } from 'react'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense
        fallback={
          <header className="sticky top-0 z-50 h-16 w-full border-b bg-background" />
        }
      >
        <MarketingHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}
