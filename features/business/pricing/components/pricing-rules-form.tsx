'use client'

/**
 * DEPRECATED: pricing_rules table does not exist in database.
 * Dynamic pricing is handled through service_pricing table.
 * This form is kept for UI consistency but should be migrated to service_pricing.
 */

import { useActionState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { createPricingRule } from '@/features/business/pricing/api/mutations'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
// import type { PricingRulesFormProps } from './pricing-rules-form/types'
// import { PricingRuleFormFields } from './pricing-rules-form-fields' // DISABLED: File does not exist

type PricingRulesFormProps = {
  salonId: string
  services: Array<{ id: string; name: string }>
  onSuccess?: () => void
}

export function PricingRulesForm({ salonId, services, onSuccess }: PricingRulesFormProps) {
  type FormState = { success: boolean; message: string; error?: undefined } | { error: string; success?: undefined; message?: undefined }

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prevState: FormState, formData: FormData) => {
      try {
        const data = {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          rule_type: formData.get('rule_type') as string,
          is_active: formData.get('is_active') === 'true',
          priority: Number(formData.get('priority')),
          applies_to_service_ids: [],
          applies_to_staff_ids: [],
          days_of_week: [],
          time_ranges: [],
          adjustment_type: formData.get('adjustment_type') as 'percentage' | 'fixed_amount',
          adjustment_value: Number(formData.get('adjustment_value')),
          is_first_time_customer_only: formData.get('is_first_time_customer_only') === 'true',
          is_combinable_with_other_rules: formData.get('is_combinable_with_other_rules') === 'true',
        }

        await createPricingRule({
          salon_id: salonId,
          rule_type: data.rule_type,
          rule_name: data.name,
          service_id: null,
          multiplier: data.adjustment_type === 'percentage' ? 1 + data.adjustment_value / 100 : 1,
          fixed_adjustment: data.adjustment_type === 'fixed_amount' ? data.adjustment_value : 0,
          start_time: null,
          end_time: null,
          days_of_week: null,
          valid_from: null,
          valid_until: null,
          customer_segment: data.is_first_time_customer_only ? 'new' : 'all',
          is_active: data.is_active,
          priority: data.priority,
        })

        onSuccess?.()
        return { success: true, message: 'Pricing rule created successfully' }
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to create pricing rule',
        }
      }
    },
    { success: false, message: '', error: undefined }
  )

  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.error && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.error])

  return (
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <div className="flex flex-col gap-1">
          <ItemTitle>Create Pricing Rule</ItemTitle>
          <ItemDescription>
            Adjust service pricing dynamically based on schedule or customer segments.
          </ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
        <form action={formAction} className="space-y-6" noValidate>
          {/* Screen reader announcement for form status */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {isPending && 'Creating pricing rule, please wait'}
            {state?.error && !isPending && state.error}
            {state?.success && !isPending && 'Pricing rule created successfully'}
          </div>

          {/* Deprecated warning */}
          <Alert variant="destructive" role="alert">
            <AlertCircle className="size-4" />
            <AlertTitle>Deprecated Feature</AlertTitle>
            <AlertDescription>
              This feature uses the deprecated pricing_rules table. Please use the service_pricing
              table for dynamic pricing instead.
            </AlertDescription>
          </Alert>

          {/* Error alert */}
          {state?.error && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="size-4" />
              <AlertTitle>Creation failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div>
            <p>Form fields have been migrated. This component is deprecated.</p>
          </div>

          <ItemActions>
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending ? (
                <>
                  <Spinner className="size-4" />
                  <span aria-hidden="true">Saving…</span>
                  <span className="sr-only">Creating pricing rule, please wait</span>
                </>
              ) : (
                <span>Create Pricing Rule</span>
              )}
            </Button>
          </ItemActions>
        </form>
      </ItemContent>
    </Item>
  )
}
