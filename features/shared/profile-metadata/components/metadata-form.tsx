'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Database } from '@/lib/types/database.types'

import { InterestsTagsSection } from './interests-tags-section'
import { ProfileImagesSection } from './profile-images-section'
import { SocialProfilesSection } from './social-profiles-section'
import { useMetadataForm } from './use-metadata-form'

type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row']

interface MetadataFormProps {
  metadata: ProfileMetadata | null
}

export function MetadataForm({ metadata }: MetadataFormProps) {
  const {
    avatarUrl,
    coverUrl,
    interests,
    tags,
    isSubmitting,
    isUploadingAvatar,
    isUploadingCover,
    error,
    success,
    socialProfiles,
    handleAvatarUpload,
    handleCoverUpload,
    handleSubmit,
    handleAddInterest,
    handleRemoveInterest,
    handleAddTag,
    handleRemoveTag,
  } = useMetadataForm({ metadata })

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-8">
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
            <CardTitle>Profile images</CardTitle>
            <CardDescription>Update the images customers see on your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileImagesSection
              avatarUrl={avatarUrl}
              coverUrl={coverUrl}
              isUploadingAvatar={isUploadingAvatar}
              isUploadingCover={isUploadingCover}
              onAvatarUpload={handleAvatarUpload}
              onCoverUpload={handleCoverUpload}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social profiles</CardTitle>
            <CardDescription>Share the places clients can follow your business.</CardDescription>
          </CardHeader>
          <CardContent>
            <SocialProfilesSection defaults={socialProfiles} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interests and tags</CardTitle>
            <CardDescription>Highlight services and topics that describe your brand.</CardDescription>
          </CardHeader>
          <CardContent>
            <InterestsTagsSection
              interests={interests}
              tags={tags}
              onAddInterest={handleAddInterest}
              onRemoveInterest={handleRemoveInterest}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  )
}
