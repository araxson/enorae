'use client'

import { Dispatch, SetStateAction } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tag, X } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
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
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <Tag className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Tags</ItemTitle>
                <ItemDescription>Quick labels for your profile</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
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
  )
}
