'use client'

import { useActionState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Star, AlertCircle } from 'lucide-react'
import { updateReview } from '../api/mutations'
import { Field, FieldLabel, FieldContent, FieldDescription } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

interface EditReviewFormProps {
  reviewId: string
  salonId: string
  defaultComment: string | null
  defaultRating: number | null
  defaultTitle?: string | null
  onSuccess?: () => void
}

export function EditReviewForm({
  reviewId,
  salonId,
  defaultComment,
  defaultRating,
  defaultTitle,
  onSuccess,
}: EditReviewFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const result = await updateReview(reviewId, formData)
      if (result.success) {
        onSuccess?.()
      }
      return result
    },
    {}
  )

  const firstErrorRef = useRef<HTMLTextAreaElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.error && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.error])

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Updating review, please wait'}
        {state?.error && !isPending && state.error}
        {state?.success && !isPending && 'Review updated successfully'}
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="salonId" value={salonId} />

      {/* Error alert */}
      {state?.error && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="size-4" />
          <AlertTitle>Update failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Rating field with star buttons */}
      <Field>
        <FieldLabel htmlFor="rating">
          Overall rating
          <span className="text-destructive" aria-label="required">
            {' '}
            *
          </span>
        </FieldLabel>
        <FieldContent>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  defaultChecked={value === (defaultRating ?? 3)}
                  required
                  aria-required="true"
                  className="sr-only peer"
                  disabled={isPending}
                />
                <div
                  className="size-10 flex items-center justify-center motion-safe:transition-colors hover:bg-muted rounded peer-checked:bg-muted"
                  aria-hidden="true"
                >
                  <Star
                    className="size-5 peer-checked:fill-primary peer-checked:text-primary text-muted-foreground"
                  />
                </div>
                <span className="sr-only">Rate {value} star{value === 1 ? '' : 's'}</span>
              </label>
            ))}
          </div>
          <FieldDescription>Select your overall rating</FieldDescription>
        </FieldContent>
      </Field>

      {/* Title field */}
      <Field>
        <FieldLabel htmlFor="title">Title (optional)</FieldLabel>
        <FieldContent>
          <Input
            id="title"
            name="title"
            placeholder="Summarize your experience"
            maxLength={200}
            defaultValue={defaultTitle ?? ''}
            disabled={isPending}
            aria-describedby="title-hint"
          />
          <FieldDescription id="title-hint">Maximum 200 characters</FieldDescription>
        </FieldContent>
      </Field>

      {/* Comment field */}
      <Field>
        <FieldLabel htmlFor="comment">
          Your review
          <span className="text-destructive" aria-label="required">
            {' '}
            *
          </span>
        </FieldLabel>
        <FieldContent>
          <Textarea
            ref={state?.error ? firstErrorRef : null}
            id="comment"
            name="comment"
            placeholder="Share your experience..."
            rows={5}
            maxLength={2000}
            defaultValue={defaultComment ?? ''}
            required
            aria-required="true"
            aria-invalid={!!state?.error}
            aria-describedby={state?.error ? 'comment-error comment-hint' : 'comment-hint'}
            disabled={isPending}
          />
          <FieldDescription id="comment-hint">
            Minimum 10 characters, maximum 2000
          </FieldDescription>
          {state?.error && (
            <p id="comment-error" className="text-sm text-destructive mt-1" role="alert">
              {state.error}
            </p>
          )}
        </FieldContent>
      </Field>

      <Button type="submit" disabled={isPending} aria-busy={isPending}>
        {isPending ? (
          <>
            <Spinner className="size-4" />
            <span aria-hidden="true">Updating...</span>
            <span className="sr-only">Updating review, please wait</span>
          </>
        ) : (
          'Update Review'
        )}
      </Button>
    </form>
  )
}
