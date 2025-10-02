'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Stack } from '@/components/layout'
import { formData } from './form.data'

export function Form() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement contact form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setLoading(false)
    alert("Message sent! We'll get back to you soon.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {formData.fields.map((field) => (
              <Stack gap="xs" key={field.name}>
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
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
              </Stack>
            ))}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : formData.submitText}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
