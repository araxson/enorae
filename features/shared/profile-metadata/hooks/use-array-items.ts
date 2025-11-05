'use client'

import { useState } from 'react'

export function useArrayItems(initialItems: string[] = []) {
  const [items, setItems] = useState<string[]>(initialItems)

  const addItem = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || items.includes(trimmed)) return

    setItems([...items, trimmed])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return {
    items,
    addItem,
    removeItem,
  }
}
