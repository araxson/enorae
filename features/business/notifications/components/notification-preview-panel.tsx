'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { sendTestNotification } from '@/features/business/notifications/api/mutations'
import type { NotificationTemplate } from '@/features/business/notifications/api/queries'
import { useToast } from '@/lib/hooks/use-toast'

type NotificationPreviewPanelProps = {
  templates: NotificationTemplate[]
}

export function NotificationPreviewPanel({ templates }: NotificationPreviewPanelProps) {
  const { toast } = useToast()
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? '')
  const [isPending, startTransition] = useTransition()

  const template = templates.find((item) => item.id === selectedId)

  const formatEventLabel = (value: string) =>
    value
      .split('_')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ')

  const formatChannelLabel = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1)

  const handleSend = () => {
    if (!selectedId) {
      toast({
        title: 'Select a template',
        description: 'Choose a template to preview before sending a test notification.',
      })
      return
    }

    startTransition(async () => {
      try {
        await sendTestNotification(selectedId)
        toast({
          title: 'Test notification sent',
          description: 'Check your inbox or device to verify delivery.',
        })
      } catch (error) {
        toast({
          title: 'Unable to send test notification',
          description: error instanceof Error ? error.message : 'Please try again.',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test & Preview</CardTitle>
        <CardDescription>
          Send yourself a notification preview to confirm template quality and delivery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template to test" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((tmpl) => (
                <SelectItem key={tmpl.id} value={tmpl.id}>
                  {tmpl.name} · {tmpl.channel.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {template ? (
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Badge variant="outline">
                {formatEventLabel(template.event)}
              </Badge>
              <Badge variant="secondary">
                {formatChannelLabel(template.channel)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {template.subject ? (
                <p className="text-sm font-semibold">{template.subject}</p>
              ) : null}
              <ScrollArea className="max-h-48 text-sm">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {template.body}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : null}

        <Button onClick={handleSend} disabled={isPending || !selectedId}>
          {isPending ? 'Sending...' : 'Send Test Notification'}
        </Button>
      </CardContent>
    </Card>
  )
}
