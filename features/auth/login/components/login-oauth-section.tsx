'use client'

import Link from 'next/link'
import { FieldDescription, FieldSeparator } from '@/components/ui/field'
import { OAuthButtons } from '@/features/auth/common/components/oauth-buttons'

export function LoginOAuthSection() {
  return (
    <>
      <FieldSeparator>Or continue with</FieldSeparator>

      <OAuthButtons />

      <div className="px-2 text-center">
        <FieldDescription>
          By clicking continue, you agree to our{' '}
          <Link href="/terms" className="underline-offset-4 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </FieldDescription>
      </div>
    </>
  )
}
