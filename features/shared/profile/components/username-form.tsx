'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { updateUsername } from '../api/mutations'
import { toast } from 'sonner'

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
          <Stack gap="lg">
            <div>
              <Label htmlFor="username">Username</Label>
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
              <p className="text-xs text-muted-foreground mt-1">
                3-50 characters. Letters, numbers, hyphens, and underscores only.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || username === currentUsername}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Username
              </Button>
            </div>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
