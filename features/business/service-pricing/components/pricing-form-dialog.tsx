'use client'

import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ServicePricingWithService } from '@/features/business/service-pricing/api/queries'
import {
  CostProfitSection,
  DynamicPricingPreview,
  ServiceSelection,
  TaxCommissionSection,
  usePricingForm,
} from './pricing-form'

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
  const { state, loading, profitMargin, actions, handlers } = usePricingForm({ open, editPricing })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const result = await handlers.handleSubmit(event)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(`Pricing ${editPricing ? 'updated' : 'created'} successfully`)
    onOpenChange(false)
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
          <div className="flex flex-col gap-6">
            <ServiceSelection
              services={services}
              state={state}
              editing={Boolean(editPricing)}
              onChange={actions.setField}
            />

            <CostProfitSection
              state={state}
              profitMargin={profitMargin}
              onChange={actions.setField}
            />

            <DynamicPricingPreview
              serviceId={state.serviceId}
              currencyCode={state.currencyCode}
            />

            <TaxCommissionSection state={state} onChange={actions.setField} />
          </div>

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
