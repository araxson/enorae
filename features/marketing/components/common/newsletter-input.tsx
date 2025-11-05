'use client'

import { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { Mail, X } from 'lucide-react'

interface NewsletterInputProps {
  formAction: (formData: FormData) => void
  isPending: boolean
  buttonText: string
}

export function NewsletterInput({
  formAction,
  isPending,
  buttonText,
}: NewsletterInputProps) {
  const [email, setEmail] = useState('')

  return (
    <form action={formAction} className="w-full max-w-md" noValidate>
      <InputGroup>
        <InputGroupAddon>
          <Mail className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isPending}
          autoCorrect="off"
          spellCheck={false}
          required
          aria-label="Email address"
          aria-required="true"
          aria-describedby="email-hint"
        />
        <span id="email-hint" className="sr-only">Enter your email to subscribe to our newsletter</span>
        {email ? (
          <InputGroupAddon align="inline-end">
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
          <InputGroupButton type="submit" size="sm" disabled={isPending} aria-busy={isPending}>
            {isPending ? <Spinner className="size-3" /> : buttonText}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
