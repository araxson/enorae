'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createBlockedTime } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { AlertCircle, Repeat } from 'lucide-react'

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
  const [blockType, setBlockType] = useState('manual')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrencePattern, setRecurrencePattern] = useState('weekly')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    const result = await createBlockedTime({
      salon_id: salonId,
      staff_id: staffId,
      block_type: (formData.get('block_type') as string) || 'manual',
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
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Block time slot</h3>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="block_type">Block type</Label>
            <Select name="block_type" value={blockType} onValueChange={setBlockType}>
              <SelectTrigger>
                <SelectValue placeholder="Select block type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="personal">Personal leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_time">Start time</Label>
            <Input id="start_time" name="start_time" type="datetime-local" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_time">End time</Label>
            <Input id="end_time" name="end_time" type="datetime-local" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="e.g., Salon closed for maintenance"
              rows={3}
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="is_recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(!!checked)}
              />
              <Label htmlFor="is_recurring" className="flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                Make this a recurring block
              </Label>
            </div>

            {isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="recurrence_pattern">Recurrence pattern</Label>
                <Select value={recurrencePattern} onValueChange={setRecurrencePattern}>
                  <SelectTrigger>
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
                <p className="text-sm text-muted-foreground text-xs">
                  {recurrencePattern === 'daily' && 'Repeats every day at the same time.'}
                  {recurrencePattern === 'weekly' && 'Repeats every week on the same day.'}
                  {recurrencePattern === 'biweekly' && 'Repeats every two weeks on the same day.'}
                  {recurrencePattern === 'monthly' && 'Repeats every month on the same date.'}
                  {recurrencePattern === 'yearly' && 'Repeats every year on the same date.'}
                  {recurrencePattern === 'weekdays' && 'Repeats every weekday (Mon–Fri).'}
                  {recurrencePattern === 'weekends' && 'Repeats every weekend (Sat–Sun).'}
                </p>
              </div>
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
            {isLoading ? 'Creating...' : 'Block time'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
