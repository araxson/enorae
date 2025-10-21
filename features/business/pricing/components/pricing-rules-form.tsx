'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/lib/hooks/use-toast'
import { createPricingRule } from '../api/pricing-rules.mutations'
import type { PricingRulesFormProps, PricingRuleFormState } from './pricing-rules-form/types'
import { AdjustmentFields, RuleBasicsFields, ScheduleFields, ValidityFields } from './pricing-rules-form/sections'
import { ruleLabels } from './pricing-rules-form/constants'

export function PricingRulesForm({ salonId, services, onSuccess }: PricingRulesFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PricingRuleFormState>({
    rule_type: 'time_based',
    rule_name: '',
    service_id: 'all',
    multiplier: 1.0,
    fixed_adjustment: 0,
    start_time: '',
    end_time: '',
    days_of_week: [],
    valid_from: '',
    valid_until: '',
    customer_segment: 'all',
    is_active: true,
    priority: 10,
  })

  const selectedServiceName = useMemo(() => {
    if (formData.service_id === 'all') return 'All Services'
    return services.find((service) => service.id === formData.service_id)?.name || 'Selected Service'
  }, [formData.service_id, services])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      await createPricingRule({
        salon_id: salonId,
        rule_type: formData.rule_type,
        rule_name: formData.rule_name.trim(),
        service_id: formData.service_id === 'all' ? null : formData.service_id,
        multiplier: formData.multiplier,
        fixed_adjustment: formData.fixed_adjustment,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        days_of_week: formData.days_of_week.length ? formData.days_of_week : null,
        valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : null,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
        customer_segment: formData.customer_segment === 'all' ? null : formData.customer_segment,
        is_active: formData.is_active,
        priority: formData.priority,
      })

      toast({
        title: 'Pricing rule saved',
        description: 'Your pricing rule is now active and will affect upcoming bookings.',
      })

      onSuccess?.()
      setFormData((current) => ({
        ...current,
        rule_name: '',
        multiplier: 1.0,
        fixed_adjustment: 0,
        days_of_week: [],
      }))
    } catch (error) {
      toast({
        title: 'Unable to save rule',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <RuleBasicsFields formData={formData} setFormData={setFormData} services={services} />

          <AdjustmentFields
            formData={formData}
            setFormData={setFormData}
            selectedServiceName={selectedServiceName}
          />

          <ScheduleFields formData={formData} setFormData={setFormData} ruleType={formData.rule_type} />

          <ValidityFields
            formData={formData}
            setFormData={setFormData}
            selectedServiceName={selectedServiceName}
          />

          <div className="flex items-center justify-between rounded-md border px-4 py-3">
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                {ruleLabels[formData.rule_type]} rule targeting {selectedServiceName.toLowerCase()}.
              </p>
              <p>
                Multiplier: <strong>{formData.multiplier.toFixed(2)}</strong> • Fixed adjustment:{' '}
                <strong>${formData.fixed_adjustment.toFixed(2)}</strong>
              </p>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Create Pricing Rule'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
