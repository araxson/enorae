'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { bulkAdjustPricing } from '../api/pricing-rules.mutations'
import { useToast } from '@/hooks/use-toast'

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
    <Card>
      <CardHeader>
        <CardTitle>Bulk Pricing Adjustment</CardTitle>
        <CardDescription>Quickly adjust pricing across multiple services.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="scope">Scope</Label>
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
          </div>

          <div>
            <Label htmlFor="adjustment-type">Adjustment Type</Label>
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
          </div>

  <div>
            <Label htmlFor="adjustment-value">
              {adjustmentType === 'percentage' ? 'Percent (%)' : 'Amount ($)'}
            </Label>
            <Input
              id="adjustment-value"
              type="number"
              step={adjustmentType === 'percentage' ? 1 : 0.5}
              value={adjustmentValue}
              onChange={(event) => setAdjustmentValue(Number(event.target.value))}
            />
          </div>
        </div>

        {scope === 'selected' && (
          <div>
            <Label>Choose Services</Label>
            <ScrollArea className="mt-2 max-h-40 rounded-md border">
              <div className="p-2 space-y-1">
                {services.map((service) => {
                  const isActive = selectedServices.includes(service.id)
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
                      }`}
                    >
                      <span>{service.name}</span>
                      {service.price !== undefined && (
                        <Badge variant="secondary">${service.price.toFixed(2)}</Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
            {selectedServices.length > 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {selectedServices.length} services selected
              </p>
            ) : null}
          </div>
        )}

        <div>
          <Label htmlFor="reason">Reason (optional)</Label>
          <Input
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g., Holiday promotion"
          />
        </div>

        <Button onClick={handleAdjust} disabled={isPending}>
          {isPending ? 'Applying...' : 'Apply Adjustment'}
        </Button>
      </CardContent>
    </Card>
  )
}
