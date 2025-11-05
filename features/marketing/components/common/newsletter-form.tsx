'use client'

import { useState, useActionState, useEffect } from 'react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { toast } from '@/components/ui/sonner'
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
  const [subscribed, setSubscribed] = useState(false)

  // Server Action wrapper for useActionState
  type SubscribeFormState = { success: boolean; error: string | null }

  const subscribeAction = async (prevState: SubscribeFormState, formData: FormData): Promise<SubscribeFormState> => {
    const emailValue = formData.get('email')
    const email = typeof emailValue === 'string' ? emailValue : ''
    const result = await subscribeToNewsletter({ email, source: 'marketing_site' })

    if (result.success) {
      setSubscribed(true)
      toast.success('Successfully subscribed to our newsletter!')
      return { success: true, error: null }
    }

    if (result.error) {
      toast.error(result.error)
    }

    return { success: false, error: result.error || 'Failed to subscribe' }
  }

  const [state, formAction, isPending] = useActionState(subscribeAction, { success: false, error: null })

  if (subscribed) {
    return <NewsletterSuccess />
  }

  if (inline) {
    return (
      <NewsletterInput
        formAction={formAction}
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
              formAction={formAction}
              isPending={isPending}
              buttonText={buttonText}
            />
          </div>
        </ItemContent>
      </Item>
    </div>
  )
}
