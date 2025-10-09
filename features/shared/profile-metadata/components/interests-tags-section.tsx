'use client'

import { Stack } from '@/components/layout'

import { ArrayInput } from './array-input'

type InterestsTagsSectionProps = {
  interests: string[]
  tags: string[]
  onAddInterest: (value: string) => void
  onRemoveInterest: (index: number) => void
  onAddTag: (value: string) => void
  onRemoveTag: (index: number) => void
}

export function InterestsTagsSection({
  interests,
  tags,
  onAddInterest,
  onRemoveInterest,
  onAddTag,
  onRemoveTag,
}: InterestsTagsSectionProps) {
  return (
    <Stack gap="lg">
      <ArrayInput
        label="Interests"
        items={interests}
        onAdd={onAddInterest}
        onRemove={onRemoveInterest}
        placeholder="e.g., Hair Styling, Makeup, Nails"
      />
      <ArrayInput
        label="Tags"
        items={tags}
        onAdd={onAddTag}
        onRemove={onRemoveTag}
        placeholder="e.g., Professional, Certified, Experienced"
      />
    </Stack>
  )
}
