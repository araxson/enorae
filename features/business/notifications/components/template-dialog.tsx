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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

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
        <FieldGroup className="flex flex-col gap-8">
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={nameFieldId}>Name</FieldLabel>
              <FieldContent>
                <Input
                  id={nameFieldId}
                  value={draft.name}
                  onChange={(event) => onDraftChange({ ...draft, name: event.target.value })}
                  placeholder="e.g. Review Request"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor={eventFieldId}>Event</FieldLabel>
              <FieldContent>
                <Select
                  value={draft.event}
                  onValueChange={(value: NotificationTemplate['event']) =>
                    onDraftChange({ ...draft, event: value })
                  }
                >
                  <SelectTrigger id={eventFieldId}>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventOptions.map((event) => (
                      <SelectItem key={event} value={event}>
                        {event.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </FieldGroup>

          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={channelFieldId}>Channel</FieldLabel>
              <FieldContent>
                <Select
                  value={draft.channel}
                  onValueChange={(value: NotificationTemplate['channel']) =>
                    onDraftChange({ ...draft, channel: value })
                  }
                >
                  <SelectTrigger id={channelFieldId}>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {channelOptions.map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {channel.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor={subjectFieldId}>Subject</FieldLabel>
              <FieldContent>
                <Input
                  id={subjectFieldId}
                  value={draft.subject}
                  onChange={(event) => onDraftChange({ ...draft, subject: event.target.value })}
                  placeholder="Used for email or push notifications"
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor={descriptionFieldId}>Description</FieldLabel>
            <FieldContent>
              <Input
                id={descriptionFieldId}
                value={draft.description}
                onChange={(event) => onDraftChange({ ...draft, description: event.target.value })}
                placeholder="Internal description"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={bodyFieldId}>Body</FieldLabel>
            <FieldContent>
              <Textarea
                id={bodyFieldId}
                value={draft.body}
                onChange={(event) => onDraftChange({ ...draft, body: event.target.value })}
                placeholder="Use {{placeholders}} to personalize messages"
                rows={8}
              />
              <FieldDescription>Supports markdown and template placeholders.</FieldDescription>
            </FieldContent>
          </Field>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <ButtonGroup>
              <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={onSave}
                disabled={isPending || draft.name.trim().length === 0}
              >
                {isPending ? 'Saving...' : 'Save Template'}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  )
}
