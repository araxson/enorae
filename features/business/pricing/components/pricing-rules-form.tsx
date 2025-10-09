'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Stack, Grid } from '@/components/layout'
import { createPricingRule } from '../api/pricing-rules.mutations'
import { useToast } from '@/hooks/use-toast'

interface PricingRulesFormProps {
  salonId: string
  services: Array<{ id: string; name: string; price?: number }>
  onSuccess?: () => void
}

type RuleType =
  | 'time_based'
  | 'day_based'
  | 'advance_booking'
  | 'demand'
  | 'seasonal'
  | 'customer_segment'

const dayOptions = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
]

const segmentOptions = [
  { value: 'all', label: 'All Customers' },
  { value: 'loyalty_vip', label: 'Loyalty & VIP' },
  { value: 'new_customers', label: 'New Customers' },
  { value: 'high_value', label: 'High-Value Customers' },
]

const ruleLabels: Record<RuleType, string> = {
  time_based: 'Time-Based',
  day_based: 'Day-Based',
  advance_booking: 'Advance Booking',
  demand: 'Demand-Based',
  seasonal: 'Seasonal Pricing',
  customer_segment: 'Customer Segment',
}

export function PricingRulesForm({ salonId, services, onSuccess }: PricingRulesFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    rule_type: 'time_based' as RuleType,
    rule_name: '',
    service_id: 'all',
    multiplier: 1.0,
    fixed_adjustment: 0,
    start_time: '',
    end_time: '',
    days_of_week: [] as number[],
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
        <Stack gap="lg">
          <div>
            <Label htmlFor="rule_name">Rule Name</Label>
            <Input
              id="rule_name"
              value={formData.rule_name}
              onChange={(event) => setFormData({ ...formData, rule_name: event.target.value })}
              placeholder="e.g., Peak Hours Premium"
              required
            />
          </div>

          <Grid cols={{ base: 1, md: 2 }} gap="md">
            <div>
              <Label htmlFor="rule_type">Rule Type</Label>
              <Select
                value={formData.rule_type}
                onValueChange={(value: RuleType) => setFormData({ ...formData, rule_type: value })}
              >
                <SelectTrigger id="rule_type">
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ruleLabels) as RuleType[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {ruleLabels[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service_id">Target Service</Label>
              <Select
                value={formData.service_id}
                onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              >
                <SelectTrigger id="service_id">
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Grid>

          <Grid cols={{ base: 1, md: 2 }} gap="md">
            <div>
              <Label htmlFor="multiplier">Price Multiplier</Label>
              <Input
                id="multiplier"
                type="number"
                step="0.05"
                min="0"
                max="10"
                value={formData.multiplier}
                onChange={(event) =>
                  setFormData({ ...formData, multiplier: Number(event.target.value) })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                1.0 = no change, 1.3 = 30% increase, 0.8 = 20% decrease
              </p>
            </div>

            <div>
              <Label htmlFor="fixed_adjustment">Fixed Adjustment ($)</Label>
              <Input
                id="fixed_adjustment"
                type="number"
                step="0.5"
                value={formData.fixed_adjustment}
                onChange={(event) =>
                  setFormData({ ...formData, fixed_adjustment: Number(event.target.value) })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Add or subtract a fixed amount per booking.
              </p>
            </div>
          </Grid>

          {(formData.rule_type === 'time_based' || formData.rule_type === 'day_based') && (
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div>
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(event) => setFormData({ ...formData, start_time: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(event) => setFormData({ ...formData, end_time: event.target.value })}
                />
              </div>
            </Grid>
          )}

          <div>
            <Label>Days of Week</Label>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {dayOptions.map((day) => {
                const isSelected = formData.days_of_week.includes(day.value)
                return (
                  <button
                    type="button"
                    key={day.value}
                    className={`flex h-10 items-center justify-center rounded-md border text-sm font-medium ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
                    }`}
                    onClick={() =>
                      setFormData((current) => ({
                        ...current,
                        days_of_week: isSelected
                          ? current.days_of_week.filter((value) => value !== day.value)
                          : [...current.days_of_week, day.value],
                      }))
                    }
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Grid cols={{ base: 1, md: 2 }} gap="md">
            <div>
              <Label htmlFor="valid_from">Valid From</Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(event) => setFormData({ ...formData, valid_from: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="valid_until">Valid Until</Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(event) => setFormData({ ...formData, valid_until: event.target.value })}
              />
            </div>
          </Grid>

          <div>
            <Label htmlFor="customer_segment">Customer Segment</Label>
            <Select
              value={formData.customer_segment}
              onValueChange={(value) => setFormData({ ...formData, customer_segment: value })}
            >
              <SelectTrigger id="customer_segment">
                <SelectValue placeholder="All customers" />
              </SelectTrigger>
              <SelectContent>
                {segmentOptions.map((segment) => (
                  <SelectItem key={segment.value} value={segment.value}>
                    {segment.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              type="number"
              min={1}
              max={100}
              value={formData.priority}
              onChange={(event) => setFormData({ ...formData, priority: Number(event.target.value) })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lower numbers execute first when multiple rules apply (current target: {selectedServiceName}).
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Create Pricing Rule'}
          </Button>
        </Stack>
      </form>
    </Card>
  )
}
