'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'

import { InterestsTagsSection } from './interests-tags-section'
import { ProfileImagesSection } from './profile-images-section'
import { SocialProfilesSection } from './social-profiles-section'
import { useMetadataForm } from '../hooks/use-metadata-form'

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

        <Item variant="outline">
          <ItemHeader>
            <ItemTitle>Profile images</ItemTitle>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>Update the images customers see on your profile.</ItemDescription>
            <ProfileImagesSection
              avatarUrl={avatarUrl}
              coverUrl={coverUrl}
              isUploadingAvatar={isUploadingAvatar}
              isUploadingCover={isUploadingCover}
              onAvatarUpload={handleAvatarUpload}
              onCoverUpload={handleCoverUpload}
            />
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemHeader>
            <ItemTitle>Social profiles</ItemTitle>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>Share the places clients can follow your business.</ItemDescription>
            <SocialProfilesSection defaults={socialProfiles} />
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemHeader>
            <ItemTitle>Interests and tags</ItemTitle>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>Highlight services and topics that describe your brand.</ItemDescription>
            <InterestsTagsSection
              interests={interests}
              tags={tags}
              onAddInterest={handleAddInterest}
              onRemoveInterest={handleRemoveInterest}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          </ItemContent>
        </Item>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner />
              <span>Saving…</span>
            </>
          ) : (
            <span>Save Profile</span>
          )}
        </Button>
      </div>
    </form>
  )
}
