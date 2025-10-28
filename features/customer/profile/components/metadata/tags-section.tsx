'use client'

import { Dispatch, SetStateAction } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tag, X } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
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

interface TagsSectionProps {
  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
  newTag: string
  setNewTag: Dispatch<SetStateAction<string>>
  addTag: () => void
  removeTag: (tag: string) => void
}

export function TagsSection({
  tags,
  newTag,
  setNewTag,
  addTag,
  removeTag,
}: TagsSectionProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Quick labels for your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {tags.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Tag className="size-4" />
                </EmptyMedia>
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
                  <ItemActions>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="size-3" />
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
          <Tag className="size-4" aria-hidden="true" />
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
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="outline"
            onClick={addTag}
            aria-label="Add tag"
          >
            Add
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
