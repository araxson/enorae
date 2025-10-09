import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { getPricingRules } from './api/dynamic-pricing.queries'
import { PricingRulesForm } from './components/pricing-rules-form'
import { PricingRulesList } from './components/pricing-rules-list'
import { DynamicPricingDashboard } from './components/dynamic-pricing-dashboard'
import { BulkPricingAdjuster } from './components/bulk-pricing-adjuster'
import { buildPricingAnalytics } from './utils/analytics'
import { getUserSalon } from '../shared/api/salon.queries'

export async function DynamicPricing() {
  const salon = await getUserSalon()
  const rules = (await getPricingRules(salon.id)) ?? []

  // Fetch services for the form
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, name, price')
    .eq('salon_id', salon.id)
    .eq('is_active', true)

  const serviceList = services || []
  const analytics = buildPricingAnalytics(
    rules.map((rule) => ({
      id: rule.id,
      rule_type: rule.rule_type,
      multiplier: rule.multiplier,
      fixed_adjustment: rule.fixed_adjustment,
      start_time: rule.start_time,
      end_time: rule.end_time,
      days_of_week: rule.days_of_week as number[] | null,
      is_active: rule.is_active,
    })),
    serviceList
  )

  return (
    <Stack gap="xl">
      <div>
        <H1>Dynamic Pricing</H1>
        <P className="text-muted-foreground">
          Configure time-based and demand-based pricing rules to optimize revenue
        </P>
      </div>

      <DynamicPricingDashboard
        rules={analytics.rules}
        scenarios={analytics.scenarios}
        insights={analytics.insights}
        services={serviceList}
      />

      <BulkPricingAdjuster salonId={salon.id} services={serviceList} />

      <PricingRulesForm salonId={salon.id} services={serviceList} />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Active Pricing Rules</h2>
        <PricingRulesList rules={rules || []} />
      </div>
    </Stack>
  )
}
