'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { StaffWithServices } from '@/features/business/staff/api/queries'
import type { StaffFormState } from './staff-form-types'

type StaffFormFieldsProps = {
  form: StaffFormState
  disabled: boolean
  staff?: StaffWithServices | null
}

export function StaffFormFields({ form, disabled, staff }: StaffFormFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <section className="space-y-4">
        <h3 className="text-sm font-medium">Basic Information</h3>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => form.setEmail(event.target.value)}
            required
            disabled={!!staff || disabled}
            placeholder="staff@example.com"
          />
          {staff && (
            <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed after creation</p>
          )}
        </div>

        <div>
          <Label htmlFor="full-name">Full Name *</Label>
          <Input
            id="full-name"
            value={form.fullName}
            onChange={(event) => form.setFullName(event.target.value)}
            required
            disabled={disabled}
            placeholder="John Doe"
          />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(event) => form.setTitle(event.target.value)}
              disabled={disabled}
              placeholder="Senior Stylist"
            />
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={(event) => form.setExperienceYears(event.target.value)}
              disabled={disabled}
              placeholder="5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(event) => form.setBio(event.target.value)}
            disabled={disabled}
            placeholder="Brief professional bio..."
            rows={3}
          />
        </div>

        {!staff && (
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(event) => form.setPhone(event.target.value)}
              disabled={disabled}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        )}
      </section>
    </div>
  )
}
