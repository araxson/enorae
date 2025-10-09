'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChainsList } from './chains-list'
import { CreateChainDialog } from './create-chain-dialog'
import type { SalonChainWithCounts } from '../api/queries'

type SalonChainsClientProps = {
  initialChains: SalonChainWithCounts[]
}

export function SalonChainsClient({ initialChains }: SalonChainsClientProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingChain, setEditingChain] = useState<SalonChainWithCounts | null>(null)

  const handleEdit = (chain: SalonChainWithCounts) => {
    setEditingChain(chain)
  }

  const handleCloseDialog = () => {
    setCreateDialogOpen(false)
    setEditingChain(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salon Chains</h1>
          <p className="text-muted-foreground">
            Manage your multi-location salon chains
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Chain
        </Button>
      </div>

      <ChainsList chains={initialChains} onEdit={handleEdit} />

      <CreateChainDialog
        open={createDialogOpen || !!editingChain}
        onOpenChange={handleCloseDialog}
        chain={editingChain}
      />
    </div>
  )
}
