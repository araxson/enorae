'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Stack, Grid, Flex } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, User } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { updateProfileMetadata, uploadAvatar, uploadCoverImage, type ProfileMetadataInput } from '../api/mutations'

type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row']

interface MetadataFormProps {
  metadata: ProfileMetadata | null
}

export function MetadataForm({ metadata }: MetadataFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [avatarUrl, setAvatarUrl] = useState(metadata?.avatar_url || '')
  const [coverUrl, setCoverUrl] = useState(metadata?.cover_image_url || '')
  const [interests, setInterests] = useState<string[]>(metadata?.interests || [])
  const [tags, setTags] = useState<string[]>(metadata?.tags || [])

  const [socialProfiles] = useState<Record<string, string>>(
    (metadata?.social_profiles as Record<string, string>) || {}
  )

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    setError(null)

    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatar(formData)

    if (result.success) {
      setAvatarUrl(result.data.url)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error)
    }

    setIsUploadingAvatar(false)
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingCover(true)
    setError(null)

    const formData = new FormData()
    formData.append('cover', file)

    const result = await uploadCoverImage(formData)

    if (result.success) {
      setCoverUrl(result.data.url)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error)
    }

    setIsUploadingCover(false)
  }

  const handleAddItem = (value: string, setter: (items: string[]) => void, current: string[]) => {
    if (value.trim() && !current.includes(value.trim())) {
      setter([...current, value.trim()])
    }
  }

  const handleRemoveItem = (index: number, setter: (items: string[]) => void, current: string[]) => {
    setter(current.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    const updatedSocialProfiles: Record<string, string> = {}
    const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube']

    platforms.forEach(platform => {
      const value = formData.get(`social_${platform}`) as string
      if (value) {
        updatedSocialProfiles[platform] = value
      }
    })

    const input: ProfileMetadataInput = {
      avatar_url: avatarUrl || null,
      cover_image_url: coverUrl || null,
      social_profiles: Object.keys(updatedSocialProfiles).length > 0 ? updatedSocialProfiles : null,
      interests: interests.length > 0 ? interests : null,
      tags: tags.length > 0 ? tags : null,
    }

    const result = await updateProfileMetadata(input)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error)
    }

    setIsSubmitting(false)
  }

  const ArrayInput = ({
    label,
    items,
    setter,
    placeholder,
  }: {
    label: string
    items: string[]
    setter: (items: string[]) => void
    placeholder: string
  }) => {
    const [inputValue, setInputValue] = useState('')

    return (
      <Stack gap="sm">
        <Label>{label}</Label>
        <Flex gap="sm">
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddItem(inputValue, setter, items)
                setInputValue('')
              }
            }}
            placeholder={placeholder}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              handleAddItem(inputValue, setter, items)
              setInputValue('')
            }}
          >
            Add
          </Button>
        </Flex>
        <Flex gap="sm" className="flex-wrap">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary">
              {item}
              <button
                type="button"
                onClick={() => handleRemoveItem(index, setter, items)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </Flex>
      </Stack>
    )
  }

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

        {/* Avatar & Cover */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Profile Images</H3>
            <Separator />

            {/* Avatar */}
            <Stack gap="sm">
              <Label>Avatar</Label>
              <Flex gap="lg" align="center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <Stack gap="sm">
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={isUploadingAvatar}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                  </Button>
                  <Muted>Max 5MB, JPG or PNG</Muted>
                </Stack>
              </Flex>
            </Stack>

            {/* Cover Image */}
            <Stack gap="sm">
              <Label>Cover Image</Label>
              {coverUrl && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-muted relative">
                  <Image src={coverUrl} alt="Cover" fill className="object-cover" />
                </div>
              )}
              <Stack gap="sm">
                <Input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={isUploadingCover}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('cover-upload')?.click()}
                  disabled={isUploadingCover}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploadingCover ? 'Uploading...' : 'Upload Cover Image'}
                </Button>
                <Muted>Max 10MB, JPG or PNG, recommended 1200x400px</Muted>
              </Stack>
            </Stack>
          </Stack>
        </Card>

        {/* Social Profiles */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Social Profiles</H3>
            <Separator />

            <Grid cols={{ base: 1, md: 2 }} gap="lg">
              <Stack gap="sm">
                <Label htmlFor="social_facebook">Facebook</Label>
                <Input
                  id="social_facebook"
                  name="social_facebook"
                  type="url"
                  defaultValue={socialProfiles.facebook || ''}
                  placeholder="https://facebook.com/yourprofile"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="social_instagram">Instagram</Label>
                <Input
                  id="social_instagram"
                  name="social_instagram"
                  type="url"
                  defaultValue={socialProfiles.instagram || ''}
                  placeholder="https://instagram.com/yourprofile"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="social_twitter">Twitter/X</Label>
                <Input
                  id="social_twitter"
                  name="social_twitter"
                  type="url"
                  defaultValue={socialProfiles.twitter || ''}
                  placeholder="https://twitter.com/yourprofile"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="social_linkedin">LinkedIn</Label>
                <Input
                  id="social_linkedin"
                  name="social_linkedin"
                  type="url"
                  defaultValue={socialProfiles.linkedin || ''}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="social_tiktok">TikTok</Label>
                <Input
                  id="social_tiktok"
                  name="social_tiktok"
                  type="url"
                  defaultValue={socialProfiles.tiktok || ''}
                  placeholder="https://tiktok.com/@yourprofile"
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="social_youtube">YouTube</Label>
                <Input
                  id="social_youtube"
                  name="social_youtube"
                  type="url"
                  defaultValue={socialProfiles.youtube || ''}
                  placeholder="https://youtube.com/@yourprofile"
                />
              </Stack>
            </Grid>
          </Stack>
        </Card>

        {/* Interests & Tags */}
        <Card className="p-6">
          <Stack gap="lg">
            <H3>Interests & Tags</H3>
            <Separator />

            <ArrayInput
              label="Interests"
              items={interests}
              setter={setInterests}
              placeholder="e.g., Hair Styling, Makeup, Nails"
            />

            <ArrayInput
              label="Tags"
              items={tags}
              setter={setTags}
              placeholder="e.g., Professional, Certified, Experienced"
            />
          </Stack>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </Stack>
    </form>
  )
}
