import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'

import { servicesDirectoryHeader } from './directory-header.data'

export function DirectoryHeader() {
  return (
    <div
      className="group/item-group flex flex-col gap-4"
      data-slot="item-group"
      role="list"
    >
      <Item variant="muted">
        <ItemHeader>
          <ItemTitle>{servicesDirectoryHeader.title}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{servicesDirectoryHeader.description}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
