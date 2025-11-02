'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, CheckCircle2, XCircle, Power, PowerOff, Trash2 } from 'lucide-react'
import type { ChainActionType } from './types'

interface ActionsDropdownProps {
  chainName: string
  isVerified: boolean
  isActive: boolean
  onActionSelect: (action: ChainActionType) => void
}

/**
 * Dropdown menu for chain actions
 */
export function ActionsDropdown({
  chainName,
  isVerified,
  isActive,
  onActionSelect,
}: ActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`Open actions for ${chainName}`}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!isVerified ? (
          <DropdownMenuItem onClick={() => onActionSelect('verify')}>
            <CheckCircle2 className="mr-2 size-4" />
            Verify Chain
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onActionSelect('unverify')}>
            <XCircle className="mr-2 size-4" />
            Unverify Chain
          </DropdownMenuItem>
        )}

        {isActive ? (
          <DropdownMenuItem onClick={() => onActionSelect('deactivate')}>
            <PowerOff className="mr-2 size-4" />
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onActionSelect('activate')}>
            <Power className="mr-2 size-4" />
            Activate
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onActionSelect('delete')}>
          <Trash2 className="mr-2 size-4" />
          Delete Chain
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
