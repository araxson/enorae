'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { Mail, X } from 'lucide-react'

interface NewsletterInputProps {
  email: string
  onEmailChange: (email: string) => void
  onSubmit: (event: React.FormEvent) => void
  isPending: boolean
  buttonText: string
}

export function NewsletterInput({
  email,
  onEmailChange,
  onSubmit,
  isPending,
  buttonText,
}: NewsletterInputProps) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <InputGroup>
        <InputGroupAddon>
          <Mail className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          disabled={isPending}
        />
        {email ? (
          <InputGroupAddon>
            <InputGroupButton
              size="icon-sm"
              variant="ghost"
              type="button"
              onClick={() => onEmailChange('')}
              aria-label="Clear email"
            >
              <X className="size-4" aria-hidden="true" />
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" size="sm" disabled={isPending}>
            {isPending ? <Spinner className="size-3" /> : buttonText}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
