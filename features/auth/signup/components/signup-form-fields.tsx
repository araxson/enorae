'use client'

import { PasswordInput } from '@/features/auth/common/components/password-input'
import { PasswordStrengthIndicator } from '@/features/auth/common/components/password-strength-indicator'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { User, Mail } from 'lucide-react'

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
        <InputGroup>
          <InputGroupAddon>
            <User className="size-4 text-muted-foreground" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            autoCapitalize="words"
            required
          />
        </InputGroup>
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoCorrect="off"
            spellCheck={false}
            required
          />
        </InputGroup>
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
            autoComplete="new-password"
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
            autoComplete="new-password"
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
