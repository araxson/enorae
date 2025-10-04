'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/layout'
import { createThread } from '../api/mutations'

interface CreateThreadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salonId: string
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', description: 'General inquiry' },
  { value: 'normal', label: 'Normal', description: 'Standard request' },
  { value: 'high', label: 'High', description: 'Important matter' },
  { value: 'urgent', label: 'Urgent', description: 'Immediate attention needed' },
] as const

export function CreateThreadDialog({
  open,
  onOpenChange,
  salonId,
}: CreateThreadDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createThread({
        salon_id: salonId,
        subject: subject.trim() || undefined,
        priority,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Conversation started successfully')
        setSubject('')
        setPriority('normal')
        onOpenChange(false)
      }
    } catch {
      toast.error('Failed to start conversation')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
            <DialogDescription>
              Send a message to the salon. Set priority based on urgency.
            </DialogDescription>
          </DialogHeader>

          <Stack gap="lg" className="my-6">
            <Stack gap="sm">
              <Label htmlFor="subject">Subject (optional)</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Appointment inquiry"
                maxLength={200}
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as typeof priority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how urgently this message needs attention
              </p>
            </Stack>
          </Stack>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Start Conversation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
