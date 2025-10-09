'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { H3 } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
      <Stack gap="xl">
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

        <Card>
          <CardContent>
            <Stack gap="lg">
              <H3>Profile Images</H3>
              <Separator />
              <ProfileImagesSection
                avatarUrl={avatarUrl}
                coverUrl={coverUrl}
                isUploadingAvatar={isUploadingAvatar}
                isUploadingCover={isUploadingCover}
                onAvatarUpload={handleAvatarUpload}
                onCoverUpload={handleCoverUpload}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack gap="lg">
              <H3>Social Profiles</H3>
              <Separator />
              <SocialProfilesSection defaults={socialProfiles} />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack gap="lg">
              <H3>Interests & Tags</H3>
              <Separator />
              <InterestsTagsSection
                interests={interests}
                tags={tags}
                onAddInterest={handleAddInterest}
                onRemoveInterest={handleRemoveInterest}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />
            </Stack>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </Stack>
    </form>
  )
}
