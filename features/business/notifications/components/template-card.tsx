'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PenLine, Trash2 } from 'lucide-react'
import type { NotificationTemplate } from '@/features/business/notifications/api/queries'

interface TemplateCardProps {
  template: NotificationTemplate
  onEdit: (template: NotificationTemplate) => void
  onDelete: (templateId: string) => void
  disabled?: boolean
}

export function TemplateCard({ template, onEdit, onDelete, disabled }: TemplateCardProps) {
  return (
    <Card className="border-muted">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>
              {(template.description || template.event.replace('_', ' ')).toString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">
              <span className="capitalize">{template.channel}</span>
            </Badge>
            <Badge variant="secondary">
              <span className="capitalize">{template.event.replace(/_/g, ' ')}</span>
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
            onClick={() => onEdit(template)}
            disabled={disabled}
          >
            <PenLine className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(template.id)}
            disabled={disabled}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
