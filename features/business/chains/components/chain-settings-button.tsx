'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BulkSettingsDialog } from './bulk-settings-dialog'

type ChainSettingsButtonProps = {
  chainId: string
  chainName: string
  locationCount: number
}

export function ChainSettingsButton({
  chainId,
  chainName,
  locationCount,
}: ChainSettingsButtonProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setSettingsOpen(true)}>
        <Settings className="h-4 w-4 mr-2" />
        Bulk Settings
      </Button>

      <BulkSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        chainId={chainId}
        chainName={chainName}
        locationCount={locationCount}
      />
    </>
  )
}
