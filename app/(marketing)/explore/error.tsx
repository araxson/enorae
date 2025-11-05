'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/components/common'

interface ExploreErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ExploreError({ error, reset }: ExploreErrorProps) {
  useEffect(() => {
    console.error('Failed to render marketing explore page', error)
  }, [error])

  return (
    <main className="flex flex-col gap-10">
      <h1 className="text-center text-2xl font-semibold">Explore salons directory is unavailable</h1>
      <MarketingSection spacing="compact">
        <Item variant="muted">
          <ItemContent>
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="size-10 text-destructive" aria-hidden="true" />
              <ItemTitle className="text-lg">We couldn&rsquo;t load the salon directory</ItemTitle>
              <ItemDescription className="max-w-xl">
                Please refresh the page or contact the Enorae team if the problem continues.
              </ItemDescription>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button type="button" className="gap-2" onClick={reset}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Try again
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/contact">Contact support</Link>
                </Button>
              </div>
            </div>
          </ItemContent>
        </Item>
      </MarketingSection>
    </main>
  )
}
