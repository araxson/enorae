import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { getPricingRules } from './api/dynamic-pricing.queries'
import { PricingRulesForm } from './components/pricing-rules-form'
import { PricingRulesList } from './components/pricing-rules-list'
import { getUserSalon } from '../shared/api/salon.queries'

export async function DynamicPricing() {
  const salon = await getUserSalon()
  const rules = await getPricingRules(salon.id)

  // Fetch services for the form
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, name')
    .eq('salon_id', salon.id)
    .eq('is_active', true)

  return (
    <Stack gap="xl">
      <div>
        <H1>Dynamic Pricing</H1>
        <P className="text-muted-foreground">
          Configure time-based and demand-based pricing rules to optimize revenue
        </P>
      </div>

      <PricingRulesForm salonId={salon.id} services={services || []} />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Active Pricing Rules</h2>
        <PricingRulesList rules={rules || []} />
      </div>
    </Stack>
  )
}
