import { getBookingRules, getBookingRuleServices } from './api/queries'
import { upsertBookingRule } from './api/mutations'
import { BookingRulesClient } from './components/booking-rules-client'

export async function BookingRules() {
  const [rules, services] = await Promise.all([
    getBookingRules(),
    getBookingRuleServices(),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Booking Rules</h1>
          <p className="text-sm text-muted-foreground">Configure booking constraints for your services</p>
        </div>

        <BookingRulesClient rules={rules} services={services} onSubmit={upsertBookingRule} />
      </div>
    </section>
  )
}
