'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Trash2 } from 'lucide-react'
import { togglePricingRuleStatus, deletePricingRule } from '@/features/business/pricing/api/mutations'
import { useToast } from '@/lib/hooks/use-toast'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No pricing rules configured yet.</EmptyTitle>
          <EmptyDescription>Create your first dynamic pricing rule to optimize revenue.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ItemGroup className="flex flex-col gap-4">
      {rules.map((rule) => (
        <Item key={rule.id} variant="outline">
          <ItemContent>
            <ItemTitle>
              {rule.rule_name}
              <Badge variant="outline">{getRuleTypeLabel(rule.rule_type)}</Badge>
              {rule.is_active && <Badge variant="default">Active</Badge>}
            </ItemTitle>
            <ItemDescription>Priority {rule.priority}</ItemDescription>
            {rule.multiplier && rule.multiplier !== 1 && (
              <ItemDescription>
                Multiplier: {rule.multiplier}x ({((rule.multiplier - 1) * 100).toFixed(0)}%{' '}
                {rule.multiplier > 1 ? 'increase' : 'decrease'})
              </ItemDescription>
            )}
            {rule.fixed_adjustment && rule.fixed_adjustment !== 0 && (
              <ItemDescription>
                Fixed: {rule.fixed_adjustment > 0 ? '+' : ''}{rule.fixed_adjustment}
              </ItemDescription>
            )}
            {rule.start_time && rule.end_time && (
              <ItemDescription>
                Time: {rule.start_time} - {rule.end_time}
              </ItemDescription>
            )}
            {(rule.valid_from || rule.valid_until) && (
              <ItemDescription>
                Season: {rule.valid_from || 'now'} → {rule.valid_until || 'ongoing'}
              </ItemDescription>
            )}
            {rule.customer_segment && (
              <ItemDescription>
                Segment: {rule.customer_segment.replace(/_/g, ' ')}
              </ItemDescription>
            )}
          </ItemContent>
          <ItemActions>
            <Switch
              checked={rule.is_active}
              onCheckedChange={() => handleToggle(rule.id, rule.is_active)}
              aria-label={`Toggle pricing rule ${rule.rule_name} ${rule.is_active ? 'inactive' : 'active'}`}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(rule.id)}
              aria-label={`Delete pricing rule ${rule.rule_name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
