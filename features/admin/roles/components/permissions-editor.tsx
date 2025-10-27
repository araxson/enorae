'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface PermissionsEditorProps {
  permissions: string[]
  onAdd: (permission: string) => void
  onRemove: (permission: string) => void
}

export function PermissionsEditor({ permissions, onAdd, onRemove }: PermissionsEditorProps) {
  const [value, setValue] = useState('')

  const handleAdd = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <div className="space-y-2">
      <InputGroup className="w-full sm:w-64">
        <InputGroupInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Add permission key"
          aria-label="Permission key"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={handleAdd}
            size="sm"
            variant="outline"
            disabled={!value.trim()}
          >
            <Plus className="h-4 w-4" />
            Add
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {permissions.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No custom permissions applied</EmptyTitle>
            <EmptyDescription>Use the input above to grant additional role capabilities.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-wrap gap-2">
          {permissions.map((permission) => (
            <div key={permission} className="flex items-center gap-1">
              <Badge variant="secondary">{permission}</Badge>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
                onClick={() => onRemove(permission)}
                aria-label={`Remove permission ${permission}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
