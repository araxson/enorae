'use client'

import { useState, useTransition } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Mail, CheckCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/features/marketing/newsletter/api/mutations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface NewsletterFormProps {
  title?: string
  description?: string
  buttonText?: string
  inline?: boolean
}

export function NewsletterForm({
  title = 'Stay Updated',
  description = 'Get the latest news and exclusive offers delivered to your inbox',
  buttonText = 'Subscribe',
  inline = false,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    startTransition(async () => {
      try {
        const result = await subscribeToNewsletter({ email, source: 'marketing_site' })
        if (result.success) {
          setSubscribed(true)
          toast.success('Successfully subscribed to our newsletter!')
          setEmail('')
        } else if (result.error) {
          toast.error(result.error)
        }
      } catch (error) {
        console.error('[NewsletterForm] subscription error:', error)
        toast.error('Failed to subscribe. Please try again later.')
      }
    })
  }

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-primary">
        <CheckCircle className="h-5 w-5" />
        <p className="font-medium text-sm">Thanks for subscribing!</p>
      </div>
    )
  }

  if (inline) {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <InputGroup>
          <InputGroupAddon>
            <Mail className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isPending}
          />
          {email ? (
            <InputGroupAddon>
              <InputGroupButton
                size="icon-sm"
                variant="ghost"
                type="button"
                onClick={() => setEmail('')}
                aria-label="Clear email"
              >
                <X className="size-4" aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
          <InputGroupAddon align="inline-end">
            <InputGroupButton type="submit" size="sm" disabled={isPending}>
              {buttonText}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          <InputGroup>
            <InputGroupAddon>
              <Mail className="size-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isPending}
            />
            {email ? (
              <InputGroupAddon>
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  type="button"
                  onClick={() => setEmail('')}
                  aria-label="Clear email"
                >
                  <X className="size-4" aria-hidden="true" />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
            <InputGroupAddon align="inline-end">
              <InputGroupButton type="submit" size="sm" disabled={isPending}>
                {buttonText}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardContent>
    </Card>
  )
}
