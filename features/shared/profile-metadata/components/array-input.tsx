'use client'

import { useId, useState } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Field,
  FieldContent,
  FieldLabel,
} from '@/components/ui/field'
type ArrayInputProps = {
  label: string
  items: string[]
  onAdd: (value: string) => void
  onRemove: (index: number) => void
  placeholder: string
}

export function ArrayInput({ label, items, onAdd, onRemove, placeholder }: ArrayInputProps) {
  const [value, setValue] = useState('')
  const inputId = useId()

  const handleAdd = () => {
    const trimmed = value.trim()
    if (!trimmed) return

    onAdd(trimmed)
    setValue('')
  }

  return (
    <Field>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <FieldContent className="gap-3">
        <div className="flex gap-3">
          <Input
            id={inputId}
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
        <div className="flex flex-wrap gap-3">
          {items.map((item, index) => (
            <Badge key={`${item}-${index}`} variant="secondary">
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      </FieldContent>
    </Field>
  )
}
