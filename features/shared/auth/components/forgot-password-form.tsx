'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/features/shared/auth/api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Mail, ArrowLeft } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await requestPasswordReset(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <Item variant="outline" className="flex flex-col gap-4">
          <ItemHeader>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center justify-center">
                <Mail className="h-12 w-12 text-primary" aria-hidden="true" />
              </div>
              <ItemTitle>Check your email</ItemTitle>
              <ItemDescription>
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </ItemDescription>
            </div>
          </ItemHeader>

          <ItemContent>
            <FieldSet className="gap-6">
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle>Reset link sent</AlertTitle>
                <AlertDescription>
                  Click the link in the email to reset your password. The link will expire in 1
                  hour.
                </AlertDescription>
              </Alert>

              <p className="text-center text-sm font-medium text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setSuccess(false)}
                >
                  try again
                </Button>
              </p>
            </FieldSet>
          </ItemContent>

          <ItemFooter>
            <ButtonGroup className="w-full">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </Button>
            </ButtonGroup>
          </ItemFooter>
        </Item>
      </div>
    )
  }

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

        <form action={handleSubmit}>
          <ItemContent>
            <FieldSet className="gap-6">
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Reset failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <FieldContent>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoFocus
                    />
                    <FieldDescription>
                      We&apos;ll send a password reset link to this email
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>
          </ItemContent>

          <ItemFooter>
            <ButtonGroup className="w-full flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send reset link</span>
                )}
              </Button>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
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
