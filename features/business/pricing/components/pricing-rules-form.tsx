'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { createPricingRule } from '@/features/business/pricing/api/mutations'
import { pricingRuleSchema, type PricingRuleSchema } from '../api/schema'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { PricingRulesFormProps } from './pricing-rules-form/types'

export function PricingRulesForm({ salonId, services, onSuccess }: PricingRulesFormProps) {
  const form = useForm({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: {
      name: '',
      description: '',
      rule_type: 'peak_hours' as const,
      is_active: true,
      priority: 50,
      applies_to_service_ids: [],
      applies_to_staff_ids: [],
      days_of_week: [],
      time_ranges: [],
      adjustment_type: 'percentage' as const,
      adjustment_value: 0,
      is_first_time_customer_only: false,
      is_combinable_with_other_rules: false,
    },
  })

  const handleSubmit = async (data: PricingRuleSchema) => {
    try {
      await createPricingRule({
        salon_id: salonId,
        rule_type: data.rule_type,
        rule_name: data.name,
        service_id: data.applies_to_service_ids?.[0] || null,
        multiplier: data.adjustment_type === 'percentage' ? 1 + data.adjustment_value / 100 : 1,
        fixed_adjustment: data.adjustment_type === 'fixed_amount' ? data.adjustment_value : 0,
        start_time: data.time_ranges?.[0]?.start_time || null,
        end_time: data.time_ranges?.[0]?.end_time || null,
        days_of_week: data.days_of_week && data.days_of_week.length > 0 ? data.days_of_week : null,
        valid_from: data.valid_from ? new Date(data.valid_from).toISOString() : null,
        valid_until: data.valid_until ? new Date(data.valid_until).toISOString() : null,
        customer_segment: data.is_first_time_customer_only ? 'new' : 'all',
        is_active: data.is_active,
        priority: data.priority,
      })

      toast.success('Pricing rule created successfully')
      onSuccess?.()
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create pricing rule')
    }
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekend Peak Hours" {...field} />
                  </FormControl>
                  <FormDescription>A descriptive name for this pricing rule</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rule_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="peak_hours">Peak Hours</SelectItem>
                      <SelectItem value="off_peak">Off-Peak</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="loyalty">Loyalty</SelectItem>
                      <SelectItem value="group">Group Discount</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="adjustment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                        <SelectItem value="tiered">Tiered</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adjustment_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...field}
                        value={field.value as number}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch('adjustment_type') === 'percentage' ? 'Percentage change (e.g., 20 for +20%)' : 'Dollar amount'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" {...field} value={field.value as number} onChange={(e) => field.onChange(parseInt(e.target.value) || 50)} />
                  </FormControl>
                  <FormDescription>Higher priority rules are applied first (0-100)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>Enable this pricing rule</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_first_time_customer_only"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">First-Time Only</FormLabel>
                      <FormDescription>Apply only to new customers</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <ItemActions>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>Create Pricing Rule</span>
                )}
              </Button>
            </ItemActions>
          </form>
        </Form>
      </ItemContent>
    </Item>
  )
}
