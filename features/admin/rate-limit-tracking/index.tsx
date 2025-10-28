import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { getRateLimitTracking } from './api/queries'
import { RateLimitClient } from './components'

export async function RateLimitConsole() {
  const snapshot = await getRateLimitTracking({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Rate Limiting Console</ItemTitle>
              <ItemDescription>
                Monitor and manage rate limits across identifiers and endpoints
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <RateLimitClient snapshot={snapshot} />
      </div>
    </section>
  )
}
