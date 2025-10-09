'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { createPricingRule } from '../api/pricing-rules.mutations'
import { useToast } from '@/hooks/use-toast'

interface PricingRulesFormProps {
  salonId: string
  services: Array<{ id: string; name: string }>
  onSuccess?: () => void
}

export function PricingRulesForm({ salonId, services, onSuccess }: PricingRulesFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    rule_type: 'time_based',
    rule_name: '',
    service_id: null as string | null,
    multiplier: 1.0,
    fixed_adjustment: 0,
    start_time: '',
    end_time: '',
    days_of_week: [] as number[],
    is_active: true,
    priority: 10,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createPricingRule({
        salon_id: salonId,
        ...formData,
        days_of_week: formData.days_of_week.length > 0 ? formData.days_of_week : null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
      })

      toast({
        title: 'Pricing rule created',
        description: 'Your dynamic pricing rule has been created successfully.',
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create pricing rule. Please try again.',
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
              onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
              placeholder="e.g., Peak Hours Premium"
              required
            />
          </div>

          <div>
            <Label htmlFor="rule_type">Rule Type</Label>
            <Select
              value={formData.rule_type}
              onValueChange={(value) => setFormData({ ...formData, rule_type: value })}
            >
              <SelectTrigger id="rule_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time_based">Time-Based</SelectItem>
                <SelectItem value="day_based">Day-Based</SelectItem>
                <SelectItem value="advance_booking">Advance Booking</SelectItem>
                <SelectItem value="demand">Demand-Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="service_id">Service (Optional)</Label>
            <Select
              value={formData.service_id || 'all'}
              onValueChange={(value) => setFormData({ ...formData, service_id: value === 'all' ? null : value })}
            >
              <SelectTrigger id="service_id">
                <SelectValue />
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="multiplier">Price Multiplier</Label>
              <Input
                id="multiplier"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.multiplier}
                onChange={(e) => setFormData({ ...formData, multiplier: parseFloat(e.target.value) })}
              />
              <p className="text-sm text-muted-foreground mt-1">1.0 = no change, 1.5 = 50% increase</p>
            </div>

            <div>
              <Label htmlFor="fixed_adjustment">Fixed Adjustment ($)</Label>
              <Input
                id="fixed_adjustment"
                type="number"
                step="0.01"
                value={formData.fixed_adjustment}
                onChange={(e) => setFormData({ ...formData, fixed_adjustment: parseFloat(e.target.value) })}
              />
              <p className="text-sm text-muted-foreground mt-1">Add/subtract fixed amount</p>
            </div>
          </div>

          {(formData.rule_type === 'time_based' || formData.rule_type === 'day_based') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Pricing Rule'}
          </Button>
        </Stack>
      </form>
    </Card>
  )
}
