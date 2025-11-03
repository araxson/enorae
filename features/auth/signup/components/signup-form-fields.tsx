'use client'

import { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { SignupInput } from '../api/schema'
import { PasswordInput } from '@/features/auth/common/components/password-input'
import { PasswordStrengthIndicator } from '@/features/auth/common/components/password-strength-indicator'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { User, Mail } from 'lucide-react'

interface SignupFormFieldsProps {
  form: UseFormReturn<SignupInput>
}

export const SignupFormFields = memo(function SignupFormFields({ form }: SignupFormFieldsProps) {
  const password = form.watch('password')

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <User className="size-4 text-muted-foreground" aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  autoCapitalize="words"
                />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput
                {...field}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
            </FormControl>
            {password ? (
              <FormDescription>
                <PasswordStrengthIndicator password={password} showRequirements />
              </FormDescription>
            ) : null}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
})
