'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateProfileMetadata } from '@/features/customer/profile/api/mutations'
import type { Database } from '@/lib/types/database.types'
import { Spinner } from '@/components/ui/spinner'
import { InterestsSection } from './metadata/interests-section'
import { TagsSection } from './metadata/tags-section'

type ProfileMetadata = Database['public']['Views']['profiles_metadata_view']['Row']

interface ProfileMetadataEditorProps {
  metadata: ProfileMetadata | null
}

export function ProfileMetadataEditor({ metadata }: ProfileMetadataEditorProps) {
  const [interests, setInterests] = useState<string[]>((metadata?.['interests'] as string[]) || [])
  const [tags, setTags] = useState<string[]>((metadata?.['tags'] as string[]) || [])
  const [newInterest, setNewInterest] = useState('')
  const [newTag, setNewTag] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('interests', interests.join(','))
      formData.append('tags', tags.join(','))
      await updateProfileMetadata(formData)
    } catch (error) {
      console.error('Failed to save metadata:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Preferences</CardTitle>
        <CardDescription>
          Manage your interests and preferences to get better recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <InterestsSection
            interests={interests}
            setInterests={setInterests}
            newInterest={newInterest}
            setNewInterest={setNewInterest}
            addInterest={addInterest}
            removeInterest={removeInterest}
          />

          <TagsSection
            tags={tags}
            setTags={setTags}
            newTag={newTag}
            setNewTag={setNewTag}
            addTag={addTag}
            removeTag={removeTag}
          />

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Spinner className="size-4" />
                <span>Saving</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your preferences help us recommend services and salons that match your style
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
