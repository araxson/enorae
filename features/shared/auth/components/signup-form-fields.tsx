'use client'

import { PasswordInput } from './password-input'
import { PasswordStrengthIndicator } from './password-strength-indicator'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldGroup,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface SignupFormFieldsProps {
  password: string
  onPasswordChange: (value: string) => void
  confirmPassword: string
  onConfirmPasswordChange: (value: string) => void
}

export function SignupFormFields({
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
}: SignupFormFieldsProps) {
  return (
    <FieldGroup className="gap-6">
      <Field>
        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
        <FieldContent>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            required
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldContent>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <FieldContent>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Create a strong password"
            required
          />
          {password ? (
            <FieldDescription>
              <PasswordStrengthIndicator password={password} showRequirements />
            </FieldDescription>
          ) : null}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
        <FieldContent>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Confirm your password"
            required
          />
          {confirmPassword && password !== confirmPassword ? (
            <FieldDescription className="text-destructive font-medium">
              Passwords do not match
            </FieldDescription>
          ) : null}
          {confirmPassword && password === confirmPassword ? (
            <FieldDescription className="text-primary font-medium">
              ✓ Passwords match
            </FieldDescription>
          ) : null}
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
