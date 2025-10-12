'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formData } from './form.data'
import { submitContactMessage } from '@/features/marketing/home/api/mutations'

export function Form() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      name: form.get('name')?.toString() ?? '',
      email: form.get('email')?.toString() ?? '',
      phone: form.get('phone')?.toString() || undefined,
      topic: form.get('topic')?.toString() || undefined,
      message: form.get('message')?.toString() ?? '',
    }

    setLoading(true)
    try {
      const result = await submitContactMessage(payload)
      if (result.success) {
        toast.success('Message sent! We will get back to you soon.')
        event.currentTarget.reset()
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch (error) {
      console.error('[ContactForm] submission error:', error)
      toast.error('We could not send your message right now. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.fields.map((field) => (
            <div className="space-y-2" key={field.name}>
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="ml-1 text-destructive">*</span>}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={5}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : formData.submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
