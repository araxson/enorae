import { getPricingRules } from '../api/queries'
import { getPricingServices, buildPricingAnalytics } from '../api/analytics'
import type { PricingService } from '../api/analytics'
import { BulkPricingAdjuster } from './bulk-pricing-adjuster'
import { DynamicPricingDashboard } from './dynamic-pricing-dashboard'
import { PricingRulesForm } from './pricing-rules-form'
import { PricingRulesList } from './pricing-rules-list'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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

type ServiceForForm = PricingService & { id: string }

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
    <div className="flex flex-col gap-8">
      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Dynamic pricing</ItemTitle>
          <ItemDescription>
            Configure time-based and demand-based pricing rules to optimize revenue.
          </ItemDescription>
        </ItemHeader>
      </Item>

      <DynamicPricingDashboard
        rules={analytics.rules}
        scenarios={analytics.scenarios}
        insights={analytics.insights}
        services={serviceList.map(s => ({ id: s.id }))}
      />

      <BulkPricingAdjuster salonId={salon.id} services={serviceList.map(s => ({ id: s.id, name: s.name || 'Untitled Service', price: s.base_price ?? undefined }))} />

      <PricingRulesForm salonId={salon.id} services={serviceList.map(s => ({ id: s.id, name: s.name || 'Untitled Service', price: s.base_price ?? undefined }))} />

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Active pricing rules</ItemTitle>
        </ItemHeader>
        <ItemContent className="p-0">
          <PricingRulesList rules={normalizedRules} />
        </ItemContent>
      </Item>
    </div>
  )
}
