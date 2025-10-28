'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Kbd } from '@/components/ui/kbd'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
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
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <InputGroup>
          <InputGroupInput
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleAdd()
              }
            }}
            placeholder={placeholder}
            autoComplete="off"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="outline"
              onClick={handleAdd}
              aria-label="Add item"
            >
              Add
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription className="text-xs text-muted-foreground">
          Press <Kbd>Enter</Kbd> to add quickly.
        </FieldDescription>
      </FieldContent>
      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <Badge key={`${item}-${index}`} variant="secondary">
            {item}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-1 hover:text-destructive"
              aria-label={`Remove ${item}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </Field>
  )
}
