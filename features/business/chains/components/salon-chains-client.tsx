'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { SalonChainWithCounts } from '@/features/business/chains/api/queries'
import { ChainsList } from './chains-list'
import { CreateChainDialog } from './create-chain-dialog'

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
      <ItemGroup className="items-start justify-between gap-4">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Salon Chains</ItemTitle>
            <ItemDescription>Manage your multi-location salon chains</ItemDescription>
          </ItemContent>
        </Item>
        <ItemActions className="flex-none">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Chain
          </Button>
        </ItemActions>
      </ItemGroup>

      <ChainsList chains={initialChains} onEdit={handleEdit} />

      <CreateChainDialog
        open={createDialogOpen || !!editingChain}
        onOpenChange={handleCloseDialog}
        chain={editingChain}
      />
    </div>
  )
}
