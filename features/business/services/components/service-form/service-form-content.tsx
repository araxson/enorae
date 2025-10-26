'use client'

import { Loader2 } from 'lucide-react'

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ServiceBasicSection } from './service-basic-section'
import { ServiceDurationSection } from './service-duration-section'
import { ServicePricingSection } from './service-pricing-section'
import { ServiceSettingsSection } from './service-settings-section'
import { ServiceTaxSection } from './service-tax-section'
import type { ServiceFormHook } from './use-service-form'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services_view']['Row']

type ServiceFormContentProps = {
  service: Service | null | undefined
} & ServiceFormHook

export function ServiceFormContent({ service, state, actions, handlers }: ServiceFormContentProps) {
  const {
    name,
    description,
    basePrice,
    salePrice,
    duration,
    buffer,
    isTaxable,
    taxRate,
    commissionRate,
    isActive,
    isBookable,
    isFeatured,
    isSubmitting,
    error,
  } = state

  const {
    setName,
    setDescription,
    setBasePrice,
    setSalePrice,
    setDuration,
    setBuffer,
    setIsTaxable,
    setTaxRate,
    setCommissionRate,
    setIsActive,
    setIsBookable,
    setIsFeatured,
  } = actions

  const { handleSubmit, handleClose } = handlers

  return (
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
        <div className="flex flex-col gap-6">
          <ServiceBasicSection
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
          />

          <ServicePricingSection
            basePrice={basePrice}
            salePrice={salePrice}
            onBasePriceChange={setBasePrice}
            onSalePriceChange={setSalePrice}
          />

          <ServiceTaxSection
            isTaxable={isTaxable}
            taxRate={taxRate}
            commissionRate={commissionRate}
            onTaxableChange={setIsTaxable}
            onTaxRateChange={setTaxRate}
            onCommissionRateChange={setCommissionRate}
          />

          <ServiceDurationSection
            duration={duration}
            buffer={buffer}
            onDurationChange={setDuration}
            onBufferChange={setBuffer}
          />

          <ServiceSettingsSection
            isActive={isActive}
            isBookable={isBookable}
            isFeatured={isFeatured}
            onActiveChange={setIsActive}
            onBookableChange={setIsBookable}
            onFeaturedChange={setIsFeatured}
          />

          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {service ? 'Update Service' : 'Create Service'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
