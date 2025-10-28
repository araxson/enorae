'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
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
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex flex-col gap-1">
          <ItemTitle>Dynamic Pricing Preview</ItemTitle>
          <ItemDescription>Calculate the real-time price for a specific booking time.</ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-4">
          <Field orientation="responsive" className="items-end gap-4">
            <FieldContent className="w-full space-y-2 md:max-w-xs">
              <FieldLabel htmlFor="dynamic-pricing-time">Booking time</FieldLabel>
              <Input
                id="dynamic-pricing-time"
                type="datetime-local"
                value={dateTimeValue}
                onChange={(event) => setDateTimeValue(event.target.value)}
                disabled={isPending}
              />
            </FieldContent>
            <FieldContent className="flex-none">
              <Button type="button" onClick={handlePreview} disabled={!serviceId || isPending}>
                {isPending ? 'Calculating…' : 'Preview Price'}
              </Button>
            </FieldContent>
          </Field>

          {formattedPrice && !error ? (
            <Field>
              <FieldDescription>
                Calculated price:
                {' '}
                <span className="font-semibold text-primary">{formattedPrice}</span>
              </FieldDescription>
            </Field>
          ) : null}

          {error ? (
            <Field>
              <FieldDescription>
                <span className="text-destructive">{error}</span>
              </FieldDescription>
            </Field>
          ) : null}

          {!serviceId ? (
            <Field>
              <FieldDescription>
                Choose a service to enable dynamic pricing calculations.
              </FieldDescription>
            </Field>
          ) : null}
        </div>
      </ItemContent>
    </Item>
  )
}
