'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/layout'
import { assignUserRole } from '../api/mutations'
import { useToast } from '@/lib/hooks/use-toast'

interface AssignRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableStaff: Array<{ id: string; full_name: string | null; email: string | null }>
  salonId?: string
}

const ROLES = [
  { value: 'salon_owner', label: 'Salon Owner' },
  { value: 'salon_manager', label: 'Salon Manager' },
  { value: 'senior_staff', label: 'Senior Staff' },
  { value: 'staff', label: 'Staff' },
  { value: 'junior_staff', label: 'Junior Staff' },
]

export function AssignRoleDialog({
  open,
  onOpenChange,
  availableStaff,
  salonId,
}: AssignRoleDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedUserId || !selectedRole) {
      toast({
        title: 'Error',
        description: 'Please select a user and role',
        variant: 'destructive',
      })
      return
    }

    const formData = new FormData()
    formData.append('userId', selectedUserId)
    formData.append('role', selectedRole)
    if (salonId) {
      formData.append('salonId', salonId)
    }

    startTransition(async () => {
      const result = await assignUserRole(formData)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Role assigned successfully',
        })
        setSelectedUserId('')
        setSelectedRole('')
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
          <DialogDescription>
            Assign a role to a staff member for your salon
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <div className="space-y-2">
              <Label htmlFor="user">Staff Member</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {availableStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.full_name || staff.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Assigning...' : 'Assign Role'}
              </Button>
            </DialogFooter>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
