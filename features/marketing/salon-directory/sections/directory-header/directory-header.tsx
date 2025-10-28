import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import { directoryHeader } from './directory-header.data'

export function DirectoryHeader() {
  return (
    <ItemGroup className="gap-4">
      <Item className="flex-col" variant="muted">
        <ItemHeader>
          <ItemTitle>{directoryHeader.title}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{directoryHeader.description}</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
