'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
import { Heart, Tag, X } from 'lucide-react'
import { updateProfileMetadata } from '../api/mutations'
import type { Database } from '@/lib/types/database.types'

type ProfileMetadata = Database['public']['Views']['profiles_metadata']['Row']

interface ProfileMetadataEditorProps {
  metadata: ProfileMetadata | null
}

export function ProfileMetadataEditor({ metadata }: ProfileMetadataEditorProps) {
  const [interests, setInterests] = useState<string[]>(
    (metadata?.interests as string[]) || []
  )
  const [tags, setTags] = useState<string[]>(
    (metadata?.tags as string[]) || []
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
        <Stack gap="lg">
          {/* Interests */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4" />
              Interests
            </Label>
            <Stack gap="sm">
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                {interests.length === 0 && (
                  <p className="text-sm text-muted-foreground text-xs">No interests added yet</p>
                )}
                {interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="gap-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
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
            </Stack>
          </div>

          {/* Tags */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <Stack gap="sm">
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                {tags.length === 0 && (
                  <p className="text-sm text-muted-foreground text-xs">No tags added yet</p>
                )}
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
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
            </Stack>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>

          <p className="text-sm text-muted-foreground text-xs text-center">
            Your preferences help us recommend services and salons that match your style
          </p>
        </Stack>
      </CardContent>
    </Card>
  )
}
