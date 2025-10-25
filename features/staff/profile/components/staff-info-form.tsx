'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { updateStaffInfo } from '@/features/staff/profile/api/mutations'

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(event.currentTarget)
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Update failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertTitle>Profile updated</AlertTitle>
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Professional information</CardTitle>
          <CardDescription>Share your role, experience, and story with clients.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              defaultValue={profile.title || ''}
              placeholder="e.g., Senior Stylist, Master Colorist"
              maxLength={100}
            />
            <p className="text-muted-foreground">Your professional title or role.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceYears">Years of experience</Label>
            <Input
              id="experienceYears"
              name="experienceYears"
              type="number"
              min="0"
              max="100"
              defaultValue={profile.experience_years ?? ''}
              placeholder="e.g., 5"
            />
            <p className="text-muted-foreground">How many years you&apos;ve been practicing.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio || ''}
              placeholder="Tell us about yourself, your specialties, and what you're passionate about..."
              rows={6}
              maxLength={1000}
            />
            <p className="text-muted-foreground">{profile.bio?.length || 0}/1000 characters</p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}
