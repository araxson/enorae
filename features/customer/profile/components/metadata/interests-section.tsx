'use client'

import { Dispatch, SetStateAction } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, X } from 'lucide-react'
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

interface InterestsSectionProps {
  interests: string[]
  setInterests: Dispatch<SetStateAction<string[]>>
  newInterest: string
  setNewInterest: Dispatch<SetStateAction<string>>
  addInterest: () => void
  removeInterest: (interest: string) => void
}

export function InterestsSection({
  interests,
  newInterest,
  setNewInterest,
  addInterest,
  removeInterest,
}: InterestsSectionProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <Heart className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Interests</ItemTitle>
                <ItemDescription>Personal topics you care about</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent className="space-y-2">
          {interests.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <Heart className="h-4 w-4" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No interests yet</EmptyTitle>
                <EmptyDescription>Add topics to personalize your recommendations.</EmptyDescription>
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
  )
}
