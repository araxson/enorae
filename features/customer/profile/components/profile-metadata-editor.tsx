'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heart, Tag, X } from 'lucide-react'
import { updateProfileMetadata } from '@/features/customer/profile/api/mutations'
import type { Database } from '@/lib/types/database.types'

type ProfileMetadata = Database['public']['Views']['profiles_metadata']['Row']

interface ProfileMetadataEditorProps {
  metadata: ProfileMetadata | null
}

export function ProfileMetadataEditor({ metadata }: ProfileMetadataEditorProps) {
  const [interests, setInterests] = useState<string[]>(
    (metadata?.['interests'] as string[]) || []
  )
  const [tags, setTags] = useState<string[]>(
    (metadata?.['tags'] as string[]) || []
  )
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
    setInterests(interests.filter(i => i !== interest))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
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
          {/* Interests */}
          <div>
            <Card>
              <CardHeader className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <CardTitle>Interests</CardTitle>
                <CardDescription>Personal topics you care about</CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-10 flex-wrap gap-2">
                {interests.length === 0 && (
                  <p className="text-xs text-muted-foreground">No interests added yet</p>
                )}
                {interests.map((interest) => (
                  <div key={interest} className="flex items-center gap-1">
                    <Badge variant="secondary">{interest}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInterest(interest)}
                      aria-label={`Remove ${interest}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Input
                placeholder="Add an interest (e.g., Hair Color, Nail Art)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button type="button" onClick={addInterest} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Card>
              <CardHeader className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <CardTitle>Tags</CardTitle>
                <CardDescription>Quick labels for your profile</CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-10 flex-wrap gap-2">
                {tags.length === 0 && (
                  <p className="text-xs text-muted-foreground">No tags added yet</p>
                )}
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1">
                    <Badge variant="outline">{tag}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g., vegan, eco-friendly)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your preferences help us recommend services and salons that match your style
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
