'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, ShieldOff, Trash2, UserCheck, UserX } from 'lucide-react'

type Props = {
  isActive: boolean
  onOpenSuspend: () => void
  onOpenReactivate: () => void
  onOpenTerminate: () => void
  onOpenDelete: () => void
  hasDelete: boolean
}

export function UserActionsDropdown({
  isActive,
  onOpenSuspend,
  onOpenReactivate,
  onOpenTerminate,
  onOpenDelete,
  hasDelete,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Open user actions menu">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isActive ? (
          <DropdownMenuItem onClick={onOpenSuspend}>
            <UserX className="size-4 mr-2" />
            Suspend User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onOpenReactivate}>
            <UserCheck className="size-4 mr-2" />
            Reactivate User
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={onOpenTerminate}>
          <ShieldOff className="size-4 mr-2" />
          Terminate Sessions
        </DropdownMenuItem>

        {hasDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onOpenDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4 mr-2" />
              Delete Permanently
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
