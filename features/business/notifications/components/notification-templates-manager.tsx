'use client'

import { useMemo, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stack, Grid } from '@/components/layout'
import { PenLine, PlusCircle, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { NotificationTemplate } from '../api/queries'
import { deleteNotificationTemplate, upsertNotificationTemplate } from '../api/mutations'

type NotificationTemplatesManagerProps = {
  templates: NotificationTemplate[]
}

const eventOptions: NotificationTemplate['event'][] = [
  'appointment_confirmation',
  'appointment_reminder',
  'appointment_cancelled',
  'appointment_rescheduled',
  'promotion',
  'review_request',
  'loyalty_update',
  'staff_message',
  'system_alert',
  'welcome',
  'birthday',
  'other',
]

const channelOptions: NotificationTemplate['channel'][] = ['email', 'sms', 'push', 'in_app', 'whatsapp']

export function NotificationTemplatesManager({ templates }: NotificationTemplatesManagerProps) {
  const { toast } = useToast()
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null)
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const formState = useMemo(() => {
    if (!editingTemplate) {
      return {
        name: '',
        description: '',
        event: 'promotion' as NotificationTemplate['event'],
        channel: 'email' as NotificationTemplate['channel'],
        subject: '',
        body: '',
      }
    }
    return {
      name: editingTemplate.name,
      description: editingTemplate.description || '',
      event: editingTemplate.event,
      channel: editingTemplate.channel,
      subject: editingTemplate.subject || '',
      body: editingTemplate.body,
    }
  }, [editingTemplate])

  const [draft, setDraft] = useState(formState)

  const handleOpen = (template?: NotificationTemplate) => {
    setEditingTemplate(template || null)
    setDraft(
      template
        ? {
            name: template.name,
            description: template.description || '',
            event: template.event,
            channel: template.channel,
            subject: template.subject || '',
            body: template.body,
          }
        : {
            name: '',
            description: '',
            event: 'promotion',
            channel: 'email',
            subject: '',
            body: '',
          }
    )
    setOpen(true)
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        await upsertNotificationTemplate({
          ...(editingTemplate ?? {}),
          ...draft,
        } as NotificationTemplate)

        toast({
          title: 'Template saved',
          description: 'Notification template has been updated successfully.',
        })
        setOpen(false)
        setEditingTemplate(null)
      } catch (error) {
        toast({
          title: 'Unable to save template',
          description: error instanceof Error ? error.message : 'Please try again.',
          variant: 'destructive',
        })
      }
    })
  }

  const handleDelete = (templateId: string) => {
    startTransition(async () => {
      try {
        await deleteNotificationTemplate(templateId)
        toast({
          title: 'Template removed',
          description: 'Template deleted successfully.',
        })
      } catch (error) {
        toast({
          title: 'Unable to delete template',
          description: error instanceof Error ? error.message : 'Please try again.',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notification Templates</CardTitle>
            <CardDescription>
              Manage reusable communication templates for campaigns and automations
            </CardDescription>
          </div>
          <Button onClick={() => handleOpen()} disabled={isPending}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No templates configured yet. Create your first template to standardize notifications.
            </div>
          ) : (
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              {templates.map((template) => (
                <Card key={template.id} className="border-muted">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {(template.description || template.event.replace('_', ' ')).toString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {template.channel}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {template.event.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {template.subject ? (
                      <p className="text-sm font-semibold">{template.subject}</p>
                    ) : null}
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                      {template.body}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpen(template)}
                        disabled={isPending}
                      >
                        <PenLine className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(next) => !next && setOpen(false)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create Template'}</DialogTitle>
          </DialogHeader>
          <Stack gap="lg">
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  placeholder="e.g. Review Request"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Event</label>
                <Select
                  value={draft.event}
                  onValueChange={(value: NotificationTemplate['event']) =>
                    setDraft({ ...draft, event: value })
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
            </Grid>
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              <div>
                <label className="text-sm font-medium">Channel</label>
                <Select
                  value={draft.channel}
                  onValueChange={(value: NotificationTemplate['channel']) =>
                    setDraft({ ...draft, channel: value })
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
                  value={draft.subject}
                  onChange={(event) => setDraft({ ...draft, subject: event.target.value })}
                  placeholder="Used for email or push notifications"
                />
              </div>
            </Grid>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                placeholder="Internal description"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Body</label>
              <Textarea
                value={draft.body}
                onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                placeholder="Use {{placeholders}} to personalize messages"
                rows={8}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isPending || draft.name.trim().length === 0}>
                {isPending ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
