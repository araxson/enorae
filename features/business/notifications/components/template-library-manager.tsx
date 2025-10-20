'use client'

import { useMemo, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import type { NotificationTemplate } from '../api/queries'
import { deleteNotificationTemplate, upsertNotificationTemplate } from '../api/mutations'
import { TemplateCard } from './template-card'
import { TemplateDialog } from './template-dialog'

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
        await upsertNotificationTemplate({
          id: editingTemplate?.id,
          name: draft.name,
          description: draft.description || undefined,
          event: draft.event,
          channel: draft.channel,
          subject: draft.subject ? draft.subject : undefined,
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notification Templates</CardTitle>
            <CardDescription>
              Manage reusable communication templates for campaigns and automations
            </CardDescription>
          </div>
          <Button variant="default" onClick={() => handleOpen()} disabled={isPending}>
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
