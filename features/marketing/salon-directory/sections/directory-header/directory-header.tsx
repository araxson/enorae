import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
} from '@/components/ui/item'

import { directoryHeader } from './directory-header.data'

export function DirectoryHeader() {
  return (
    <ItemGroup className="gap-4">
      <Item className="flex-col" variant="muted">
        <ItemHeader>
          <h1 className="scroll-m-20">{directoryHeader.title}</h1>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{directoryHeader.description}</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
