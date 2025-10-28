'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { contactSchema, type ContactSchema } from '@/features/marketing/contact/schema'
import { submitContactMessage } from '@/features/marketing/contact/api/mutations'
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function ContactForm() {
  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      topic: '',
      message: '',
    },
  })

  async function onSubmit(values: ContactSchema) {
    try {
      const result = await submitContactMessage(values)
      if (result.success) {
        toast.success('Message sent! We will get back to you soon.')
        form.reset()
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch (error) {
      console.error('[ContactForm] submission error:', error)
      toast.error('We could not send your message right now. Please try again later.')
    }
  }

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Send us a message</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel>
                        Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FieldError>
                          <FormMessage />
                        </FieldError>
                      </FieldContent>
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel>
                        Email <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FieldError>
                          <FormMessage />
                        </FieldError>
                      </FieldContent>
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel>Phone</FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input type="tel" placeholder="(optional)" {...field} />
                        </FormControl>
                        <FieldError>
                          <FormMessage />
                        </FieldError>
                      </FieldContent>
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel>Topic</FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input placeholder="What is this about? (optional)" {...field} />
                        </FormControl>
                        <FieldError>
                          <FormMessage />
                        </FieldError>
                      </FieldContent>
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel>
                        Message <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Textarea placeholder="Your message" rows={5} {...field} />
                        </FormControl>
                        <FieldError>
                          <FormMessage />
                        </FieldError>
                      </FieldContent>
                    </Field>
                  </FormItem>
                )}
              />
            </FieldSet>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </form>
        </Form>
      </ItemContent>
    </Item>
  )
}
