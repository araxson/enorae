'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { assignRoleAction } from '@/features/admin/roles/api/actions'
import type { RoleValue } from '../api/types'
import { ButtonGroup } from '@/components/ui/button-group'
import { AssignRoleFormHeader } from './assign-role-form-header'
import { AssignRolePermissionsSection } from './assign-role-permissions-section'
import { UserIdField, RoleSalonFields } from './sections'

type AssignRoleFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  salons: Array<{ id: string; name: string }>
}

const ROLES_NEEDING_SALON: RoleValue[] = [
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
]

function SubmitButton() {
  return (
    <Button type="submit" aria-busy="false">
      <span>Assign Role</span>
    </Button>
  )
}

export function AssignRoleForm({ open, onOpenChange, salons }: AssignRoleFormProps) {
  const [state, formAction] = useActionState(assignRoleAction, {
    success: false,
    message: '',
    errors: {},
  })

  const [selectedRole, setSelectedRole] = useState<RoleValue | ''>('')
  const [permissions, setPermissions] = useState<string[]>([])

  const formRef = useRef<HTMLFormElement>(null)
  const firstErrorRef = useRef<HTMLInputElement | null>(null)

  const needsSalon = selectedRole ? ROLES_NEEDING_SALON.includes(selectedRole) : false

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && Object.keys(state.errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  // Reset form when dialog closes or on success
  useEffect(() => {
    if (!open || state?.success) {
      formRef.current?.reset()
      setSelectedRole('')
      setPermissions([])
    }
  }, [open, state?.success])

  // Close dialog on success
  useEffect(() => {
    if (state?.success) {
      onOpenChange(false)
    }
  }, [state?.success, onOpenChange])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  const handleAddPermission = (permission: string) => {
    if (permissions.includes(permission)) {
      return
    }
    setPermissions([...permissions, permission])
  }

  const handleRemovePermission = (permission: string) => {
    setPermissions(permissions.filter((item) => item !== permission))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <AssignRoleFormHeader />

        <div>
          {/* Screen reader announcement for form status */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {state?.message && !hasErrors && state.message}
          </div>

          {/* Error summary for accessibility */}
          {hasErrors && (
            <div
              role="alert"
              className="bg-destructive/10 border border-destructive p-4 rounded-md mb-6"
              tabIndex={-1}
            >
              <h2 className="font-semibold text-destructive mb-2">
                Please fix {Object.keys(state.errors).length} error(s):
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(state.errors).map(([field, messages]) => (
                  <li key={field}>
                    <a
                      href={`#${field}`}
                      className="text-destructive underline hover:no-underline"
                    >
                      {field}: {(messages as string[])[0]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form
            ref={formRef}
            action={formAction}
            className="space-y-6"
            aria-describedby={hasErrors ? 'form-errors' : undefined}
          >
            {/* Hidden input for permissions array */}
            <input type="hidden" name="permissions" value={JSON.stringify(permissions)} />

            <UserIdField errors={state?.errors} firstErrorRef={firstErrorRef} />

            <RoleSalonFields
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              needsSalon={needsSalon}
              salons={salons}
              errors={state?.errors}
            />

            <AssignRolePermissionsSection
              permissions={permissions}
              onAdd={handleAddPermission}
              onRemove={handleRemovePermission}
            />

            {state?.message && !state.success && !hasErrors && (
              <p className="text-sm text-destructive" role="alert">
                {state.message}
              </p>
            )}

            {state?.success && (
              <div
                role="status"
                aria-live="polite"
                className="bg-green-50 border border-green-200 p-3 rounded-md"
              >
                <p className="text-green-800 text-sm">Role assigned successfully!</p>
              </div>
            )}

            <ButtonGroup aria-label="Actions">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <SubmitButton />
            </ButtonGroup>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
