import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { getRateLimitRules } from './api/queries'
import { RateLimitRulesClient } from './components'

export async function PolicyEnforcementOverview() {
  const snapshot = await getRateLimitRules({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ItemGroup className="mb-8 gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Policy Enforcement Overview</ItemTitle>
              <ItemDescription>
                Define and manage rate limiting policies across all API endpoints
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <RateLimitRulesClient snapshot={snapshot} />
      </div>
    </section>
  )
}
