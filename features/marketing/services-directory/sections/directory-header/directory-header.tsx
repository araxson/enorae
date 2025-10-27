import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
} from '@/components/ui/item'

import { servicesDirectoryHeader } from './directory-header.data'

export function DirectoryHeader() {
  return (
    <ItemGroup className="gap-4">
      <Item className="flex-col" variant="muted">
        <ItemHeader>
          <h1 className="scroll-m-20">{servicesDirectoryHeader.title}</h1>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{servicesDirectoryHeader.description}</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
