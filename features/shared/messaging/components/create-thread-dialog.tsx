'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/sonner'
import { createThread } from '@/features/shared/messaging/api/mutations'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface CreateThreadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salonId: string
}

export function CreateThreadDialog({ open, onOpenChange, salonId }: CreateThreadDialogProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!subject.trim() || !message.trim()) {
      toast.error('Please provide a subject and message.')
      return
    }

    setIsSubmitting(true)

    const result = await createThread({
      salon_id: salonId,
      subject: subject.trim(),
      priority: 'normal',
    })

    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Conversation created successfully!')
    setSubject('')
    setMessage('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new conversation</DialogTitle>
          <DialogDescription>
            Reach out to the salon with questions or appointment updates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>
            <FieldContent>
              <Input
                id="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Appointment follow-up"
                maxLength={120}
                required
              />
              <FieldDescription>Provide a brief summary for the conversation.</FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <FieldContent>
              <Textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Hi there..."
                rows={4}
                required
              />
            </FieldContent>
          </Field>

          <DialogFooter>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Start conversation</span>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
