'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { RoleSelector } from './role-selector'
import { SalonSelector } from './salon-selector'
import type { RoleValue } from '../api/types'
import type { RoleTemplate } from './role-templates'

type AssignRoleFormFieldsProps = {
  userId: string
  role: RoleValue | ''
  salonId: string
  templateId: string
  needsSalon: boolean
  salons: Array<{ id: string; name: string }>
  errors: { userId?: string; role?: string; salonId?: string }
  onUserIdChange: (value: string) => void
  onRoleChange: (value: RoleValue | '') => void
  onSalonChange: (value: string) => void
  onTemplateChange: (template: RoleTemplate | undefined) => void
  userIdRef: React.RefObject<HTMLInputElement>
}

export function AssignRoleFormFields({
  userId,
  role,
  salonId,
  templateId,
  needsSalon,
  salons,
  errors,
  onUserIdChange,
  onRoleChange,
  onSalonChange,
  onTemplateChange,
  userIdRef,
}: AssignRoleFormFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <Field data-invalid={Boolean(errors.userId)}>
        <FieldLabel htmlFor="userId">User ID *</FieldLabel>
        <FieldContent>
          <Input
            ref={userIdRef}
            id="userId"
            placeholder="Enter user UUID"
            value={userId}
            onChange={(event) => onUserIdChange(event.target.value)}
            required
            aria-invalid={Boolean(errors.userId)}
          />
          <FieldDescription>The UUID of the user to assign the role to.</FieldDescription>
        </FieldContent>
        {errors.userId ? <FieldError>{errors.userId}</FieldError> : null}
      </Field>

      <RoleSelector
        role={role}
        onRoleChange={onRoleChange}
        templateId={templateId}
        onTemplateChange={onTemplateChange}
      />
      {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}

      {needsSalon && (
        <>
          <SalonSelector
            salons={salons}
            value={salonId}
            onChange={onSalonChange}
            required
          />
          {errors.salonId && <p className="text-xs text-destructive">{errors.salonId}</p>}
        </>
      )}
    </div>
  )
}
