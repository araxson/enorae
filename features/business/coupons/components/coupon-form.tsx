'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { Checkbox } from '@/components/ui/checkbox'
import { createCoupon, updateCoupon } from '../api/coupons.mutations'
import { useToast } from '@/hooks/use-toast'
import type { CouponWithStats } from '../api/coupon-validation.queries'

interface CouponFormProps {
  salonId: string
  services: { id: string; name: string }[]
  coupon?: CouponWithStats
  onSuccess?: () => void
}

type CouponFormState = {
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_purchase_amount: number | null
  max_discount_amount: number | null
  max_uses: number | null
  max_uses_per_customer: number | null
  valid_from: string
  valid_until: string
  is_active: boolean
  applicable_services: string[]
  applicable_customer_ids: string
}

const defaultState: CouponFormState = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 0,
  min_purchase_amount: null,
  max_discount_amount: null,
  max_uses: null,
  max_uses_per_customer: 1,
  valid_from: '',
  valid_until: '',
  is_active: true,
  applicable_services: [],
  applicable_customer_ids: '',
}

export function CouponForm({ salonId, services, coupon, onSuccess }: CouponFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<CouponFormState>(() => {
    if (!coupon) return defaultState
    return {
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type as 'percentage' | 'fixed',
      discount_value: Number(coupon.discount_value || 0),
      min_purchase_amount: coupon.min_purchase_amount || null,
      max_discount_amount: coupon.max_discount_amount || null,
      max_uses: coupon.max_uses || null,
      max_uses_per_customer: coupon.max_uses_per_customer || null,
      valid_from: coupon.valid_from ? coupon.valid_from.slice(0, 16) : '',
      valid_until: coupon.valid_until ? coupon.valid_until.slice(0, 16) : '',
      is_active: coupon.is_active ?? true,
      applicable_services: coupon.applicable_services || [],
      applicable_customer_ids: (coupon.applicable_customer_ids || []).join('\n'),
    }
  })

  useEffect(() => {
    if (!coupon) {
      setFormData(defaultState)
      return
    }

    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type as 'percentage' | 'fixed',
      discount_value: Number(coupon.discount_value || 0),
      min_purchase_amount: coupon.min_purchase_amount || null,
      max_discount_amount: coupon.max_discount_amount || null,
      max_uses: coupon.max_uses || null,
      max_uses_per_customer: coupon.max_uses_per_customer || null,
      valid_from: coupon.valid_from ? coupon.valid_from.slice(0, 16) : '',
      valid_until: coupon.valid_until ? coupon.valid_until.slice(0, 16) : '',
      is_active: coupon.is_active ?? true,
      applicable_services: coupon.applicable_services || [],
      applicable_customer_ids: (coupon.applicable_customer_ids || []).join('\n'),
    })
  }, [coupon])

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setFormData({ ...formData, code })
  }

  const isEditing = Boolean(coupon)

  const selectedServiceIds = useMemo(() => new Set(formData.applicable_services), [formData.applicable_services])

  const toggleService = (serviceId: string, checked: boolean) => {
    setFormData((current) => {
      if (checked) {
        if (current.applicable_services.includes(serviceId)) return current
        return {
          ...current,
          applicable_services: [...current.applicable_services, serviceId],
        }
      }

      return {
        ...current,
        applicable_services: current.applicable_services.filter((id) => id !== serviceId),
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        salon_id: salonId,
        code: formData.code.trim(),
        description: formData.description.trim(),
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        min_purchase_amount:
          formData.min_purchase_amount !== null ? Number(formData.min_purchase_amount) : null,
        max_discount_amount:
          formData.max_discount_amount !== null ? Number(formData.max_discount_amount) : null,
        max_uses: formData.max_uses !== null ? Number(formData.max_uses) : null,
        max_uses_per_customer:
          formData.max_uses_per_customer !== null ? Number(formData.max_uses_per_customer) : null,
        valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : new Date().toISOString(),
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : new Date().toISOString(),
        is_active: formData.is_active,
        applicable_services: formData.applicable_services.length
          ? formData.applicable_services
          : null,
        applicable_customer_ids: formData.applicable_customer_ids
          ? formData.applicable_customer_ids
              .split(/\r?\n/)
              .map((value) => value.trim())
              .filter(Boolean)
          : null,
      }

      if (isEditing && coupon?.id) {
        await updateCoupon(coupon.id, payload)
      } else {
        await createCoupon(payload)
      }

      toast({
        title: isEditing ? 'Coupon updated' : 'Coupon created',
        description: `Coupon code "${formData.code}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
      })

      onSuccess?.()

      if (!isEditing) {
        setFormData(defaultState)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} coupon. Please try again.`,
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
            <Label htmlFor="code">Coupon Code</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., SAVE20"
                required
              />
              <Button type="button" variant="outline" onClick={generateCode}>
                Generate
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this promotion..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount_type">Discount Type</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, discount_type: value })}
              >
                <SelectTrigger id="discount_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discount_value">
                Discount Value {formData.discount_type === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="discount_value"
                type="number"
                step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                min="0"
                max={formData.discount_type === 'percentage' ? '100' : undefined}
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_purchase">Minimum Purchase ($)</Label>
              <Input
                id="min_purchase"
                type="number"
                step="0.01"
                min="0"
                value={formData.min_purchase_amount ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_purchase_amount: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="max_discount">Max Discount ($)</Label>
              <Input
                id="max_discount"
                type="number"
                step="0.01"
                min="0"
                value={formData.max_discount_amount ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_discount_amount: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_uses">Max Total Uses</Label>
              <Input
                id="max_uses"
                type="number"
                min="1"
                value={formData.max_uses ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_uses: e.target.value ? parseInt(e.target.value, 10) : null,
                  })
                }
                placeholder="Unlimited"
              />
            </div>

            <div>
              <Label htmlFor="max_uses_per_customer">Max Uses Per Customer</Label>
              <Input
                id="max_uses_per_customer"
                type="number"
                min="1"
                value={formData.max_uses_per_customer ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_uses_per_customer: e.target.value ? parseInt(e.target.value, 10) : null,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valid_from">Valid From</Label>
              <Input
                id="valid_from"
                type="datetime-local"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="valid_until">Valid Until</Label>
              <Input
                id="valid_until"
                type="datetime-local"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Applicable Services</Label>
            <div className="mt-2 rounded-md border p-3 space-y-2 max-h-48 overflow-y-auto">
              {services.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active services available</p>
              ) : (
                services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/50"
                  >
                    <span className="text-sm">{service.name}</span>
                    <Checkbox
                      checked={selectedServiceIds.has(service.id)}
                      onCheckedChange={(checked) =>
                        toggleService(service.id, Boolean(checked))
                      }
                    />
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="customer_segments">Limit to customer IDs (optional)</Label>
            <Textarea
              id="customer_segments"
              value={formData.applicable_customer_ids}
              placeholder="Paste customer IDs, one per line"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  applicable_customer_ids: e.target.value,
                })
              }
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use this to target loyalty members or VIP customers. Leave blank to apply to all customers.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (isEditing ? 'Saving...' : 'Creating...') : isEditing ? 'Save Changes' : 'Create Coupon'}
          </Button>
        </Stack>
      </form>
    </Card>
  )
}
