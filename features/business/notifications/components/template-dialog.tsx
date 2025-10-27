'use client'

import { useId } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { NotificationTemplate } from '@/features/business/notifications/api/queries'
import { eventOptions, channelOptions } from './template-constants'
import { Label } from '@/components/ui/label'

interface TemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTemplate: NotificationTemplate | null
  draft: {
    name: string
    description: string
    event: NotificationTemplate['event']
    channel: NotificationTemplate['channel']
    subject: string
    body: string
  }
  onDraftChange: (draft: TemplateDialogProps['draft']) => void
  onSave: () => void
  isPending: boolean
}

export function TemplateDialog({
  open,
  onOpenChange,
  editingTemplate,
  draft,
  onDraftChange,
  onSave,
  isPending,
}: TemplateDialogProps) {
  const nameFieldId = useId()
  const eventFieldId = useId()
  const channelFieldId = useId()
  const subjectFieldId = useId()
  const descriptionFieldId = useId()
  const bodyFieldId = useId()

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onOpenChange(false)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create Template'}</DialogTitle>
          <DialogDescription>
            Configure the messaging template name, event, channel, and copy before saving.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={nameFieldId}>
                Name
              </Label>
              <Input
                id={nameFieldId}
                value={draft.name}
                onChange={(event) => onDraftChange({ ...draft, name: event.target.value })}
                placeholder="e.g. Review Request"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={eventFieldId}>
                Event
              </Label>
              <Select
                value={draft.event}
                onValueChange={(value: NotificationTemplate['event']) =>
                  onDraftChange({ ...draft, event: value })
                }
              >
                <SelectTrigger id={eventFieldId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventOptions.map((event) => (
                    <SelectItem key={event} value={event}>
                      {event.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={channelFieldId}>
                Channel
              </Label>
              <Select
                value={draft.channel}
                onValueChange={(value: NotificationTemplate['channel']) =>
                  onDraftChange({ ...draft, channel: value })
                }
              >
                <SelectTrigger id={channelFieldId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {channelOptions.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={subjectFieldId}>
                Subject
              </Label>
              <Input
                id={subjectFieldId}
                value={draft.subject}
                onChange={(event) => onDraftChange({ ...draft, subject: event.target.value })}
                placeholder="Used for email or push notifications"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={descriptionFieldId}>
              Description
            </Label>
            <Input
              id={descriptionFieldId}
              value={draft.description}
              onChange={(event) => onDraftChange({ ...draft, description: event.target.value })}
              placeholder="Internal description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={bodyFieldId}>
              Body
            </Label>
            <Textarea
              id={bodyFieldId}
              value={draft.body}
              onChange={(event) => onDraftChange({ ...draft, body: event.target.value })}
              placeholder="Use {{placeholders}} to personalize messages"
              rows={8}
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="default" onClick={onSave} disabled={isPending || draft.name.trim().length === 0}>
              {isPending ? 'Saving...' : 'Save Template'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
