'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RoleTemplate } from '../utils/templates'
import { ROLE_PERMISSION_TEMPLATES } from '../utils/templates'
import type { RoleValue } from './types'

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
      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="template">Template</Label>
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
      </div>
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
