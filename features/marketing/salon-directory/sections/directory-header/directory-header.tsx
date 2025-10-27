import { ItemGroup } from '@/components/ui/item'

import { directoryHeader } from './directory-header.data'

export function DirectoryHeader() {
  return (
    <div>
      <ItemGroup className="gap-4">
        <h1 className="scroll-m-20">{directoryHeader.title}</h1>
        <p className="leading-7 text-muted-foreground">
          {directoryHeader.description}
        </p>
      </ItemGroup>
    </div>
  )
}
