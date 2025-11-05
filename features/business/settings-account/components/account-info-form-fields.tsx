'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'

interface TextFieldProps {
  id: string
  name?: string
  label: string
  type?: 'text' | 'email' | 'tel'
  defaultValue?: string | null
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string[]
  hint?: string
  ref?: React.Ref<HTMLInputElement>
}

export function TextField({
  id,
  name,
  label,
  type = 'text',
  defaultValue,
  placeholder,
  required = false,
  disabled = false,
  error,
  hint,
  ref,
}: TextFieldProps) {
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
        <Input
          ref={ref}
          id={id}
          name={name || id}
          type={type}
          defaultValue={defaultValue || ''}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={disabled ? 'bg-muted' : ''}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
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
