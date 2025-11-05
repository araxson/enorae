'use client'

import { useActionState, useRef, useEffect } from 'react'
import {
  Item,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item'
import { submitContactMessage } from '@/features/marketing/contact/api/mutations'
import { FormStatus, FormFields, SubmitButton } from './sections'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, {})
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  return (
    <Item variant="outline">
      <ItemContent>
        <div className="flex flex-col gap-4">
          <ItemTitle>Send us a message</ItemTitle>

          <FormStatus
            isPending={isPending}
            success={state?.success}
            message={state?.message}
            errors={state?.errors}
          />

          <form action={formAction} className="space-y-6" noValidate>
            <FormFields
              errors={state?.errors}
              isPending={isPending}
              firstErrorRef={firstErrorRef}
            />

            <SubmitButton />
          </form>
        </div>
      </ItemContent>
    </Item>
  )
}
