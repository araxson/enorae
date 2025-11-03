'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { reviewSchema, type ReviewSchema, type ReviewSchemaInput } from '../api/schema'
import { updateReview } from '../api/mutations/reviews'
import { toast } from 'sonner'
import { useState } from 'react'

interface EditReviewFormProps {
  reviewId: string
  salonId: string
  defaultComment: string | null
  defaultRating: number | null
  defaultTitle?: string | null
  onSuccess?: () => void
}

export function EditReviewForm({
  reviewId,
  salonId,
  defaultComment,
  defaultRating,
  defaultTitle,
  onSuccess,
}: EditReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ReviewSchemaInput, unknown, ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      salonId,
      rating: defaultRating ?? 3,
      title: defaultTitle ?? '',
      comment: defaultComment ?? '',
    },
  })

  const handleSubmit = async (data: ReviewSchema) => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('salonId', data.salonId)
    formData.append('rating', String(data.rating))
    if (data.title) formData.append('title', data.title)
    formData.append('comment', data.comment)

    const result = await updateReview(reviewId, formData)
    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Review updated successfully')
      onSuccess?.()
    }
  }

  const rating = form.watch('rating') as number

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overall rating</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className="size-10 flex items-center justify-center transition-colors hover:bg-muted rounded"
                      aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                    >
                      <Star
                        className={`size-5 ${value <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormDescription>{rating} out of 5 stars</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Summarize your experience" maxLength={200} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience..."
                  rows={5}
                  maxLength={2000}
                  {...field}
                />
              </FormControl>
              <FormDescription>Minimum 10 characters, maximum 2000</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Review'}
        </Button>
      </form>
    </Form>
  )
}
