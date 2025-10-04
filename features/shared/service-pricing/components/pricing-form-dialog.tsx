'use client'

import { useState, useEffect } from 'react'
import { Loader2, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack, Grid } from '@/components/layout'
import { Muted } from '@/components/ui/typography'
import { upsertServicePricing } from '../api/mutations'
import type { ServicePricingWithService } from '../api/queries'

interface PricingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  services: Array<{ id: string; name: string }>
  editPricing?: ServicePricingWithService | null
}

export function PricingFormDialog({
  open,
  onOpenChange,
  services,
  editPricing,
}: PricingFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    serviceId: '',
    basePrice: '',
    salePrice: '',
    cost: '',
    taxRate: '',
    isTaxable: true,
    commissionRate: '',
    currencyCode: 'USD',
  })

  useEffect(() => {
    if (open && editPricing) {
      setFormData({
        serviceId: editPricing.service_id || '',
        basePrice: editPricing.base_price?.toString() || '',
        salePrice: editPricing.sale_price?.toString() || '',
        cost: editPricing.cost?.toString() || '',
        taxRate: editPricing.tax_rate?.toString() || '',
        isTaxable: editPricing.is_taxable ?? true,
        commissionRate: editPricing.commission_rate?.toString() || '',
        currencyCode: editPricing.currency_code || 'USD',
      })
    } else if (open && !editPricing) {
      setFormData({
        serviceId: '',
        basePrice: '',
        salePrice: '',
        cost: '',
        taxRate: '',
        isTaxable: true,
        commissionRate: '',
        currencyCode: 'USD',
      })
    }
  }, [open, editPricing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataObj = new FormData()
      if (editPricing?.id) {
        formDataObj.append('id', editPricing.id)
      }
      formDataObj.append('serviceId', formData.serviceId)
      formDataObj.append('basePrice', formData.basePrice)
      if (formData.salePrice) formDataObj.append('salePrice', formData.salePrice)
      if (formData.cost) formDataObj.append('cost', formData.cost)
      if (formData.taxRate) formDataObj.append('taxRate', formData.taxRate)
      formDataObj.append('isTaxable', formData.isTaxable.toString())
      if (formData.commissionRate) formDataObj.append('commissionRate', formData.commissionRate)
      formDataObj.append('currencyCode', formData.currencyCode)

      const result = await upsertServicePricing(formDataObj)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Pricing ${editPricing ? 'updated' : 'created'} successfully`)
        onOpenChange(false)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const calculateProfit = () => {
    const price = parseFloat(formData.salePrice || formData.basePrice)
    const cost = parseFloat(formData.cost)
    if (price && cost && price > 0) {
      return (((price - cost) / price) * 100).toFixed(1)
    }
    return '0'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPricing ? 'Edit Service Pricing' : 'Add Service Pricing'}</DialogTitle>
          <DialogDescription>
            {editPricing ? 'Update pricing details for this service' : 'Set pricing for a service'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* Service Selection */}
            {!editPricing && (
              <div className="space-y-2">
                <Label htmlFor="service">
                  Service <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.serviceId}
                  onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                  required
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.filter(s => s.id).map((service) => (
                      <SelectItem key={service.id!} value={service.id!}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Base Pricing */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <Label className="font-semibold">Base Pricing</Label>
              </div>

              <Grid cols={{ base: 1, md: 2 }} gap="md">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">
                    Base Price <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                  <Muted className="text-xs">Regular service price</Muted>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="0.00"
                  />
                  <Muted className="text-xs">Discounted price (optional)</Muted>
                </div>
              </Grid>
            </div>

            {/* Cost & Profitability */}
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <Label className="font-semibold">Cost & Profitability</Label>

              <Grid cols={{ base: 1, md: 2 }} gap="md">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="0.00"
                  />
                  <Muted className="text-xs">Cost to provide this service</Muted>
                </div>

                <div className="space-y-2">
                  <Label>Estimated Profit Margin</Label>
                  <div className="h-10 flex items-center px-3 rounded-md border bg-muted text-lg font-semibold text-primary">
                    {calculateProfit()}%
                  </div>
                  <Muted className="text-xs">Auto-calculated from price & cost</Muted>
                </div>
              </Grid>
            </div>

            {/* Tax & Commission */}
            <div className="space-y-3 p-4 border rounded-lg">
              <Label className="font-semibold">Tax & Commission</Label>

              <Grid cols={{ base: 1, md: 2 }} gap="md">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                    placeholder="0.00"
                  />
                  <Muted className="text-xs">Sales tax percentage</Muted>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                    placeholder="0.00"
                  />
                  <Muted className="text-xs">Staff commission percentage</Muted>
                </div>
              </Grid>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isTaxable"
                  checked={formData.isTaxable}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isTaxable: checked as boolean })
                  }
                />
                <Label htmlFor="isTaxable" className="cursor-pointer">
                  This service is taxable
                </Label>
              </div>
            </div>
          </Stack>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editPricing ? 'Update Pricing' : 'Add Pricing'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
