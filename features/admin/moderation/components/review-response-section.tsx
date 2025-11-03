'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { respondToReview } from '@/features/admin/moderation/api/mutations'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'
import { Panel } from './review-detail-helpers'
import { ReviewResponseForm } from './review-response-form'
import { ButtonGroup } from '@/components/ui/button-group'

type Props = {
  review: ModerationReview
  onSuccess: () => void
}

export function ReviewResponseSection({ review, onSuccess }: Props) {
  const [isResponding, setIsResponding] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmitResponse() {
    if (!review) {
      toast.error('Review data is unavailable')
      return
    }

    if (!responseText.trim()) {
      toast.error('Response cannot be empty')
      return
    }
    if (!review['id']) {
      toast.error('Invalid review ID')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('reviewId', review['id'])
    formData.append('response', responseText)

    const result = await respondToReview(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Your response has been added to the review.')
    setIsResponding(false)
    setResponseText('')
    onSuccess()
  }

  if (review['has_response']) {
    return (
      <Panel title="Response" tone="info">
        Response has been recorded. Response content is not available in this overview.
        {review['response_date'] && (
          <p className="mt-2 text-xs text-muted-foreground">
            Responded on {format(new Date(review['response_date']), 'MMMM d, yyyy')}
          </p>
        )}
      </Panel>
    )
  }

  if (!isResponding) {
    return (
      <ButtonGroup aria-label="Actions">
        <Button onClick={() => setIsResponding(true)} variant="outline">
          <MessageSquare className="mr-2 size-4" />
          Add response
        </Button>
      </ButtonGroup>
    )
  }

  return (
    <ReviewResponseForm
      value={responseText}
      onChange={setResponseText}
      onCancel={() => {
        setIsResponding(false)
        setResponseText('')
      }}
      onSubmit={handleSubmitResponse}
      isLoading={isLoading}
    />
  )
}
