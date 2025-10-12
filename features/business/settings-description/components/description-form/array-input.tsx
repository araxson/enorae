'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'

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
    <Stack gap="sm">
      <Label>{label}</Label>
      <Flex gap="sm">
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
      </Flex>
      <Flex gap="sm" className="flex-wrap">
        {items.map((item, index) => (
          <Badge key={`${item}-${index}`} variant="secondary">
            {item}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </Flex>
    </Stack>
  )
}
