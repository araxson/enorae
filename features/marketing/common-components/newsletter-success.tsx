'use client'

import { CheckCircle } from 'lucide-react'
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'

export function NewsletterSuccess() {
  return (
    <Item variant="muted">
      <ItemMedia variant="icon">
        <CheckCircle className="h-5 w-5 text-primary" aria-hidden="true" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-primary">Thanks for subscribing!</ItemTitle>
      </ItemContent>
    </Item>
  )
}
