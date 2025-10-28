'use client'

import { useMemo, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import type { NotificationTemplate } from '@/features/business/notifications/api/queries'
import { deleteNotificationTemplate, upsertNotificationTemplate } from '@/features/business/notifications/api/mutations'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { TemplateCard } from './template-card'
import { TemplateFormDialog } from './template-form-dialog'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
          id: editingTemplate?.id,
          name: draft.name,
          description: draft.description || undefined,
          event: draft.event,
          channel: draft.channel,
          subject: draft.subject || undefined,
          body: draft.body,
        })

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
        <CardHeader>
          <ItemGroup>
            <Item className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <ItemContent className="flex flex-col gap-1">
                <ItemTitle>Notification Templates</ItemTitle>
                <ItemDescription>
                  Manage reusable communication templates for campaigns and automations
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button onClick={() => handleOpen()} disabled={isPending}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PlusCircle className="h-8 w-8" aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No templates configured</EmptyTitle>
                <EmptyDescription>
                  Create your first template to standardize notifications.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={handleOpen}
                  onDelete={handleDelete}
                  disabled={isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TemplateFormDialog
        open={open}
        onOpenChange={setOpen}
        formData={draft}
        onFormChange={setDraft}
        onSave={handleSave}
        isPending={isPending}
        isEditMode={!!editingTemplate}
        eventOptions={eventOptions}
        channelOptions={channelOptions}
      />
    </>
  )
}
