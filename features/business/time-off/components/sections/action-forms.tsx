'use client'

import { useRef, useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ButtonGroup } from '@/components/ui/button-group'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { ItemDescription } from '@/components/ui/item'

type ActionFormsProps = {
  status: string | null
  requestId: string | null
  showRejectForm: boolean
  setShowRejectForm: (show: boolean) => void
  approveAction: (formData: FormData) => void
  rejectAction: (formData: FormData) => void
  approveSuccess: boolean | null
  rejectSuccess: boolean | null
  rejectErrors?: Record<string, string[]>
}

function ApproveButton() {
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
    >
      Approve
    </button>
  )
}

function RejectSubmitButton() {
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-4 py-2"
    >
      Confirm Reject
    </button>
  )
}

export function ActionForms({
  status,
  requestId,
  showRejectForm,
  setShowRejectForm,
  approveAction,
  rejectAction,
  approveSuccess,
  rejectSuccess,
  rejectErrors,
}: ActionFormsProps) {
  const rejectReasonRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (showRejectForm && rejectReasonRef.current) {
      rejectReasonRef.current.focus()
    }
  }, [showRejectForm])

  useEffect(() => {
    if (rejectErrors && rejectReasonRef.current) {
      rejectReasonRef.current.focus()
    }
  }, [rejectErrors])

  if (status !== 'pending' || approveSuccess || rejectSuccess) return null

  const rejectionReasonError = rejectErrors?.['rejectionReason']?.[0]

  return (
    <>
      <Separator />
      <div>
        {!showRejectForm ? (
          <div className="flex flex-col gap-4">
            <form action={approveAction}>
              <input type="hidden" name="requestId" value={requestId || ''} />
              <ButtonGroup>
                <ApproveButton />
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  Reject
                </button>
              </ButtonGroup>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <form action={rejectAction} className="flex flex-col gap-3">
              <input type="hidden" name="requestId" value={requestId || ''} />

              <Field>
                <FieldLabel htmlFor="rejectionReason">
                  Reason for Rejection
                  <span className="text-destructive" aria-label="required"> *</span>
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    ref={rejectReasonRef}
                    id="rejectionReason"
                    name="rejectionReason"
                    placeholder="Please provide a detailed reason for rejecting this request..."
                    rows={3}
                    required
                    aria-required="true"
                    aria-invalid={!!rejectionReasonError}
                    aria-describedby={rejectionReasonError ? 'rejection-reason-error rejection-reason-hint' : 'rejection-reason-hint'}
                    className={rejectionReasonError ? 'border-destructive' : ''}
                  />
                  <ItemDescription id="rejection-reason-hint">
                    Minimum 10 characters required. This will be visible to the staff member.
                  </ItemDescription>
                  {rejectionReasonError && (
                    <p id="rejection-reason-error" className="text-sm text-destructive mt-1" role="alert">
                      {rejectionReasonError}
                    </p>
                  )}
                </FieldContent>
              </Field>

              <ButtonGroup>
                <RejectSubmitButton />
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  Cancel
                </button>
              </ButtonGroup>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
