'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { BookingRuleWithService } from '@/features/business/booking-rules/api/queries'
import {
  FieldGroup,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  ServiceSelectorField,
  TimingFields,
  AdvanceBookingFields,
} from './booking-rule-form-fields'

interface BookingRuleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule?: BookingRuleWithService | null
  services: Array<{ id: string; name: string }>
  onSubmit: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
}

export function BookingRuleForm({
  open,
  onOpenChange,
  rule,
  services,
  onSubmit,
}: BookingRuleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string>(rule?.service_id || '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('serviceId', selectedServiceId)
    const result = await onSubmit(formData)

    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(rule ? 'Rule updated successfully' : 'Rule created successfully')
      onOpenChange(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{rule ? 'Edit' : 'Create'} Booking Rule</DialogTitle>
            <DialogDescription>
              Configure booking constraints for a service
            </DialogDescription>
          </DialogHeader>

          <FieldSet>
            <FieldGroup className="my-4 gap-4">
              <ServiceSelectorField
                selectedServiceId={selectedServiceId}
                onServiceChange={setSelectedServiceId}
                services={services}
                rule={rule}
              />
              <TimingFields rule={rule} />
              <AdvanceBookingFields rule={rule} />
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>{rule ? 'Update' : 'Create'}</span>
                )}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
