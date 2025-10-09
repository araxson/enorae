'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Add permission key"
          className="h-9 w-full sm:w-[220px]"
        />
        <Button type="button" size="sm" variant="outline" onClick={handleAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      {permissions.length === 0 ? (
        <p className="text-xs text-muted-foreground">No custom permissions applied.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {permissions.map((permission) => (
            <Badge key={permission} variant="secondary" className="flex items-center gap-1">
              {permission}
              <button type="button" onClick={() => onRemove(permission)} className="ml-1 text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
