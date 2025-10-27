import { ItemGroup } from '@/components/ui/item'

import { servicesDirectoryHeader } from './directory-header.data'

export function DirectoryHeader() {
  return (
    <ItemGroup className="gap-4">
      <h1 className="scroll-m-20">{servicesDirectoryHeader.title}</h1>
      <p className="leading-7 text-muted-foreground">
        {servicesDirectoryHeader.description}
      </p>
    </ItemGroup>
  )
}
