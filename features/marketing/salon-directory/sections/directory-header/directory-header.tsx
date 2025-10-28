import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'

import { directoryHeader } from './directory-header.data'

export function DirectoryHeader() {
  return (
    <div
      className="group/item-group flex flex-col gap-4"
      data-slot="item-group"
      role="list"
    >
      <Item variant="muted">
        <ItemHeader>
          <ItemTitle>{directoryHeader.title}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{directoryHeader.description}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
