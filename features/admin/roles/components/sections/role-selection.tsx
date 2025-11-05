'use client'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type RoleSelectionProps = {
  error?: string
  roles: Array<{ value: string; label: string }>
}

export function RoleSelection({ error, roles }: RoleSelectionProps) {
  return (
    <Field>
      <FieldLabel htmlFor="role">
        Role
        <span className="text-destructive" aria-label="required"> *</span>
      </FieldLabel>
      <Select name="role" required>
        <SelectTrigger
          id="role"
          aria-invalid={!!error}
          aria-describedby={error ? 'role-error role-hint' : 'role-hint'}
        >
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription id="role-hint">
        Choose the role to assign to the user
      </FieldDescription>
      {error && (
        <p id="role-error" className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </Field>
  )
}
