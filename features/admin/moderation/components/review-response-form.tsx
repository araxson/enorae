'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemActions, ItemGroup } from '@/components/ui/item'

interface ReviewResponseFormProps {
  value: string
  onChange: (value: string) => void
  onCancel: () => void
  onSubmit: () => void
  isLoading: boolean
}

export function ReviewResponseForm({ value, onChange, onCancel, onSubmit, isLoading }: ReviewResponseFormProps) {
  return (
    <div className="space-y-3">
      <Field>
        <FieldLabel htmlFor="response">Your response</FieldLabel>
        <FieldContent>
          <Textarea
            id="response"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Enter your response to this review..."
            rows={4}
            maxLength={1000}
          />
          <FieldDescription>{value.length}/1000 characters</FieldDescription>
        </FieldContent>
      </Field>
      <ItemGroup className="justify-end">
        <Item variant="muted">
          <ItemActions>
            <ButtonGroup>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={onSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Submitting…
                  </>
                ) : (
                  'Submit response'
                )}
              </Button>
            </ButtonGroup>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  )
}
