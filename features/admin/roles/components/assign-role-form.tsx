'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { z } from 'zod'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { assignRole } from '@/features/admin/roles/api/mutations'
import type { RoleValue } from '../api/types'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { AssignRoleFormHeader } from './assign-role-form-header'
import { AssignRolePermissionsSection } from './assign-role-permissions-section'

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

// Schema for assign role form
const assignRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required').regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid user ID format'),
  role: z.enum(['platform_admin', 'tenant_owner', 'salon_owner', 'salon_manager', 'senior_staff', 'staff', 'junior_staff', 'customer'] as const),
  salonId: z.string().optional(),
  permissions: z.array(z.string()),
})

type AssignRoleFormData = z.infer<typeof assignRoleSchema>

export function AssignRoleForm({ open, onOpenChange, salons }: AssignRoleFormProps) {
  const form = useForm<AssignRoleFormData>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      userId: '',
      role: undefined,
      salonId: '',
      permissions: [],
    },
  })

  const role = form.watch('role')
  const needsSalon = role ? ROLES_NEEDING_SALON.includes(role) : false

  // Add custom validation for salon requirement
  useEffect(() => {
    if (needsSalon) {
      assignRoleSchema.refine(
        (data) => !needsSalon || !!data.salonId,
        { message: 'Please select a salon for this role', path: ['salonId'] }
      )
    }
  }, [needsSalon])

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const handleSubmit = async (data: AssignRoleFormData) => {
    // Additional validation for salon requirement
    if (needsSalon && !data.salonId) {
      form.setError('salonId', { message: 'Please select a salon for this role' })
      toast.error('Please select a salon for this role')
      return
    }

    const formData = new FormData()
    formData.append('userId', data.userId)
    formData.append('role', data.role)
    if (data.salonId) formData.append('salonId', data.salonId)
    if (data.permissions.length > 0) formData.append('permissions', JSON.stringify(data.permissions))

    const result = await assignRole(formData)

    if (!result.success) {
      toast.error(result.error)
    } else {
      toast.success('The role has been assigned successfully.')
      onOpenChange(false)
    }
  }

  const handleAddPermission = (permission: string) => {
    const currentPermissions = form.getValues('permissions')
    if (currentPermissions.includes(permission)) {
      toast.warning('Permission already added')
      return
    }
    form.setValue('permissions', [...currentPermissions, permission])
  }

  const handleRemovePermission = (permission: string) => {
    const currentPermissions = form.getValues('permissions')
    form.setValue('permissions', currentPermissions.filter((item) => item !== permission))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <AssignRoleFormHeader />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user UUID" {...field} />
                  </FormControl>
                  <FormDescription>The unique ID of the user to assign the role to</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="platform_admin">Platform Admin</SelectItem>
                      <SelectItem value="tenant_owner">Tenant Owner</SelectItem>
                      <SelectItem value="salon_owner">Salon Owner</SelectItem>
                      <SelectItem value="salon_manager">Salon Manager</SelectItem>
                      <SelectItem value="senior_staff">Senior Staff</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="junior_staff">Junior Staff</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {needsSalon && (
              <FormField
                control={form.control}
                name="salonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salon</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a salon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {salons.map((salon) => (
                          <SelectItem key={salon.id} value={salon.id}>
                            {salon.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Required for this role type</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <AssignRolePermissionsSection
              permissions={form.watch('permissions')}
              onAdd={handleAddPermission}
              onRemove={handleRemovePermission}
            />

            <ButtonGroup aria-label="Actions">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Assigning…</span>
                  </>
                ) : (
                  <span>Assign Role</span>
                )}
              </Button>
            </ButtonGroup>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
