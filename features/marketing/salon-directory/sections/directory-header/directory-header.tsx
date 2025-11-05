import { MarketingPanel } from '@/features/marketing/components/common'

import { directoryHeader } from './directory-header.data'

export function DirectoryHeader() {
  return (
    <MarketingPanel
      variant="muted"
      title={directoryHeader.title}
      description={directoryHeader.description}
      align="start"
    />
  )
}
