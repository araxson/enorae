'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/sonner'
import { createBlockedTime } from '@/features/shared/blocked-times/api/mutations'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Repeat } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldContent,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { BlockTypeSelect } from './block-type-select'
import { RecurrencePatternSelect } from './recurrence-pattern-select'

interface BlockedTimeFormProps {
  salonId: string
  staffId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function BlockedTimeForm({
  salonId,
  staffId,
  onSuccess,
  onCancel,
}: BlockedTimeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blockType, setBlockType] = useState('other')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrencePattern, setRecurrencePattern] = useState('weekly')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    const blockTypeValue = (formData.get('block_type') as string) || 'other'

    const result = await createBlockedTime({
      salon_id: salonId,
      staff_id: staffId,
      block_type: blockTypeValue as 'personal' | 'break' | 'lunch' | 'holiday' | 'vacation' | 'sick_leave' | 'training' | 'maintenance' | 'other',
      start_time: new Date(formData.get('start_time') as string).toISOString(),
      end_time: new Date(formData.get('end_time') as string).toISOString(),
      reason: (formData.get('reason') as string) || undefined,
      is_recurring: isRecurring,
      recurrence_pattern: isRecurring ? recurrencePattern : undefined,
    })

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
      toast.error(result.error)
      return
    }

    toast.success('Time slot blocked successfully!')
    if (onSuccess) {
      onSuccess()
    } else {
      router.refresh()
    }
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Block time slot</ItemTitle>
      </ItemHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <ItemContent>
          <div className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Failed to block time</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <BlockTypeSelect value={blockType} onChange={setBlockType} />

          <Field>
            <FieldLabel htmlFor="start_time">Start time</FieldLabel>
            <FieldContent>
              <Input id="start_time" name="start_time" type="datetime-local" required />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="end_time">End time</FieldLabel>
            <FieldContent>
              <Input id="end_time" name="end_time" type="datetime-local" required />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="reason">Reason (optional)</FieldLabel>
            <FieldContent>
              <Textarea
                id="reason"
                name="reason"
                placeholder="e.g., Salon closed for maintenance"
                rows={3}
              />
            </FieldContent>
          </Field>

          <Separator />
          <div className="flex flex-col gap-4 pt-4">
            <Field orientation="horizontal">
              <FieldLabel htmlFor="is_recurring">
                <span className="flex items-center gap-2">
                  <Repeat className="size-4" />
                  Make this a recurring block
                </span>
              </FieldLabel>
              <Checkbox
                id="is_recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked === true)}
              />
            </Field>

            {isRecurring && (
              <RecurrencePatternSelect value={recurrencePattern} onChange={setRecurrencePattern} />
            )}
          </div>
          </div>
        </ItemContent>
        <ItemFooter>
          <ButtonGroup aria-label="Form actions">
            {onCancel ? (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Block time</span>
              )}
            </Button>
          </ButtonGroup>
        </ItemFooter>
      </form>
    </Item>
  )
}
