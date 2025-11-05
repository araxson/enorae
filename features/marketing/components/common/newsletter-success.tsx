'use client'

import { CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function NewsletterSuccess() {
  return (
    <Alert>
      <CheckCircle className="size-4" />
      <AlertTitle>Thanks for subscribing!</AlertTitle>
      <AlertDescription>
        You'll receive our latest updates and exclusive offers in your inbox.
      </AlertDescription>
    </Alert>
  )
}
