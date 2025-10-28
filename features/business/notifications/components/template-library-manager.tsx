'use client'

import { useMemo, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import type { NotificationTemplate } from '@/features/business/notifications/api/queries'
import { deleteNotificationTemplate, upsertNotificationTemplate } from '@/features/business/notifications/api/mutations'
import { TemplateCard } from './template-card'
import { TemplateDialog } from './template-dialog'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type NotificationTemplatesManagerProps = {
  templates: NotificationTemplate[]
}

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
        const templateData = {
          name: draft.name,
          description: draft.description || undefined,
          event: draft.event,
          channel: draft.channel,
          subject: draft.subject || undefined,
          body: draft.body,
          ...(editingTemplate?.id && { id: editingTemplate.id }),
        }

        await upsertNotificationTemplate(templateData)

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
          <CardTitle>Notification Templates</CardTitle>
          <CardDescription>
            Manage reusable communication templates for campaigns and automations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button variant="default" onClick={() => handleOpen()} disabled={isPending}>
              <PlusCircle className="mr-2 size-4" />
              New Template
            </Button>
          </div>
          {templates.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PlusCircle className="size-8" aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No templates configured</EmptyTitle>
                <EmptyDescription>
                  Create your first template to standardize notifications.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
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

      <TemplateDialog
        open={open}
        onOpenChange={setOpen}
        editingTemplate={editingTemplate}
        draft={draft}
        onDraftChange={setDraft}
        onSave={handleSave}
        isPending={isPending}
      />
    </>
  )
}
