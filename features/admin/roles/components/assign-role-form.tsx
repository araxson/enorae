'use client'

import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/layout'
import { toast } from 'sonner'
import { assignRole } from '../api/mutations'

type AssignRoleFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  salons: Array<{ id: string; name: string }>
}

const ROLES_NEEDING_SALON = [
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
  const [role, setRole] = useState('')
  const [salonId, setSalonId] = useState('')

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setUserId('')
      setRole('')
      setSalonId('')
    }
  }, [open])

  const needsSalon = ROLES_NEEDING_SALON.includes(role)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!userId || !role) {
      toast.error('User ID and role are required')
      return
    }

    if (needsSalon && !salonId) {
      toast.error('This role requires a salon assignment')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('role', role)
    if (salonId) {
      formData.append('salonId', salonId)
    }

    const result = await assignRole(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('The role has been assigned successfully.')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Assign Role
          </DialogTitle>
          <DialogDescription>
            Assign a role to a user. Business and staff roles require a salon assignment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID *</Label>
              <Input
                id="userId"
                placeholder="Enter user UUID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                The UUID of the user to assign the role to
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="platform_admin">Platform Admin</SelectItem>
                  <SelectItem value="tenant_owner">Tenant Owner</SelectItem>
                  <SelectItem value="salon_owner">Salon Owner</SelectItem>
                  <SelectItem value="salon_manager">Salon Manager</SelectItem>
                  <SelectItem value="senior_staff">Senior Staff</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="junior_staff">Junior Staff</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vip_customer">VIP Customer</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {needsSalon && (
              <div className="space-y-2">
                <Label htmlFor="salonId">Salon *</Label>
                <Select value={salonId} onValueChange={setSalonId} required>
                  <SelectTrigger id="salonId">
                    <SelectValue placeholder="Select a salon" />
                  </SelectTrigger>
                  <SelectContent>
                    {salons.map((salon) => (
                      <SelectItem key={salon.id} value={salon.id}>
                        {salon.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Required for business and staff roles
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Assigning...' : 'Assign Role'}
              </Button>
            </div>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
