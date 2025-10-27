'use client'

import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateUsername } from '@/features/shared/profile/api/mutations'
import { toast } from 'sonner'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface UsernameFormProps {
  currentUsername: string | null
}

export function UsernameForm({ currentUsername }: UsernameFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [username, setUsername] = useState(currentUsername || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateUsername(formData)

      if (result.success) {
        toast.success('Username updated successfully')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to update username')
      console.error('Error updating username:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>
          Your unique username is used to identify you across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <FieldContent>
                <Input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., john_doe"
                  minLength={3}
                  maxLength={50}
                  pattern="[a-zA-Z0-9_-]+"
                  title="Username can only contain letters, numbers, hyphens, and underscores"
                  required
                />
                <FieldDescription>
                  3-50 characters. Letters, numbers, hyphens, and underscores only.
                </FieldDescription>
              </FieldContent>
            </Field>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || username === currentUsername}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Username</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
