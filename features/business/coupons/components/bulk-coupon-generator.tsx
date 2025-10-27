'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { COUPONS_UNSUPPORTED_MESSAGE } from '@/features/business/coupons/api/messages'
import { useToast } from '@/lib/hooks/use-toast'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

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
    toast({
      title: 'Coupons unavailable',
      description: COUPONS_UNSUPPORTED_MESSAGE,
      variant: 'destructive',
    })
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Coupon Generator</CardTitle>
        <CardDescription>Create batches of coupons for marketing campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldSet className="flex flex-col gap-6">
            <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="prefix">Code Prefix</FieldLabel>
                <FieldContent>
                  <Input
                    id="prefix"
                    value={formState.prefix}
                    onChange={(event) =>
                      setFormState({ ...formState, prefix: event.target.value.toUpperCase() })
                    }
                    maxLength={6}
                    required
                  />
                  <FieldDescription>
                    Prefix will be combined with random characters for uniqueness.
                  </FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="count">Quantity</FieldLabel>
                <FieldContent>
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
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="discount-type">Discount Type</FieldLabel>
                <FieldContent>
                  <Select
                    value={formState.discount_type}
                    onValueChange={(value: 'percentage' | 'fixed') =>
                      setFormState({ ...formState, discount_type: value })
                    }
                  >
                    <SelectTrigger id="discount-type">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </FieldGroup>

            <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="discount-value">
                  Discount Value {formState.discount_type === 'percentage' ? '(%)' : '($)'}
                </FieldLabel>
                <FieldContent>
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
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Campaign Description</FieldLabel>
                <FieldContent>
                  <Input
                    id="description"
                    value={formState.description}
                    onChange={(event) =>
                      setFormState({ ...formState, description: event.target.value })
                    }
                    required
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="valid-from">Valid From</FieldLabel>
                <FieldContent>
                  <Input
                    id="valid-from"
                    type="datetime-local"
                    value={formState.valid_from}
                    onChange={(event) =>
                      setFormState({ ...formState, valid_from: event.target.value })
                    }
                    required
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="valid-until">Valid Until</FieldLabel>
                <FieldContent>
                  <Input
                    id="valid-until"
                    type="datetime-local"
                    value={formState.valid_until}
                    onChange={(event) =>
                      setFormState({ ...formState, valid_until: event.target.value })
                    }
                    required
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="min-purchase">Minimum Purchase ($)</FieldLabel>
                <FieldContent>
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
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="max-discount">Maximum Discount ($)</FieldLabel>
                <FieldContent>
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
                </FieldContent>
              </Field>
            </FieldGroup>

            <ItemGroup className="px-3 py-2">
              <Item className="items-start">
                <ItemContent>
                  <ItemTitle>
                    <FieldLabel htmlFor="bulk-active">Set campaign active</FieldLabel>
                  </ItemTitle>
                  <ItemDescription>
                    Generated coupons will be immediately usable when active.
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Switch
                    id="bulk-active"
                    checked={formState.is_active}
                    onCheckedChange={(checked) =>
                      setFormState({ ...formState, is_active: Boolean(checked) })
                    }
                  />
                </ItemActions>
              </Item>
            </ItemGroup>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>{`Generate ${formState.count} Coupons`}</span>
              )}
            </Button>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
