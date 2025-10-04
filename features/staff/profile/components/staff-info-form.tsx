'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { updateStaffInfo } from '../api/mutations'

type StaffInfoFormProps = {
  profile: {
    title?: string | null
    bio?: string | null
    experience_years?: number | null
  }
}

export function StaffInfoForm({ profile }: StaffInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await updateStaffInfo(formData)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <Stack gap="lg">
            <H3>Professional Information</H3>
            <Separator />

            <Stack gap="sm">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                defaultValue={profile.title || ''}
                placeholder="e.g., Senior Stylist, Master Colorist"
                maxLength={100}
              />
              <Muted>Your professional title or role</Muted>
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="experienceYears">Years of Experience</Label>
              <Input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min="0"
                max="100"
                defaultValue={profile.experience_years ?? ''}
                placeholder="e.g., 5"
              />
              <Muted>How many years you&apos;ve been practicing</Muted>
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio || ''}
                placeholder="Tell us about yourself, your specialties, and what you're passionate about..."
                rows={6}
                maxLength={1000}
              />
              <Muted>{profile.bio?.length || 0}/1000 characters</Muted>
            </Stack>
          </Stack>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </Stack>
    </form>
  )
}
