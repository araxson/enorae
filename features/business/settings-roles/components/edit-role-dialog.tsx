'use client'

import { useState, useTransition, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateUserRole } from '@/features/business/settings-roles/api/mutations'
import { useToast } from '@/lib/hooks/use-toast'
import type { UserRoleWithDetails } from '@/features/business/settings-roles/api/queries'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

interface EditRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: UserRoleWithDetails | null
}

const ROLES = [
  { value: 'salon_owner', label: 'Salon Owner' },
  { value: 'salon_manager', label: 'Salon Manager' },
  { value: 'senior_staff', label: 'Senior Staff' },
  { value: 'staff', label: 'Staff' },
  { value: 'junior_staff', label: 'Junior Staff' },
]

export function EditRoleDialog({ open, onOpenChange, role }: EditRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  useEffect(() => {
    if (role?.['role']) {
      setSelectedRole(role['role'])
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!role?.['id'] || !selectedRole) {
      toast({
        title: 'Error',
        description: 'Invalid role data',
        variant: 'destructive',
      })
      return
    }

    const formData = new FormData()
    formData.append('role', selectedRole)

    startTransition(async () => {
      const result = await updateUserRole(role['id']!, formData)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Role updated successfully',
        })
        onOpenChange(false)
      }
    })
  }

  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update role for {role.user?.['full_name'] || 'user'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel>User</FieldLabel>
                <FieldContent>
                  <FieldDescription>
                    {role.user?.['full_name']} ({role.user?.['email']})
                  </FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <FieldContent>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Role'}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
