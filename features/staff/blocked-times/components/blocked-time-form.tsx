'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { blockedTimeSchema, type BlockedTimeFormData } from '@/features/staff/blocked-times/schema'
import { createBlockedTime, updateBlockedTime } from '@/features/staff/blocked-times/api/mutations'
import type { BlockedTime } from '@/features/staff/blocked-times/types'

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
      end_time: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
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
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="datetime-local"
            {...register('start_time')}
          />
          {errors['start_time'] && (
            <p className="text-destructive mt-1">{errors['start_time'].message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="datetime-local"
            {...register('end_time')}
          />
          {errors['end_time'] && (
            <p className="text-destructive mt-1">{errors['end_time'].message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="block_type">Block Type</Label>
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
          {errors['block_type'] && (
            <p className="text-destructive mt-1">{errors['block_type'].message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            placeholder="Enter reason for blocked time"
            {...register('reason')}
          />
          {errors['reason'] && (
            <p className="text-destructive mt-1">{errors['reason'].message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_recurring"
            checked={isRecurring}
            onCheckedChange={(checked) => setValue('is_recurring', checked)}
          />
          <Label htmlFor="is_recurring">Recurring</Label>
        </div>

        {error && (
          <p className="text-destructive">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : blockedTime ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </form>
  )
}
