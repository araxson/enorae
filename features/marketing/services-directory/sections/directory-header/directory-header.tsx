import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item'

import { servicesDirectoryHeader } from './directory-header.data'

export function DirectoryHeader() {
  return (
    <ItemGroup className="gap-4">
      <Item variant="muted">
        <ItemHeader>
          <ItemTitle>{servicesDirectoryHeader.title}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{servicesDirectoryHeader.description}</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
