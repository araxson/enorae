'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createBlockedTime } from '@/features/shared/blocked-times/api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Repeat } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
    <Card>
      <CardHeader>
        <CardTitle>Block time slot</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to block time</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Field>
            <FieldLabel htmlFor="block_type">Block type</FieldLabel>
            <FieldContent>
              <Select name="block_type" value={blockType} onValueChange={setBlockType}>
                <SelectTrigger id="block_type">
                  <SelectValue placeholder="Select block type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="sick_leave">Sick leave</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

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
          <div className="space-y-4 pt-4">
            <Field orientation="horizontal" className="items-center gap-4">
              <FieldLabel htmlFor="is_recurring" className="flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                Make this a recurring block
              </FieldLabel>
              <FieldContent className="flex-none">
                <Checkbox
                  id="is_recurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(!!checked)}
                />
              </FieldContent>
            </Field>

            {isRecurring && (
              <Field>
                <FieldLabel htmlFor="recurrence_pattern">Recurrence pattern</FieldLabel>
                <FieldContent>
                  <Select value={recurrencePattern} onValueChange={setRecurrencePattern}>
                    <SelectTrigger id="recurrence_pattern">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="weekdays">Weekdays only</SelectItem>
                      <SelectItem value="weekends">Weekends only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    {recurrencePattern === 'daily' && 'Repeats every day at the same time.'}
                    {recurrencePattern === 'weekly' && 'Repeats every week on the same day.'}
                    {recurrencePattern === 'biweekly' && 'Repeats every two weeks on the same day.'}
                    {recurrencePattern === 'monthly' && 'Repeats every month on the same date.'}
                    {recurrencePattern === 'yearly' && 'Repeats every year on the same date.'}
                    {recurrencePattern === 'weekdays' && 'Repeats every weekday (Mon–Fri).'}
                    {recurrencePattern === 'weekends' && 'Repeats every weekend (Sat–Sun).'}
                  </FieldDescription>
                </FieldContent>
              </Field>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
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
        </CardFooter>
      </form>
    </Card>
  )
}
