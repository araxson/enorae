'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { assignRole } from '@/features/admin/roles/api/mutations'
import { PermissionsEditor } from './permissions-editor'
import { RoleSelector } from './role-selector'
import { SalonSelector } from './salon-selector'
import type { RoleTemplate } from '@/features/admin/roles/components/role-templates'
import type { RoleValue } from './types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia } from '@/components/ui/item'

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
  const userIdRef = useRef<HTMLInputElement>(null)

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

    if (Object.keys(nextErrors).length > 0) {
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
        <DialogHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Shield className="h-5 w-5" />
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

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <Field data-invalid={Boolean(errors.userId)}>
                <FieldLabel htmlFor="userId">User ID *</FieldLabel>
                <FieldContent>
                  <Input
                    ref={userIdRef}
                    id="userId"
                    placeholder="Enter user UUID"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    required
                    aria-invalid={Boolean(errors.userId)}
                  />
                  <FieldDescription>The UUID of the user to assign the role to.</FieldDescription>
                </FieldContent>
                {errors.userId ? <FieldError>{errors.userId}</FieldError> : null}
              </Field>

              <RoleSelector
                role={role}
                onRoleChange={(value) => {
                  setRole(value)
                  setTemplateId('')
                  setErrors((current) => ({ ...current, role: undefined }))
                }}
                templateId={templateId}
                onTemplateChange={handleTemplateChange}
              />
              {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}

              {needsSalon && (
                <>
                  <SalonSelector
                    salons={salons}
                    value={salonId}
                    onChange={(value) => {
                      setSalonId(value)
                      setErrors((current) => ({ ...current, salonId: undefined }))
                    }}
                    required
                  />
                  {errors.salonId && <p className="text-xs text-destructive">{errors.salonId}</p>}
                </>
              )}
            </div>

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
                onAdd={handleAddPermission}
                onRemove={handleRemovePermission}
              />
            </div>

            <ButtonGroup className="justify-end">
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
