'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Stack } from '@/components/layout'
import { createService, updateService } from '../api/mutations'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']

interface ServiceFormDialogProps {
  open: boolean
  onClose: () => void
  salonId: string
  service?: Service | null
  onSuccess?: () => void
}

export function ServiceFormDialog({
  open,
  onClose,
  salonId,
  service,
  onSuccess,
}: ServiceFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [duration, setDuration] = useState('')
  const [buffer, setBuffer] = useState('')
  const [isTaxable, setIsTaxable] = useState(true)
  const [taxRate, setTaxRate] = useState('')
  const [commissionRate, setCommissionRate] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isBookable, setIsBookable] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  // Pre-fill form when editing
  useEffect(() => {
    if (service) {
      setName(service.name || '')
      setDescription(service.description || '')
      setBasePrice(service.price?.toString() || '')
      setSalePrice(service.sale_price?.toString() || '')
      setDuration(service.duration_minutes?.toString() || '')
      setBuffer(service.buffer_minutes?.toString() || '0')
      // Note: Tax and commission fields don't exist on the services view
      // They're only set during creation/update mutations
      setIsTaxable(true)
      setTaxRate('')
      setCommissionRate('')
      setIsActive(service.is_active ?? true)
      setIsBookable(service.is_bookable ?? true)
      setIsFeatured(service.is_featured ?? false)
    } else {
      // Reset form for new service
      setName('')
      setDescription('')
      setBasePrice('')
      setSalePrice('')
      setDuration('')
      setBuffer('0')
      setIsTaxable(true)
      setTaxRate('')
      setCommissionRate('')
      setIsActive(true)
      setIsBookable(true)
      setIsFeatured(false)
    }
    setError(null)
  }, [service, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (service) {
        // Update existing service
        await updateService(
          service.id as string,
          {
            name,
            description: description || undefined,
            is_active: isActive,
            is_bookable: isBookable,
            is_featured: isFeatured,
          },
          {
            base_price: parseFloat(basePrice),
            sale_price: salePrice ? parseFloat(salePrice) : undefined,
            currency_code: 'USD',
            is_taxable: isTaxable,
            tax_rate: taxRate ? parseFloat(taxRate) : undefined,
            commission_rate: commissionRate ? parseFloat(commissionRate) : undefined,
          },
          {
            duration_minutes: parseInt(duration),
            buffer_minutes: parseInt(buffer) || 0,
          }
        )
      } else {
        // Create new service
        await createService(
          salonId,
          {
            name,
            description: description || undefined,
            is_active: isActive,
            is_bookable: isBookable,
            is_featured: isFeatured,
          },
          {
            base_price: parseFloat(basePrice),
            sale_price: salePrice ? parseFloat(salePrice) : undefined,
            currency_code: 'USD',
            is_taxable: isTaxable,
            tax_rate: taxRate ? parseFloat(taxRate) : undefined,
            commission_rate: commissionRate ? parseFloat(commissionRate) : undefined,
          },
          {
            duration_minutes: parseInt(duration),
            buffer_minutes: parseInt(buffer) || 0,
          }
        )
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>
            {service
              ? 'Update service details, pricing, and booking rules.'
              : 'Create a new service for your salon. Set pricing and duration.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Information</h3>

              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Women's Haircut"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the service..."
                  rows={3}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Pricing</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="basePrice">Base Price * ($)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required
                    placeholder="49.99"
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Sale Price ($)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="39.99"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Optional promotional price</p>
                </div>
              </div>
            </div>

            {/* Tax & Commission */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Tax & Commission</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isTaxable"
                    checked={isTaxable}
                    onCheckedChange={setIsTaxable}
                  />
                  <Label htmlFor="isTaxable" className="cursor-pointer">
                    Taxable
                  </Label>
                </div>

                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder="8.5"
                    disabled={!isTaxable}
                  />
                </div>

                <div>
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    placeholder="15"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Staff commission</p>
                </div>
              </div>
            </div>

            {/* Duration & Booking */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Duration & Booking</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration * (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    max="480"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    placeholder="60"
                  />
                </div>

                <div>
                  <Label htmlFor="buffer">Buffer Time (minutes)</Label>
                  <Input
                    id="buffer"
                    type="number"
                    min="0"
                    max="60"
                    value={buffer}
                    onChange={(e) => setBuffer(e.target.value)}
                    placeholder="15"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Time between appointments</p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Settings</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active
                  </Label>
                  <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isBookable" className="cursor-pointer">
                    Bookable Online
                  </Label>
                  <Switch id="isBookable" checked={isBookable} onCheckedChange={setIsBookable} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Featured Service
                  </Label>
                  <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
            )}
          </Stack>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {service ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
