'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@enorae/ui'
import { Button } from '@enorae/ui'
import { Input } from '@enorae/ui'
import { Label } from '@enorae/ui'
import { Textarea } from '@enorae/ui'
import { createStaffMember, updateStaffMember } from '../actions/staff.actions'
import type { Staff } from '../types/staff.types'

interface StaffFormProps {
  salonId: string
  staff?: Staff
  mode: 'create' | 'edit'
}

export function StaffForm({ salonId, staff, mode }: StaffFormProps) {
  const action = mode === 'create' ? createStaffMember : updateStaffMember

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add' : 'Edit'} Staff Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="salonId" value={salonId} />
          {mode === 'edit' && staff && (
            <input type="hidden" name="staffId" value={staff.id!} />
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Name / Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={staff?.title || ''}
              required
              placeholder="e.g., John Doe - Senior Stylist"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceYears">Years of Experience</Label>
            <Input
              id="experienceYears"
              name="experienceYears"
              type="number"
              min="0"
              defaultValue={staff?.experience_years || ''}
              placeholder="e.g., 5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={staff?.bio || ''}
              placeholder="Tell customers about this staff member..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {mode === 'create' ? 'Add Staff Member' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <a href="/business/staff">Cancel</a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}