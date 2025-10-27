'use client'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
    <FieldSet>
      <FieldLegend>Basic Information</FieldLegend>
      <FieldGroup className="gap-6">
        <Field>
          <FieldLabel htmlFor="email">Email Address *</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => form.setEmail(event.target.value)}
              required
              disabled={!!staff || disabled}
              placeholder="staff@example.com"
            />
            {staff ? <FieldDescription>Email cannot be changed after creation</FieldDescription> : null}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="full-name">Full Name *</FieldLabel>
          <FieldContent>
            <Input
              id="full-name"
              value={form.fullName}
              onChange={(event) => form.setFullName(event.target.value)}
              required
              disabled={disabled}
              placeholder="John Doe"
            />
          </FieldContent>
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="title">Job Title</FieldLabel>
            <FieldContent>
              <Input
                id="title"
                value={form.title}
                onChange={(event) => form.setTitle(event.target.value)}
                disabled={disabled}
                placeholder="Senior Stylist"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="experience">Years of Experience</FieldLabel>
            <FieldContent>
              <Input
                id="experience"
                type="number"
                min="0"
                value={form.experienceYears}
                onChange={(event) => form.setExperienceYears(event.target.value)}
                disabled={disabled}
                placeholder="5"
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <FieldContent>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(event) => form.setBio(event.target.value)}
              disabled={disabled}
              placeholder="Brief professional bio..."
              rows={3}
            />
          </FieldContent>
        </Field>

        {!staff ? (
          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <FieldContent>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(event) => form.setPhone(event.target.value)}
                disabled={disabled}
                placeholder="+1 (555) 000-0000"
              />
            </FieldContent>
          </Field>
        ) : null}
      </FieldGroup>
    </FieldSet>
  )
}
