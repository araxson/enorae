'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateStaffSchema, UpdateStaffSchema } from '@/features/business/staff/api/schema'

type StaffFormFieldsProps = {
  form: UseFormReturn<CreateStaffSchema | UpdateStaffSchema>
  showEmailField: boolean
}

export function StaffFormFields({ form, showEmailField }: StaffFormFieldsProps) {
  return (
    <>
      {showEmailField && (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="email">Email Address *</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="staff@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FieldContent>
              </Field>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <Field>
              <FieldLabel htmlFor="full_name">Full Name *</FieldLabel>
              <FieldContent>
                <FormControl>
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FieldContent>
            </Field>
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="title">Job Title</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Senior Stylist"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FieldContent>
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience_years"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="experience_years">Years of Experience</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      id="experience_years"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FieldContent>
              </Field>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <FieldContent>
                <FormControl>
                  <Textarea
                    id="bio"
                    placeholder="Brief professional bio..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FieldContent>
            </Field>
          </FormItem>
        )}
      />

      {showEmailField && (
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FieldContent>
              </Field>
            </FormItem>
          )}
        />
      )}
    </>
  )
}
