import type { JSX } from 'react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { getBookingRuleServices, getBookingRules } from './api/queries'
import { BookingRulesClient } from './components'

export async function BookingRules(): Promise<JSX.Element> {
  const [rules, services] = await Promise.all([
    getBookingRules(),
    getBookingRuleServices(),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <ItemGroup className="gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Booking Rules</ItemTitle>
              <ItemDescription>Configure booking constraints for your services</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <BookingRulesClient rules={rules} services={services} />
      </div>
    </section>
  )
}
export type * from './api/types'
