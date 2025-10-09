'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Calendar } from 'lucide-react'
import { requestReschedule } from '../api/mutations'

interface RescheduleRequestDialogProps {
  appointmentId: string
  currentStartTime: string
  children?: React.ReactNode
}

export function RescheduleRequestDialog({
  appointmentId,
  currentStartTime,
  children,
}: RescheduleRequestDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await requestReschedule(appointmentId, formData)

    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  // Format current time for display
  const currentDate = new Date(currentStartTime)
  const minDateTime = new Date()
  minDateTime.setHours(minDateTime.getHours() + 24) // Minimum 24 hours from now

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            Request reschedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request reschedule</DialogTitle>
            <DialogDescription>
              Request to reschedule your appointment. The salon will review and confirm the new
              time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-time">Current appointment</Label>
              <Input
                id="current-time"
                value={currentDate.toLocaleString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newStartTime">Requested new time *</Label>
              <Input
                id="newStartTime"
                name="newStartTime"
                type="datetime-local"
                min={minDateTime.toISOString().slice(0, 16)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 24 hours from now
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Let the salon know why you need to reschedule..."
                rows={3}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your reschedule request will be sent to the salon for approval. You&apos;ll be
                notified once they respond.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending request...' : 'Send request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
