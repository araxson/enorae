'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { bulkAdjustPricing } from '@/features/business/pricing/api/pricing-rules.mutations'
import { useToast } from '@/lib/hooks/use-toast'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'

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
            <Field>
              <FieldLabel>Choose Services</FieldLabel>
              <FieldContent>
                <Item variant="outline" className="mt-2 flex-col p-0">
                    <ScrollArea className="max-h-40">
                      <ItemGroup className="space-y-1 p-2">
                        {services.map((service) => {
                          const isActive = selectedServices.includes(service.id)
                          return (
                            <Item
                              key={service.id}
                              asChild
                              variant={isActive ? 'muted' : 'outline'}
                            >
                              <button
                                type="button"
                                className="w-full text-left"
                                onClick={() => toggleService(service.id)}
                                aria-pressed={isActive}
                              >
                                <ItemContent>
                                  <ItemTitle>{service.name}</ItemTitle>
                                </ItemContent>
                                {service.price !== undefined ? (
                                  <ItemActions>
                                    <Badge variant="secondary">
                                      ${service.price.toFixed(2)}
                                    </Badge>
                                  </ItemActions>
                                ) : null}
                              </button>
                            </Item>
                          )
                        })}
                      </ItemGroup>
                    </ScrollArea>
                </Item>
              </FieldContent>
              {selectedServices.length > 0 ? (
                <FieldDescription>
                  {selectedServices.length} services selected.
                </FieldDescription>
              ) : null}
            </Field>
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
