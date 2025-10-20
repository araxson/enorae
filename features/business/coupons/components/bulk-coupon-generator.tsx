'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Stack, Grid } from '@/components/layout'
import { bulkGenerateCoupons } from '../api/coupons.mutations'
import { useToast } from '@/lib/hooks/use-toast'

type BulkCouponGeneratorProps = {
  salonId: string
}

export function BulkCouponGenerator({ salonId }: BulkCouponGeneratorProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState({
    prefix: 'SAVE',
    description: 'Seasonal promotion',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 10,
    count: 10,
    valid_from: '',
    valid_until: '',
    is_active: true,
    min_purchase_amount: null as number | null,
    max_discount_amount: null as number | null,
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const validFrom = formState.valid_from
        ? new Date(formState.valid_from).toISOString()
        : new Date().toISOString()
      const validUntil = formState.valid_until
        ? new Date(formState.valid_until).toISOString()
        : new Date().toISOString()

      const result = await bulkGenerateCoupons(salonId, {
        prefix: formState.prefix,
        description: formState.description,
        discount_type: formState.discount_type,
        discount_value: Number(formState.discount_value),
        count: Number(formState.count),
        valid_from: validFrom,
        valid_until: validUntil,
        is_active: formState.is_active,
        min_purchase_amount: formState.min_purchase_amount,
        max_discount_amount: formState.max_discount_amount,
      })

      toast({
        title: 'Coupons generated',
        description: `${result.generated} coupon codes created successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Bulk generation failed',
        description: 'Unable to generate coupons. Please review your configuration.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Coupon Generator</CardTitle>
        <CardDescription>Create batches of coupons for marketing campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              <div>
                <Label htmlFor="prefix">Code Prefix</Label>
                <Input
                  id="prefix"
                  value={formState.prefix}
                  onChange={(event) =>
                    setFormState({ ...formState, prefix: event.target.value.toUpperCase() })
                  }
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Prefix will be combined with random characters for uniqueness.
                </p>
              </div>

              <div>
                <Label htmlFor="count">Quantity</Label>
                <Input
                  id="count"
                  type="number"
                  min={1}
                  max={100}
                  value={formState.count}
                  onChange={(event) =>
                    setFormState({
                      ...formState,
                      count: Number(event.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="discount-type">Discount Type</Label>
                <Select
                  value={formState.discount_type}
                  onValueChange={(value: 'percentage' | 'fixed') =>
                    setFormState({ ...formState, discount_type: value })
                  }
                >
                  <SelectTrigger id="discount-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Grid>

            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div>
                <Label htmlFor="discount-value">
                  Discount Value {formState.discount_type === 'percentage' ? '(%)' : '($)'}
                </Label>
                <Input
                  id="discount-value"
                  type="number"
                  min={0}
                  max={formState.discount_type === 'percentage' ? 100 : undefined}
                  step={formState.discount_type === 'percentage' ? 1 : 0.5}
                  value={formState.discount_value}
                  onChange={(event) =>
                    setFormState({
                      ...formState,
                      discount_value: Number(event.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Campaign Description</Label>
                <Input
                  id="description"
                  value={formState.description}
                  onChange={(event) =>
                    setFormState({ ...formState, description: event.target.value })
                  }
                  required
                />
              </div>
            </Grid>

            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div>
                <Label htmlFor="valid-from">Valid From</Label>
                <Input
                  id="valid-from"
                  type="datetime-local"
                  value={formState.valid_from}
                  onChange={(event) =>
                    setFormState({ ...formState, valid_from: event.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="valid-until">Valid Until</Label>
                <Input
                  id="valid-until"
                  type="datetime-local"
                  value={formState.valid_until}
                  onChange={(event) =>
                    setFormState({ ...formState, valid_until: event.target.value })
                  }
                  required
                />
              </div>
            </Grid>

            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div>
                <Label htmlFor="min-purchase">Minimum Purchase ($)</Label>
                <Input
                  id="min-purchase"
                  type="number"
                  min={0}
                  step={0.5}
                  value={formState.min_purchase_amount ?? ''}
                  onChange={(event) =>
                    setFormState({
                      ...formState,
                      min_purchase_amount: event.target.value
                        ? Number(event.target.value)
                        : null,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="max-discount">Maximum Discount ($)</Label>
                <Input
                  id="max-discount"
                  type="number"
                  min={0}
                  step={0.5}
                  value={formState.max_discount_amount ?? ''}
                  onChange={(event) =>
                    setFormState({
                      ...formState,
                      max_discount_amount: event.target.value
                        ? Number(event.target.value)
                        : null,
                    })
                  }
                />
              </div>
            </Grid>

            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <Label htmlFor="bulk-active" className="text-sm font-medium">
                  Set campaign active
                </Label>
                <p className="text-xs text-muted-foreground">
                  Generated coupons will be immediately usable when active.
                </p>
              </div>
              <Switch
                id="bulk-active"
                checked={formState.is_active}
                onCheckedChange={(checked) =>
                  setFormState({ ...formState, is_active: Boolean(checked) })
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Generating...' : `Generate ${formState.count} Coupons`}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
