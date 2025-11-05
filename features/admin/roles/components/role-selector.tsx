'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RoleTemplate } from './role-templates'
import { ROLE_PERMISSION_TEMPLATES } from './role-templates'
import type { RoleValue } from '../api/types'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'

interface RoleSelectorProps {
  role: RoleValue | ''
  onRoleChange: (value: RoleValue) => void
  templateId: string
  onTemplateChange: (template: RoleTemplate | undefined) => void
}

export function RoleSelector({ role, onRoleChange, templateId, onTemplateChange }: RoleSelectorProps) {
  const handleTemplateChange = (value: string) => {
    const template = ROLE_PERMISSION_TEMPLATES.find((item) => item.id === value)
    onTemplateChange(template)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="role">Role *</FieldLabel>
        <FieldContent>
          <Select value={role} onValueChange={(value: RoleValue) => onRoleChange(value)} required>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((value) => (
                <SelectItem key={value} value={value}>
                  {value.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="template">Template</FieldLabel>
        <FieldContent>
          <Select value={templateId} onValueChange={handleTemplateChange}>
            <SelectTrigger id="template">
              <SelectValue placeholder="Optional template" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_PERMISSION_TEMPLATES.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
    </div>
  )
}

export const ROLE_OPTIONS: RoleValue[] = [
  'super_admin',
  'platform_admin',
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
  'customer',
  'vip_customer',
  'guest',
]
