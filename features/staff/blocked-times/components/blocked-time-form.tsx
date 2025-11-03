'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { blockedTimeSchema, type BlockedTimeFormData } from '../api/schema'
import { createBlockedTime, updateBlockedTime } from '../api/mutations'
import type { BlockedTime } from '@/features/staff/blocked-times/api/types'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { TIME_MS } from '@/lib/config/constants'

interface BlockedTimeFormProps {
  blockedTime?: BlockedTime
  onSuccess?: () => void
  onCancel?: () => void
}

export function BlockedTimeForm({ blockedTime, onSuccess, onCancel }: BlockedTimeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlockedTimeFormData>({
    resolver: zodResolver(blockedTimeSchema),
    defaultValues: blockedTime ? {
      start_time: new Date(blockedTime['start_time'] || '').toISOString().slice(0, 16),
      end_time: new Date(blockedTime['end_time'] || '').toISOString().slice(0, 16),
      block_type: blockedTime['block_type'] || 'break',
      reason: blockedTime['reason'] || '',
      is_recurring: blockedTime['is_recurring'] || false,
      recurrence_pattern: blockedTime['recurrence_pattern'] || null,
    } : {
      start_time: new Date().toISOString().slice(0, 16),
      end_time: new Date(Date.now() + TIME_MS.ONE_HOUR).toISOString().slice(0, 16),
      block_type: 'break',
      reason: '',
      is_recurring: false,
      recurrence_pattern: null,
    },
  })

  const isRecurring = watch('is_recurring')

  const onSubmit = async (data: BlockedTimeFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (blockedTime?.['id']) {
        await updateBlockedTime(blockedTime['id'], data)
      } else {
        await createBlockedTime(data)
      }

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend>Timing</FieldLegend>
        <FieldGroup className="@md/field-group:grid @md/field-group:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="start_time">Start Time</FieldLabel>
            <FieldContent>
              <Input
                id="start_time"
                type="datetime-local"
                {...register('start_time')}
              />
              {errors['start_time'] ? (
                <FieldError>{errors['start_time'].message}</FieldError>
              ) : null}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="end_time">End Time</FieldLabel>
            <FieldContent>
              <Input
                id="end_time"
                type="datetime-local"
                {...register('end_time')}
              />
              {errors['end_time'] ? (
                <FieldError>{errors['end_time'].message}</FieldError>
              ) : null}
            </FieldContent>
          </Field>
        </FieldGroup>

        <FieldSeparator />

        <Field>
          <FieldLabel htmlFor="block_type">Block Type</FieldLabel>
          <FieldContent>
            <Select
              value={watch('block_type')}
              onValueChange={(value) => setValue('block_type', value as BlockedTimeFormData['block_type'])}
            >
              <SelectTrigger id="block_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="break">Break</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick_leave">Sick Leave</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors['block_type'] ? (
              <FieldError>{errors['block_type'].message}</FieldError>
            ) : null}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="reason">Reason</FieldLabel>
          <FieldContent>
            <Textarea
              id="reason"
              placeholder="Enter reason for blocked time"
              {...register('reason')}
            />
            {errors['reason'] ? (
              <FieldError>{errors['reason'].message}</FieldError>
            ) : null}
          </FieldContent>
        </Field>

        <Field orientation="horizontal">
          <FieldLabel htmlFor="is_recurring">Recurring</FieldLabel>
          <FieldContent>
            <Switch
              id="is_recurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setValue('is_recurring', checked)}
            />
          </FieldContent>
        </Field>

        {error ? <FieldError>{error}</FieldError> : null}

        <div className="flex justify-end">
          <ButtonGroup>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{blockedTime ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </ButtonGroup>
        </div>
      </FieldSet>
    </form>
  )
}
