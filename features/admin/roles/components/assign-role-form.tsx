'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { assignRole } from '@/features/admin/roles/api/mutations'
import type { RoleTemplate } from '@/features/admin/roles/components/role-templates'
import type { RoleValue } from './types'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { AssignRoleFormHeader } from './assign-role-form-header'
import { AssignRoleFormFields } from './assign-role-form-fields'
import { AssignRolePermissionsSection } from './assign-role-permissions-section'
import { hasKeys } from '@/lib/utils/typed-object'

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

export function AssignRoleForm({ open, onOpenChange, salons }: AssignRoleFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState<RoleValue | ''>('')
  const [salonId, setSalonId] = useState('')
  const [permissions, setPermissions] = useState<string[]>([])
  const [templateId, setTemplateId] = useState('')
  const [errors, setErrors] = useState<{ userId?: string; role?: string; salonId?: string }>({})
  const userIdRef = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (!open) {
      setUserId('')
      setRole('')
      setSalonId('')
      setPermissions([])
      setTemplateId('')
      setErrors({})
    }
  }, [open])

  const needsSalon = role ? ROLES_NEEDING_SALON.includes(role) : false

  const handleTemplateChange = (template: RoleTemplate | undefined) => {
    setTemplateId(template?.id ?? '')
    if (template) {
      setRole(template.role as RoleValue)
      setPermissions(template.permissions)
    }
  }

  const handleRoleChange = (value: RoleValue | '') => {
    setRole(value)
    setTemplateId('')
    setErrors((current) => ({ ...current, role: undefined }))
  }

  const handleSalonChange = (value: string) => {
    setSalonId(value)
    setErrors((current) => ({ ...current, salonId: undefined }))
  }

  const handleAddPermission = (permission: string) => {
    if (permissions.includes(permission)) {
      toast.warning('Permission already added')
      return
    }
    setPermissions((current) => [...current, permission])
  }

  const handleRemovePermission = (permission: string) => {
    setPermissions((current) => current.filter((item) => item !== permission))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const nextErrors: typeof errors = {}

    if (!userId || !role) {
      if (!userId) nextErrors.userId = 'User ID is required'
      if (!role) nextErrors.role = 'Role selection is required'
    }

    if (needsSalon && !salonId) {
      nextErrors.salonId = 'Please select a salon for this role'
    }

    setErrors(nextErrors)

    if (hasKeys(nextErrors)) {
      toast.error('Please resolve the highlighted fields before submitting.')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('role', role)
    if (salonId) formData.append('salonId', salonId)
    if (permissions.length > 0) formData.append('permissions', JSON.stringify(permissions))

    const result = await assignRole(formData)
    setIsLoading(false)

    if (!result.success) {
      toast.error(result.error)
    } else {
      toast.success('The role has been assigned successfully.')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-xl"
        onOpenAutoFocus={(event) => {
          if (userIdRef.current) {
            userIdRef.current.focus()
            event.preventDefault()
          }
        }}
      >
        <AssignRoleFormHeader />

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            <AssignRoleFormFields
              userId={userId}
              role={role}
              salonId={salonId}
              templateId={templateId}
              needsSalon={needsSalon}
              salons={salons}
              errors={errors}
              onUserIdChange={setUserId}
              onRoleChange={handleRoleChange}
              onSalonChange={handleSalonChange}
              onTemplateChange={handleTemplateChange}
              userIdRef={userIdRef}
            />

            <AssignRolePermissionsSection
              permissions={permissions}
              onAdd={handleAddPermission}
              onRemove={handleRemovePermission}
            />

            <ButtonGroup aria-label="Actions">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Assigning…</span>
                  </>
                ) : (
                  <span>Assign Role</span>
                )}
              </Button>
            </ButtonGroup>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
