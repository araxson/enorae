'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, Tag, X } from 'lucide-react'
import { updateProfileMetadata } from '@/features/customer/profile/api/mutations'
import type { Database } from '@/lib/types/database.types'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

type ProfileMetadata = Database['public']['Views']['profiles_metadata_view']['Row']

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
              <CardContent className="space-y-2">
                {interests.length === 0 ? (
                  <Empty>
                    <EmptyMedia variant="icon">
                      <Heart className="h-4 w-4" />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle>No interests yet</EmptyTitle>
                      <EmptyDescription>
                        Add topics to personalize your recommendations.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <ItemGroup className="gap-2">
                    {interests.map((interest) => (
                      <Item key={interest} variant="muted" size="sm">
                        <ItemContent>
                          <ItemTitle>{interest}</ItemTitle>
                        </ItemContent>
                        <ItemActions className="flex-none">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInterest(interest)}
                            aria-label={`Remove ${interest}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                )}
              </CardContent>
            </Card>
            <InputGroup>
              <InputGroupAddon>
                <Heart className="h-4 w-4" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Add an interest (e.g., Hair Color, Nail Art)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addInterest()
                  }
                }}
              />
              <InputGroupButton type="button" variant="outline" onClick={addInterest}>
                Add
              </InputGroupButton>
            </InputGroup>
          </div>

          {/* Tags */}
          <div>
            <Card>
              <CardHeader className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <CardTitle>Tags</CardTitle>
                <CardDescription>Quick labels for your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tags.length === 0 ? (
                  <Empty>
                    <EmptyMedia variant="icon">
                      <Tag className="h-4 w-4" />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle>No tags yet</EmptyTitle>
                      <EmptyDescription>
                        Add quick labels to highlight your preferences.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <ItemGroup className="gap-2">
                    {tags.map((tag) => (
                      <Item key={tag} variant="outline" size="sm">
                        <ItemContent>
                          <ItemTitle>{tag}</ItemTitle>
                        </ItemContent>
                        <ItemActions className="flex-none">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTag(tag)}
                            aria-label={`Remove ${tag}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                )}
              </CardContent>
            </Card>
            <InputGroup>
              <InputGroupAddon>
                <Tag className="h-4 w-4" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Add a tag (e.g., vegan, eco-friendly)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <InputGroupButton type="button" variant="outline" onClick={addTag}>
                Add
              </InputGroupButton>
            </InputGroup>
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
