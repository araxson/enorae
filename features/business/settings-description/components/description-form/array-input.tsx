'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
type ArrayInputProps = {
  label: string
  items: string[]
  onAdd: (value: string) => void
  onRemove: (index: number) => void
  placeholder: string
}

export function ArrayInput({ label, items, onAdd, onRemove, placeholder }: ArrayInputProps) {
  const [value, setValue] = useState('')

  const handleAdd = () => {
    const trimmed = value.trim()
    if (!trimmed) return

    onAdd(trimmed)
    setValue('')
  }

  return (
    <div className="flex flex-col gap-3">
      <Label>{label}</Label>
      <div className="flex gap-3">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleAdd()
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={handleAdd}>
          Add
        </Button>
      </div>
      <div className="flex gap-3 flex-wrap">
        {items.map((item, index) => (
          <Badge key={`${item}-${index}`} variant="secondary">
            {item}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-1 hover:text-destructive"
              aria-label={`Remove ${item}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
