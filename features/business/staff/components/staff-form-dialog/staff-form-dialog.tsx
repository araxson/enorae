'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import type { StaffWithServices } from '@/features/business/staff/api/queries'
import { StaffFormFields } from './staff-form-fields'
import { useStaffForm } from '../../hooks/use-staff-form'

type StaffFormDialogProps = {
  staff?: StaffWithServices | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function StaffFormDialog({ staff, open, onOpenChange, onSuccess }: StaffFormDialogProps) {
  const { form, error, isEditMode, handleSubmit } = useStaffForm({
    staff,
    onSuccess,
    onClose: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the staff member information'
              : 'Add a new staff member to your team'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <StaffFormFields form={form} showEmailField={!isEditMode} />

            <DialogFooter>
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Spinner className="size-4" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{isEditMode ? 'Update' : 'Create'}</span>
                  )}
                </Button>
              </ButtonGroup>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
