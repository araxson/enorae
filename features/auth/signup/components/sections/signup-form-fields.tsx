import type { SignupResult } from '../../api/types'
import { Mail, User } from 'lucide-react'
import { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { PasswordInput, PasswordStrengthIndicator } from '@/features/auth/common/components'

type SignupFormFieldsProps = {
  hasErrors: boolean
  state: SignupResult | { success: false }
  isPending: boolean
  firstErrorRef: React.RefObject<HTMLInputElement>
}

export function SignupFormFields({ hasErrors, state, isPending, firstErrorRef }: SignupFormFieldsProps): React.ReactElement {
  const [password, setPassword] = useState('')

  return (
    <>
      {/* Full Name Field */}
      <Field>
        <FieldLabel htmlFor="fullName">
          Full Name
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <User className="size-4 text-muted-foreground" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            ref={
              hasErrors && 'errors' in state && state.errors?.['full_name']
                ? firstErrorRef
                : null
            }
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={!!(hasErrors && 'errors' in state && state.errors?.['full_name'])}
            aria-describedby={
              hasErrors && 'errors' in state && state.errors?.['full_name']
                ? 'fullName-error'
                : undefined
            }
            disabled={isPending}
          />
        </InputGroup>
        {hasErrors && 'errors' in state && state.errors?.['full_name'] && (
          <p id="fullName-error" className="text-sm text-destructive mt-1" role="alert">
            {state.errors['full_name'][0]}
          </p>
        )}
      </Field>

      {/* Email Field */}
      <Field>
        <FieldLabel htmlFor="email">
          Email
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
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
            aria-required="true"
            aria-invalid={!!(hasErrors && 'errors' in state && state.errors?.['email'])}
            aria-describedby={
              hasErrors && 'errors' in state && state.errors?.['email']
                ? 'email-error'
                : undefined
            }
            disabled={isPending}
          />
        </InputGroup>
        {hasErrors && 'errors' in state && state.errors?.['email'] && (
          <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
            {state.errors['email'][0]}
          </p>
        )}
      </Field>

      {/* Password Field */}
      <Field>
        <FieldLabel htmlFor="password">
          Password
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!(hasErrors && 'errors' in state && state.errors?.['password'])}
          aria-describedby={
            hasErrors && 'errors' in state && state.errors?.['password']
              ? 'password-error password-strength'
              : 'password-strength'
          }
          disabled={isPending}
        />
        {password ? (
          <FieldDescription id="password-strength">
            <PasswordStrengthIndicator password={password} showRequirements />
          </FieldDescription>
        ) : (
          <div id="password-strength" className="text-sm text-muted-foreground mt-1">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside ml-2">
              <li>At least 8 characters</li>
              <li>One uppercase and one lowercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>
        )}
        {hasErrors && 'errors' in state && state.errors?.['password'] && (
          <p id="password-error" className="text-sm text-destructive mt-1" role="alert">
            {state.errors['password'][0]}
          </p>
        )}
      </Field>
    </>
  )
}
