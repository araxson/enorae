'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                placeholder="e.g. Review Request"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Event</label>
              <Select
                value={formData.event}
                onValueChange={(value: NotificationTemplate['event']) =>
                  onFormChange({ ...formData, event: value })
                }
              >
                <SelectTrigger>
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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Channel</label>
              <Select
                value={formData.channel}
                onValueChange={(value: NotificationTemplate['channel']) =>
                  onFormChange({ ...formData, channel: value })
                }
              >
                <SelectTrigger>
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
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={formData.subject}
                onChange={(e) => onFormChange({ ...formData, subject: e.target.value })}
                placeholder="Used for email or push notifications"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              placeholder="Internal description"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Body</label>
            <Textarea
              value={formData.body}
              onChange={(e) => onFormChange({ ...formData, body: e.target.value })}
              placeholder="Use {{placeholders}} to personalize messages"
              rows={8}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={isPending || formData.name.trim().length === 0}
            >
              {isPending ? 'Saving...' : 'Save Template'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
