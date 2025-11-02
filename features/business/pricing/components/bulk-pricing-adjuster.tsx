'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { bulkAdjustPricing } from '@/features/business/pricing/api/mutations'
import { useToast } from '@/lib/hooks/use-toast'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import { BulkPricingServiceSelector } from './bulk-pricing-service-selector'

type ServiceOption = { id: string; name: string; price?: number }

type BulkPricingAdjusterProps = {
  salonId: string
  services: ServiceOption[]
}

export function BulkPricingAdjuster({ salonId, services }: BulkPricingAdjusterProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [scope, setScope] = useState<'all' | 'selected'>('all')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [adjustmentType, setAdjustmentType] = useState<'percentage' | 'fixed'>('percentage')
  const [adjustmentValue, setAdjustmentValue] = useState<number>(10)
  const [reason, setReason] = useState('')

  const toggleService = (serviceId: string) => {
    setSelectedServices((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId]
    )
  }

  const handleAdjust = () => {
    const ids = scope === 'all' ? services.map((service) => service.id) : selectedServices
    if (ids.length === 0) {
      toast({
        title: 'Select at least one service',
        description: 'Choose services or adjust the scope to all services.',
        variant: 'destructive',
      })
      return
    }

    startTransition(async () => {
      try {
        const result = await bulkAdjustPricing({
          salon_id: salonId,
          service_ids: ids,
          adjustment_type: adjustmentType,
          adjustment_value: adjustmentValue,
          reason,
        })

        toast({
          title: 'Bulk pricing updated',
          description: `${result.updated} services adjusted successfully.`,
        })
        setSelectedServices([])
        setReason('')
      } catch (error) {
        toast({
          title: 'Bulk adjustment failed',
          description: error instanceof Error ? error.message : 'Please try again.',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Bulk Pricing Adjustment</ItemTitle>
        <ItemDescription>Quickly adjust pricing across multiple services.</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <FieldSet className="space-y-4">
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="scope">Scope</FieldLabel>
              <FieldContent>
                <Select
                  value={scope}
                  onValueChange={(value: 'all' | 'selected') => setScope(value)}
                >
                  <SelectTrigger id="scope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="selected">Selected Services</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="adjustment-type">Adjustment Type</FieldLabel>
              <FieldContent>
                <Select
                  value={adjustmentType}
                  onValueChange={(value: 'percentage' | 'fixed') => setAdjustmentType(value)}
                >
                  <SelectTrigger id="adjustment-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="adjustment-value">
                {adjustmentType === 'percentage' ? 'Percent (%)' : 'Amount ($)'}
              </FieldLabel>
              <FieldContent>
                <Input
                  id="adjustment-value"
                  type="number"
                  step={adjustmentType === 'percentage' ? 1 : 0.5}
                  value={adjustmentValue}
                  onChange={(event) => setAdjustmentValue(Number(event.target.value))}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          {scope === 'selected' ? (
            <BulkPricingServiceSelector
              services={services}
              selectedServices={selectedServices}
              onToggleService={toggleService}
            />
          ) : null}

          <Field>
            <FieldLabel htmlFor="reason">Reason (optional)</FieldLabel>
            <FieldContent>
              <Input
                id="reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="e.g., Holiday promotion"
              />
            </FieldContent>
          </Field>

          <Button onClick={handleAdjust} disabled={isPending} className="flex items-center gap-2">
            {isPending ? (
              <>
                <Spinner />
                Applying
              </>
            ) : (
              'Apply Adjustment'
            )}
          </Button>
        </FieldSet>
      </ItemContent>
    </Item>
  )
}
