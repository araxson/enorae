'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import type { NotificationTemplate } from '@/features/business/notifications/api/queries'

type TemplateFormData = {
  name: string
  description: string
  event: NotificationTemplate['event']
  channel: NotificationTemplate['channel']
  subject: string
  body: string
}

type TemplateFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: TemplateFormData
  onFormChange: (data: TemplateFormData) => void
  onSave: () => void
  isPending: boolean
  isEditMode: boolean
  eventOptions: NotificationTemplate['event'][]
  channelOptions: NotificationTemplate['channel'][]
}

export function TemplateFormDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSave,
  isPending,
  isEditMode,
  eventOptions,
  channelOptions,
}: TemplateFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Template' : 'Create Template'}</DialogTitle>
        </DialogHeader>
        <FieldGroup className="flex flex-col gap-6">
          <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="template-name">Name</FieldLabel>
              <FieldContent>
                <Input
                  id="template-name"
                  value={formData.name}
                  onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                  placeholder="e.g. Review Request"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="template-event">Event</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.event}
                  onValueChange={(value: NotificationTemplate['event']) =>
                    onFormChange({ ...formData, event: value })
                  }
                >
                  <SelectTrigger id="template-event">
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

          <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="template-channel">Channel</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.channel}
                  onValueChange={(value: NotificationTemplate['channel']) =>
                    onFormChange({ ...formData, channel: value })
                  }
                >
                  <SelectTrigger id="template-channel">
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
              <FieldLabel htmlFor="template-subject">Subject</FieldLabel>
              <FieldContent>
                <Input
                  id="template-subject"
                  value={formData.subject}
                  onChange={(e) => onFormChange({ ...formData, subject: e.target.value })}
                  placeholder="Used for email or push notifications"
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="template-description">Description</FieldLabel>
            <FieldContent>
              <Input
                id="template-description"
                value={formData.description}
                onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
                placeholder="Internal description"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="template-body">Body</FieldLabel>
            <FieldContent>
              <Textarea
                id="template-body"
                value={formData.body}
                onChange={(e) => onFormChange({ ...formData, body: e.target.value })}
                placeholder="Use {{placeholders}} to personalize messages"
                rows={8}
              />
              <FieldDescription>Supports markdown and template placeholders.</FieldDescription>
            </FieldContent>
          </Field>

          <DialogFooter>
            <ButtonGroup>
              <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button
                onClick={onSave}
                disabled={isPending || formData.name.trim().length === 0}
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
