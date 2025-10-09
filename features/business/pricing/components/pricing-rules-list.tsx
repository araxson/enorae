'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Stack } from '@/components/layout'
import { Trash2 } from 'lucide-react'
import { togglePricingRuleStatus, deletePricingRule } from '../api/pricing-rules.mutations'
import { useToast } from '@/hooks/use-toast'

interface PricingRule {
  id: string
  rule_name: string
  rule_type: string
  service_id: string | null
  multiplier: number | null
  fixed_adjustment: number | null
  start_time: string | null
  end_time: string | null
  valid_from: string | null
  valid_until: string | null
  customer_segment: string | null
  is_active: boolean
  priority: number
}

interface PricingRulesListProps {
  rules: PricingRule[]
}

export function PricingRulesList({ rules }: PricingRulesListProps) {
  const { toast } = useToast()

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await togglePricingRuleStatus(id, !isActive)
      toast({
        title: isActive ? 'Rule deactivated' : 'Rule activated',
        description: 'Pricing rule status updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update rule status.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return

    try {
      await deletePricingRule(id)
      toast({
        title: 'Rule deleted',
        description: 'Pricing rule has been deleted successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete pricing rule.',
        variant: 'destructive',
      })
    }
  }

  const getRuleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      time_based: 'Time-Based',
      day_based: 'Day-Based',
      advance_booking: 'Advance Booking',
      demand: 'Demand-Based',
      seasonal: 'Seasonal Pricing',
      customer_segment: 'Customer Segment',
    }
    return labels[type] || type
  }

  if (rules.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No pricing rules configured yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first dynamic pricing rule to optimize revenue.
        </p>
      </Card>
    )
  }

  return (
    <Stack gap="md">
      {rules.map((rule) => (
        <Card key={rule.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold">{rule.rule_name}</h3>
                <Badge variant="outline">{getRuleTypeLabel(rule.rule_type)}</Badge>
                {rule.is_active && <Badge variant="default">Active</Badge>}
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                {rule.multiplier && rule.multiplier !== 1 && (
                  <p>Multiplier: {rule.multiplier}x ({((rule.multiplier - 1) * 100).toFixed(0)}% {rule.multiplier > 1 ? 'increase' : 'decrease'})</p>
                )}
                {rule.fixed_adjustment && rule.fixed_adjustment !== 0 && (
                  <p>Fixed: {rule.fixed_adjustment > 0 ? '+' : ''}{rule.fixed_adjustment}</p>
                )}
                {rule.start_time && rule.end_time && (
                  <p>Time: {rule.start_time} - {rule.end_time}</p>
                )}
                {(rule.valid_from || rule.valid_until) && (
                  <p>Season: {rule.valid_from || 'now'} → {rule.valid_until || 'ongoing'}</p>
                )}
                {rule.customer_segment && (
                  <p>Segment: {rule.customer_segment.replace(/_/g, ' ')}</p>
                )}
                <p>Priority: {rule.priority}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={rule.is_active}
                onCheckedChange={() => handleToggle(rule.id, rule.is_active)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(rule.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </Stack>
  )
}
