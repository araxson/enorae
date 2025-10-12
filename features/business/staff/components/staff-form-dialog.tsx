'use client'

import { useEffect, useState } from 'react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { createStaffMember, updateStaffMember } from '../api/mutations'
import type { StaffWithServices } from '../api/queries'
import { useStaffFormState } from './use-staff-form-state'
import { StaffFormFields } from './staff-form-fields'

type StaffFormDialogProps = {
  open: boolean
  onClose: () => void
  staff?: StaffWithServices | null
  onSuccess?: () => void
}

export function StaffFormDialog({ open, onClose, staff, onSuccess }: StaffFormDialogProps) {
  const form = useStaffFormState(staff)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    form.reset(staff)
    setError(null)
  }, [open, staff, form])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (staff) {
        await updateStaffMember(staff.id as string, {
          full_name: form.fullName,
          title: form.title || undefined,
          bio: form.bio || undefined,
          experience_years: form.experienceYears ? parseInt(form.experienceYears, 10) : undefined,
        })
      } else {
        await createStaffMember({
          email: form.email,
          full_name: form.fullName,
          title: form.title || undefined,
          bio: form.bio || undefined,
          phone: form.phone || undefined,
          experience_years: form.experienceYears ? parseInt(form.experienceYears, 10) : undefined,
        })
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save staff member')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{staff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          <DialogDescription>
            {staff
              ? 'Update staff member information and settings.'
              : 'Add a new team member to your salon. They will be invited to join the platform.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <StaffFormFields form={form} disabled={isSubmitting} staff={staff} />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {staff ? 'Update Staff Member' : 'Add Staff Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
