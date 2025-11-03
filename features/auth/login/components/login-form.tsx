'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { MarketingPanel } from './marketing-panel'
import { LoginFormFields } from './login-form-fields'
import { LoginOAuthSection } from './login-oauth-section'
import { login } from '../api/mutations'
import { loginSchema, type LoginSchema } from '../api/schema'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current)
      }
    }
  }, [])

  async function handleSubmit(values: LoginSchema) {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)

      const result = await login(formData)

      if (!result.success) {
        setError(result.error)

        const { requiresOTP, email } = result
        if (requiresOTP && email) {
          redirectTimerRef.current = setTimeout(() => {
            const redirectUrl = `/auth/verify-otp?email=${encodeURIComponent(email)}&type=email`
            router.push(redirectUrl)
          }, 2000)
        }
      } else if (result.requiresOTP) {
        // Redirect to OTP verification
        const redirectUrl = `/auth/verify-otp?email=${encodeURIComponent(result.email)}&type=email`
        router.push(redirectUrl)
      }
    } catch (error) {
      console.error('[LoginForm] unexpected error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Login to your Enorae account
                  </p>
                </div>

                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Login failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <LoginFormFields form={form} />

                <Field>
                  <Button type="submit" disabled={loading || form.formState.isSubmitting}>
                    {loading || form.formState.isSubmitting ? (
                      <>
                        <Spinner />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>
                </Field>

                <LoginOAuthSection />
              </form>
            </Form>
            <MarketingPanel />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
