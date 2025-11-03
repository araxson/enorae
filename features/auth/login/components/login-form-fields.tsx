'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { PasswordInput } from '@/features/auth/common/components/password-input'
import type { UseFormReturn } from 'react-hook-form'
import type { LoginSchema } from '../api/schema'

type Props = {
  form: UseFormReturn<LoginSchema>
}

export function LoginFormFields({ form }: Props) {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                </InputGroupAddon>
                <FormControl>
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoCorrect="off"
                    spellCheck={false}
                    {...field}
                  />
                </FormControl>
              </InputGroup>
              <FormMessage />
            </Field>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </Field>
          </FormItem>
        )}
      />

      <div className="text-center">
        <FieldDescription>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium underline-offset-4 hover:underline">
            Sign up
          </Link>
        </FieldDescription>
      </div>
    </>
  )
}
