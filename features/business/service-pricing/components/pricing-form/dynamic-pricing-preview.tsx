'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateDynamicPrice } from '@/features/business/services/api/pricing-functions'

type DynamicPricingPreviewProps = {
  serviceId: string
  currencyCode: string
}

const getDefaultDateTimeValue = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export function DynamicPricingPreview({ serviceId, currencyCode }: DynamicPricingPreviewProps) {
  const [dateTimeValue, setDateTimeValue] = useState<string>(getDefaultDateTimeValue)
  const [preview, setPreview] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setPreview(null)
    setError(null)
  }, [serviceId])

  const formattedPrice = useMemo(() => {
    if (preview === null) return null
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode || 'USD',
      }).format(preview)
    } catch {
      return preview.toFixed(2)
    }
  }, [preview, currencyCode])

  const handlePreview = () => {
    if (!serviceId) {
      setError('Select a service to preview pricing')
      return
    }

    if (!dateTimeValue) {
      setError('Choose a booking time')
      return
    }

    const bookingDate = new Date(dateTimeValue)
    if (Number.isNaN(bookingDate.getTime())) {
      setError('Invalid booking time')
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const result = await calculateDynamicPrice({
          serviceId,
          bookingTime: bookingDate.toISOString(),
        })
        setPreview(result.price)
        if (result.price === null) {
          setError('No pricing data returned for this time')
        }
      } catch (actionError) {
        setPreview(null)
        setError(actionError instanceof Error ? actionError.message : 'Failed to calculate price')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Pricing Preview</CardTitle>
        <CardDescription>Calculate the real-time price for a specific booking time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:max-w-xs space-y-2">
              <Label htmlFor="dynamic-pricing-time">Booking time</Label>
              <Input
                id="dynamic-pricing-time"
                type="datetime-local"
                value={dateTimeValue}
                onChange={(event) => setDateTimeValue(event.target.value)}
                disabled={isPending}
              />
            </div>

            <Button
              type="button"
              onClick={handlePreview}
              disabled={!serviceId || isPending}
            >
              {isPending ? 'Calculating…' : 'Preview Price'}
            </Button>
          </div>

          {formattedPrice && !error && (
            <p className="text-sm font-medium">
              Calculated price: <span className="font-semibold text-primary">{formattedPrice}</span>
            </p>
          )}

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          {!serviceId && (
            <p className="text-xs text-muted-foreground">
              Choose a service to enable dynamic pricing calculations.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
