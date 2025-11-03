'use client'

import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FieldGroup } from '@/components/ui/field'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import type { ProfileDetail } from '@/features/admin/profile/api/types'
import { updateProfileMetadataAction, type ActionResponse } from '@/features/admin/profile/api/mutations'
import { ProfileMetadataFields } from './profile-metadata-fields'
import { ProfileMetadataSubmit } from './profile-metadata-submit'

interface ProfileMetadataFormProps {
  profile: ProfileDetail | null
  onUpdated: () => Promise<void>
}

const initialState: ActionResponse | null = null

const serializeSocial = (value: Record<string, string>) =>
  Object.entries(value)
    .map(([key, url]) => `${key}=${url}`)
    .join('\n')

const parseSocial = (value: string): Record<string, string> => {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, line) => {
      const [key, ...rest] = line.split('=')
      const trimmedKey = key?.trim()
      const trimmedValue = rest.join('=').trim()
      if (trimmedKey && trimmedValue) {
        acc[trimmedKey] = trimmedValue
      }
      return acc
    }, {})
}

const toListString = (values: string[]) => values.join(', ')
const parseList = (value: string, limit: number) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit)

export function ProfileMetadataForm({ profile, onUpdated }: ProfileMetadataFormProps) {
  const [tagsInput, setTagsInput] = useState('')
  const [interestsInput, setInterestsInput] = useState('')
  const [socialInput, setSocialInput] = useState('')
  const [feedback, setFeedback] = useState<ActionResponse | null>(initialState)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!profile) return
    setTagsInput(toListString(profile.metadata.tags))
    setInterestsInput(toListString(profile.metadata.interests))
    setSocialInput(serializeSocial(profile.metadata.socialProfiles))
    setFeedback(initialState)
  }, [profile])

  const hasMetadata = useMemo(() => {
    if (!profile) return false
    return (
      profile.metadata.tags.length > 0 ||
      profile.metadata.interests.length > 0 ||
      Object.keys(profile.metadata.socialProfiles).length > 0
    )
  }, [profile])

  if (!profile) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(initialState)

    startTransition(async () => {
      const payload = {
        profileId: profile.summary.id,
        tags: parseList(tagsInput, 15),
        interests: parseList(interestsInput, 20),
        socialProfiles: parseSocial(socialInput),
      }

      const result = await updateProfileMetadataAction(payload)
      setFeedback(result)

      if (result.success) {
        await onUpdated()
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="pb-2">
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Metadata &amp; social</CardTitle>
              <CardDescription>Maintain tags, interests, and external profile links.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup className="gap-4">
            <ProfileMetadataFields
              tagsInput={tagsInput}
              onTagsChange={setTagsInput}
              interestsInput={interestsInput}
              onInterestsChange={setInterestsInput}
              socialInput={socialInput}
              onSocialChange={setSocialInput}
              isPending={isPending}
            />
          </FieldGroup>

          {feedback && (
            <Alert variant={feedback.success ? 'default' : 'destructive'}>
              <AlertTitle>{feedback.success ? 'Metadata updated' : 'Update failed'}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}

          <ProfileMetadataSubmit
            isPending={isPending}
            hasMetadata={hasMetadata}
            onReset={() => {
              setTagsInput(toListString(profile.metadata.tags))
              setInterestsInput(toListString(profile.metadata.interests))
              setSocialInput(serializeSocial(profile.metadata.socialProfiles))
              setFeedback(initialState)
            }}
          />
        </form>
      </CardContent>
    </Card>
  )
}
