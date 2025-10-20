'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/features/marketing/home/api/mutations'

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
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <small className="text-sm font-medium leading-none">Thanks for subscribing!</small>
      </div>
    )
  }

  if (inline) {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending} className="gap-2">
            <Mail className="h-4 w-4" />
            {buttonText}
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="leading-7 text-sm text-muted-foreground">{description}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending} className="w-full gap-2">
          <Mail className="h-4 w-4" />
          {buttonText}
        </Button>
      </form>
    </div>
  )
}
