'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RoleSelector } from './role-selector'
import { SalonSelector } from './salon-selector'
import type { RoleTemplate } from './role-templates'
import type { RoleValue } from '../api/types'
import {
  Field,
  FieldContent,
  FieldLabel,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

const ROLES_NEEDING_SALON: RoleValue[] = [
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
]

export interface RowState {
  userId: string
  role: RoleValue | ''
  salonId: string
  templateId: string
  permissions: string[]
}

type BulkAssignRowProps = {
  index: number
  row: RowState
  salons: Array<{ id: string; name: string }>
  canRemove: boolean
  onChange: (index: number, patch: Partial<RowState>) => void
  onRemove: (index: number) => void
  onTemplateSelect: (index: number, template: RoleTemplate | undefined) => void
}

export function BulkAssignRow({
  index,
  row,
  salons,
  canRemove,
  onChange,
  onRemove,
  onTemplateSelect,
}: BulkAssignRowProps) {
  return (
    <Card>
      <CardHeader>
        <div className="pb-2">
          <ItemGroup>
            <Item className="flex-col items-start gap-1">
              <ItemContent>
                <ItemTitle>Assignment {index + 1}</ItemTitle>
              </ItemContent>
              <ItemContent>
                <ItemDescription>Configure user, role, and optional salon.</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-0">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Field className="flex-1">
              <FieldLabel htmlFor={`user-${index}`}>User ID *</FieldLabel>
              <FieldContent>
                <Input
                  id={`user-${index}`}
                  value={row.userId}
                  onChange={(event) => onChange(index, { userId: event.target.value })}
                  placeholder="User UUID"
                />
              </FieldContent>
            </Field>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              disabled={!canRemove}
            >
              Remove
            </Button>
          </div>

          <RoleSelector
            role={row.role}
            onRoleChange={(value) => onChange(index, { role: value })}
            templateId={row.templateId}
            onTemplateChange={(template) => onTemplateSelect(index, template)}
          />

          {row.role && ROLES_NEEDING_SALON.includes(row.role) && (
            <SalonSelector
              salons={salons}
              value={row.salonId}
              onChange={(value) => onChange(index, { salonId: value })}
              required
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
