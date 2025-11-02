'use client'

import { Control } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import type { ProfileUpdateSchema } from '@/features/shared/profile/api/schema'

interface ProfileNameFieldProps {
  control: Control<ProfileUpdateSchema>
}

export function ProfileNameField({ control }: ProfileNameFieldProps) {
  return (
    <FormField
      control={control}
      name="full_name"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FieldLabel htmlFor="full_name">Full name</FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  id="full_name"
                  placeholder="Enter your full name"
                  {...field}
                />
              </FormControl>
              <FieldDescription>Displayed across your profile.</FieldDescription>
              <FormMessage />
            </FieldContent>
          </Field>
        </FormItem>
      )}
    />
  )
}
