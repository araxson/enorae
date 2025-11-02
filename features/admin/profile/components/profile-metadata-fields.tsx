'use client'

import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'

interface ProfileMetadataFieldsProps {
  tagsInput: string
  onTagsChange: (value: string) => void
  interestsInput: string
  onInterestsChange: (value: string) => void
  socialInput: string
  onSocialChange: (value: string) => void
  isPending: boolean
}

export function ProfileMetadataFields({
  tagsInput,
  onTagsChange,
  interestsInput,
  onInterestsChange,
  socialInput,
  onSocialChange,
  isPending,
}: ProfileMetadataFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="admin-profile-tags">Tags</FieldLabel>
        <FieldContent>
          <Textarea
            id="admin-profile-tags"
            value={tagsInput}
            onChange={(event) => onTagsChange(event.target.value)}
            placeholder="support, vip, beta"
            rows={2}
            disabled={isPending}
          />
          <FieldDescription>Comma separated, max 15 tags.</FieldDescription>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="admin-profile-interests">Interests</FieldLabel>
        <FieldContent>
          <Textarea
            id="admin-profile-interests"
            value={interestsInput}
            onChange={(event) => onInterestsChange(event.target.value)}
            placeholder="haircare, wellness, loyalty"
            rows={2}
            disabled={isPending}
          />
          <FieldDescription>Comma separated, max 20 entries.</FieldDescription>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="admin-profile-social">Social profiles</FieldLabel>
        <FieldContent>
          <Textarea
            id="admin-profile-social"
            value={socialInput}
            onChange={(event) => onSocialChange(event.target.value)}
            placeholder={'instagram=https://instagram.com/username\nwebsite=https://salon.com'}
            rows={4}
            disabled={isPending}
          />
          <FieldDescription>
            Enter one key=value pair per line. Keys become labels, values must be URLs.
          </FieldDescription>
        </FieldContent>
      </Field>
    </>
  )
}
