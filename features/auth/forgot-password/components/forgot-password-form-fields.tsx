'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

interface ForgotPasswordFormFieldsProps {
  formAction: (formData: FormData) => void
  isPending: boolean
  error?: string
  firstErrorRef: React.RefObject<HTMLInputElement | null>
}

export function ForgotPasswordFormFields({
  formAction,
  isPending,
  error,
  firstErrorRef,
}: ForgotPasswordFormFieldsProps) {
  return (
    <div className="w-full max-w-md">
      <Item variant="outline" className="flex flex-col gap-4">
        <ItemHeader>
          <div className="flex flex-col gap-1">
            <ItemTitle>Forgot password?</ItemTitle>
            <ItemDescription>
              Enter your email address and we&apos;ll send you a link to reset your password
            </ItemDescription>
          </div>
        </ItemHeader>

        <form action={formAction} noValidate>
          {/* Screen reader announcement for form status */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {isPending && 'Sending password reset link, please wait'}
            {error && !isPending && error}
          </div>

          <ItemContent>
            <FieldSet className="gap-6">
              {error && (
                <Alert variant="destructive" role="alert">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Reset failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="email">
                    Email address
                    <span className="text-destructive" aria-label="required">
                      {' '}
                      *
                    </span>
                  </FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupAddon>
                        <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                      </InputGroupAddon>
                      <InputGroupInput
                        ref={error ? firstErrorRef : null}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoFocus
                        autoCorrect="off"
                        spellCheck={false}
                        required
                        aria-required="true"
                        aria-invalid={!!error}
                        aria-describedby={error ? 'email-error email-hint' : 'email-hint'}
                        disabled={isPending}
                      />
                    </InputGroup>
                    <FieldDescription id="email-hint">
                      We&apos;ll send a password reset link to this email
                    </FieldDescription>
                    {error && (
                      <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                        {error}
                      </p>
                    )}
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>
          </ItemContent>

          <ItemFooter>
            <ButtonGroup aria-label="Form actions">
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending ? (
                  <>
                    <Spinner className="size-4" />
                    <span aria-hidden="true">Sending...</span>
                    <span className="sr-only">Sending password reset link, please wait</span>
                  </>
                ) : (
                  <span>Send reset link</span>
                )}
              </Button>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to login
                </Link>
              </Button>
            </ButtonGroup>
          </ItemFooter>
        </form>
      </Item>
    </div>
  )
}
