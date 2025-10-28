'use client'

import { CheckCircle } from 'lucide-react'
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'

export function NewsletterSuccess() {
  return (
    <Item variant="muted">
      <ItemMedia variant="icon">
        <CheckCircle className="size-5 text-primary" aria-hidden="true" />
      </ItemMedia>
      <ItemContent>
        <span className="text-primary">
          <ItemTitle>Thanks for subscribing!</ItemTitle>
        </span>
      </ItemContent>
    </Item>
  )
}
