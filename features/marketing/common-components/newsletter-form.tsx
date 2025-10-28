'use client'

import { useState, useTransition } from 'react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/features/marketing/newsletter/api/mutations'
import { NewsletterInput } from './newsletter-input'
import { NewsletterSuccess } from './newsletter-success'

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
    return <NewsletterSuccess />
  }

  if (inline) {
    return (
      <NewsletterInput
        email={email}
        onEmailChange={setEmail}
        onSubmit={handleSubmit}
        isPending={isPending}
        buttonText={buttonText}
      />
    )
  }

  return (
    <div className="w-full max-w-md">
      <Item variant="outline">
        <ItemContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription>{description}</ItemDescription>
            </div>
            <NewsletterInput
              email={email}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
              isPending={isPending}
              buttonText={buttonText}
            />
          </div>
        </ItemContent>
      </Item>
    </div>
  )
}
