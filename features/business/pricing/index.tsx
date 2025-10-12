import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { getPricingRules, getPricingServices } from './api/queries'
import { PricingRulesForm } from './components/pricing-rules-form'
import { PricingRulesList } from './components/pricing-rules-list'
import { DynamicPricingDashboard } from './components/dynamic-pricing-dashboard'
import { BulkPricingAdjuster } from './components/bulk-pricing-adjuster'
import { buildPricingAnalytics } from './api/analytics'
import { getUserSalon } from '@/features/business/business-common/api/queries'

type PricingRuleRecord = {
  id: string | null
  rule_name: string | null
  rule_type: string | null
  service_id: string | null
  multiplier: number | null
  fixed_adjustment: number | null
  start_time: string | null
  end_time: string | null
  valid_from: string | null
  valid_until: string | null
  customer_segment: string | null
  days_of_week: number[] | null
  is_active: boolean | null
  priority: number | null
}

export async function DynamicPricing() {
  const salon = await getUserSalon()
  if (!salon?.id) {
    throw new Error('Salon not found')
  }

  const rawRules = (await getPricingRules(salon.id)) ?? []
  const rules = (rawRules as PricingRuleRecord[]).filter((rule) => rule.id)

  const serviceList = await getPricingServices(salon.id)
  const normalizedRules = rules
    .filter((rule) => rule.id && rule.rule_name && rule.rule_type)
    .map((rule) => ({
      id: rule.id as string,
      rule_name: rule.rule_name ?? 'Untitled Rule',
      rule_type: rule.rule_type ?? 'custom',
      service_id: rule.service_id,
      multiplier: rule.multiplier,
      fixed_adjustment: rule.fixed_adjustment,
      start_time: rule.start_time,
      end_time: rule.end_time,
      valid_from: rule.valid_from,
      valid_until: rule.valid_until,
      customer_segment: rule.customer_segment,
      is_active: Boolean(rule.is_active),
      priority: rule.priority ?? 0,
      days_of_week: rule.days_of_week,
    }))

  const analytics = buildPricingAnalytics(
    normalizedRules.map((rule) => ({
      id: rule.id,
      rule_type: rule.rule_type,
      multiplier: rule.multiplier,
      fixed_adjustment: rule.fixed_adjustment,
      start_time: rule.start_time,
      end_time: rule.end_time,
      days_of_week: rule.days_of_week,
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
      <PricingRulesList rules={normalizedRules} />
      </div>
    </Stack>
  )
}
