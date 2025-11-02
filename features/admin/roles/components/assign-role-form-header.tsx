'use client'

import { Shield } from 'lucide-react'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'

export function AssignRoleFormHeader() {
  return (
    <DialogHeader>
      <ItemGroup>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Shield className="size-5" />
          </ItemMedia>
          <ItemContent>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to a user and optionally configure granular permissions with templates.
            </DialogDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </DialogHeader>
  )
}
