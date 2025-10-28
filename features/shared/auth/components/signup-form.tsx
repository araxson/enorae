'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from '@/features/shared/auth/api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { usePasswordStrength } from './password-strength-indicator'
import { SignupFormFields } from './signup-form-fields'
import { FieldSet } from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { isValid: isPasswordValid } = usePasswordStrength(password)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (!isPasswordValid) {
      setError('Please meet all password requirements')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success && result?.requiresOTP && result?.email) {
        const redirectUrl = `/auth/verify-otp?email=${encodeURIComponent(result.email)}&type=email`
        router.push(redirectUrl)
      } else if (result?.success && result?.message) {
        setSuccess(result.message)
      }
    } catch (error) {
      console.error('[SignupForm] unexpected error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <div className="flex flex-col gap-1">
            <ItemTitle>Create Account</ItemTitle>
            <ItemDescription>
              Sign up to start booking appointments
            </ItemDescription>
          </div>
        </ItemHeader>

        <form action={handleSubmit}>
          <ItemContent>
            <FieldSet className="gap-6">
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sign up failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              {success ? (
                <Alert>
                  <AlertTitle>Account created</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              ) : null}

              <SignupFormFields
                password={password}
                onPasswordChange={setPassword}
                confirmPassword={confirmPassword}
                onConfirmPasswordChange={setConfirmPassword}
              />
            </FieldSet>
          </ItemContent>

          <ItemFooter>
            <ButtonGroup className="w-full flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !isPasswordValid || password !== confirmPassword}
              >
                {loading ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </Button>
              <p className="text-sm font-medium text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline hover:text-foreground">
                  Sign in
                </Link>
              </p>
            </ButtonGroup>
          </ItemFooter>
        </form>
      </Item>
    </div>
  )
}
