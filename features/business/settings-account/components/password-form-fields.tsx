'use client'

import { Eye, EyeOff } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

type PasswordFieldProps = {
  id: string
  name: string
  label: string
  required?: boolean
  showPassword: boolean
  onToggleShow: () => void
  error?: string[]
  hint?: string
  autoComplete: 'current-password' | 'new-password'
  minLength?: number
  ref?: React.Ref<HTMLInputElement>
}

export function PasswordField({
  id,
  name,
  label,
  required = true,
  showPassword,
  onToggleShow,
  error,
  hint,
  autoComplete,
  minLength,
  ref,
}: PasswordFieldProps) {
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-label="required">
            {' '}*
          </span>
        )}
      </FieldLabel>
      <FieldContent>
        <InputGroup>
          <InputGroupInput
            ref={ref}
            id={id}
            name={name}
            type={showPassword ? 'text' : 'password'}
            required={required}
            minLength={minLength}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            autoComplete={autoComplete}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              onClick={onToggleShow}
              variant="ghost"
              size="icon-sm"
              aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {hint && <FieldDescription id={hintId}>{hint}</FieldDescription>}
        {error && (
          <p id={errorId} className="text-sm text-destructive mt-1" role="alert">
            {error[0]}
          </p>
        )}
      </FieldContent>
    </Field>
  )
}
