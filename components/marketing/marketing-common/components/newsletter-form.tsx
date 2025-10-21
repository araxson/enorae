'use client'

import { useId, useState, useTransition } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/features/marketing/home/api/mutations'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

interface NewsletterFormProps {
  title?: string
  description?: string
  buttonText?: string
  inline?: boolean
}

const NewsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type NewsletterFormValues = z.infer<typeof NewsletterSchema>

export function NewsletterForm({
  title = 'Stay Updated',
  description = 'Get the latest news and exclusive offers delivered to your inbox',
  buttonText = 'Subscribe',
  inline = false,
}: NewsletterFormProps) {
  const [isPending, startTransition] = useTransition()
  const [subscribed, setSubscribed] = useState(false)
  const emailFieldId = useId()

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(({ email }) => {
    startTransition(async () => {
      try {
        const result = await subscribeToNewsletter({ email, source: 'marketing_site' })
        if (result.success) {
          setSubscribed(true)
          toast.success('Successfully subscribed to our newsletter!')
          form.reset({ email: '' })
        } else if (result.error) {
          toast.error(result.error)
        }
      } catch (error) {
        console.error('[NewsletterForm] subscription error:', error)
        toast.error('Failed to subscribe. Please try again later.')
      }
    })
  })

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-primary">
        <CheckCircle className="h-5 w-5" />
        <span>Thanks for subscribing!</span>
      </div>
    )
  }

  const cardClassName = cn(
    'w-full max-w-md',
    inline && 'border-none bg-transparent shadow-none'
  )
  const headerClassName = cn(inline && 'px-0 pt-0 text-center')
  const contentClassName = cn(inline && 'px-0 pt-0')
  const formClassName = inline ? 'flex flex-wrap items-center gap-2' : 'space-y-2'
  const formItemClassName = inline ? 'flex-1' : undefined
  const labelClassName = inline ? 'sr-only' : undefined
  const buttonClassName = inline ? 'gap-2' : 'w-full gap-2'

  return (
    <Card className={cardClassName}>
      <CardHeader className={headerClassName}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={contentClassName}>
        <Form {...form}>
          <form onSubmit={onSubmit} className={formClassName}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={formItemClassName}>
                  <FormLabel htmlFor={emailFieldId} className={labelClassName}>
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={emailFieldId}
                      type="email"
                      placeholder="Enter your email"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="default" type="submit" disabled={isPending} className={buttonClassName}>
              <Mail className="h-4 w-4" />
              {buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
