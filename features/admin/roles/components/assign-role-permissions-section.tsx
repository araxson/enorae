'use client'

import { FieldLabel } from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'
import { PermissionsEditor } from './permissions-editor'

type AssignRolePermissionsSectionProps = {
  permissions: string[]
  onAdd: (permission: string) => void
  onRemove: (permission: string) => void
}

export function AssignRolePermissionsSection({
  permissions,
  onAdd,
  onRemove,
}: AssignRolePermissionsSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <ItemGroup>
        <Item>
          <ItemContent>
            <FieldLabel>Permissions</FieldLabel>
            <ItemDescription>
              Templates prefill permissions; add or remove as needed.
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      <PermissionsEditor
        permissions={permissions}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    </div>
  )
}
