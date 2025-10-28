'use client'

import { memo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PenLine, Trash2 } from 'lucide-react'
import type { NotificationTemplate } from '@/features/business/notifications/api/queries'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface TemplateCardProps {
  template: NotificationTemplate
  onEdit: (template: NotificationTemplate) => void
  onDelete: (templateId: string) => void
  disabled?: boolean
}

// PERFORMANCE: Wrap in React.memo to prevent re-renders in list views
function TemplateCardComponent({ template, onEdit, onDelete, disabled }: TemplateCardProps) {
  // PERFORMANCE: Wrap inline handlers to prevent new function creation on every render
  const handleEdit = useCallback(() => {
    onEdit(template)
  }, [onEdit, template])

  const handleDelete = useCallback(() => {
    onDelete(template.id)
  }, [onDelete, template.id])
  return (
    <Card className="border-muted">
      <CardHeader>
        <ItemGroup>
          <Item className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <ItemContent className="flex flex-col gap-1">
              <ItemTitle>{template.name}</ItemTitle>
              <ItemDescription>
                {(template.description || template.event.replace('_', ' ')).toString()}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="flex gap-2">
              <Badge variant="outline">
                <span className="capitalize">{template.channel}</span>
              </Badge>
              <Badge variant="secondary">
                <span className="capitalize">{template.event.replace(/_/g, ' ')}</span>
              </Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        {template.subject ? (
          <p className="text-sm font-semibold">{template.subject}</p>
        ) : null}
        <div className="whitespace-pre-line line-clamp-4">
          <CardDescription>{template.body}</CardDescription>
        </div>
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            disabled={disabled}
          >
            <PenLine className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={disabled}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  )
}

// PERFORMANCE: Export memoized version
export const TemplateCard = memo(TemplateCardComponent)
