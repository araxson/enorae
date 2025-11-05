'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, Mail, ArrowLeft } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { FieldSet } from '@/components/ui/field'

interface ForgotPasswordSuccessProps {
  message?: string
}

export function ForgotPasswordSuccess({ message }: ForgotPasswordSuccessProps) {
  return (
    <div className="w-full max-w-md">
      <Item variant="outline" className="flex flex-col gap-4">
        <ItemHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center">
              <Mail className="size-12 text-primary" aria-hidden="true" />
            </div>
            <ItemTitle>Check your email</ItemTitle>
            <ItemDescription>
              {message ||
                'If an account exists with that email, you will receive a password reset link.'}
            </ItemDescription>
          </div>
        </ItemHeader>

        <ItemContent>
          <FieldSet className="gap-6">
            <Alert>
              <CheckCircle2 className="size-4 text-primary" />
              <AlertTitle>Reset link sent</AlertTitle>
              <AlertDescription>
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </AlertDescription>
            </Alert>

            <p className="text-center text-sm font-medium text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder
            </p>
          </FieldSet>
        </ItemContent>

        <ItemFooter>
          <ButtonGroup aria-label="Navigation">
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 size-4" />
                Back to login
              </Link>
            </Button>
          </ButtonGroup>
        </ItemFooter>
      </Item>
    </div>
  )
}
