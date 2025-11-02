'use client'

import { useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface EditReviewFormProps {
  salonId: string
  defaultComment: string | null
  defaultRating: number | null
}

export function EditReviewForm({
  salonId,
  defaultComment,
  defaultRating,
}: EditReviewFormProps) {
  const [rating, setRating] = useState(defaultRating || 3)

  return (
    <>
      <input type="hidden" name="salonId" value={salonId} />

      <Field>
        <FieldLabel>Overall rating *</FieldLabel>
        <FieldContent className="gap-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <Toggle
                key={value}
                pressed={value <= rating}
                onPressedChange={(pressed) =>
                  setRating(pressed ? value : Math.max(1, value - 1))
                }
                aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                className="size-10"
                type="button"
              >
                <Star className="size-5" aria-hidden="true" />
              </Toggle>
            ))}
          </div>
          <FieldDescription>{rating} out of 5</FieldDescription>
          <input type="hidden" name="rating" value={rating} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="title">Title (optional)</FieldLabel>
        <FieldContent>
          <Input
            id="title"
            name="title"
            defaultValue=""
            placeholder="Summarize your experience"
            maxLength={200}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="comment">Your review *</FieldLabel>
        <FieldContent>
          <Textarea
            id="comment"
            name="comment"
            defaultValue={defaultComment || ''}
            placeholder="Share your experience..."
            rows={5}
            required
            minLength={10}
            maxLength={2000}
          />
          <FieldDescription>
            Minimum 10 characters, maximum 2000
          </FieldDescription>
        </FieldContent>
      </Field>
    </>
  )
}
