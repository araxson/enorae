'use client'

import { Dispatch, SetStateAction } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, X } from 'lucide-react'
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
          <CardTitle>Interests</CardTitle>
          <CardDescription>Personal topics you care about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {interests.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Heart className="size-4" aria-hidden="true" />
                </EmptyMedia>
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
                  <ItemActions>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInterest(interest)}
                      aria-label={`Remove ${interest}`}
                    >
                      <X className="size-3" aria-hidden="true" />
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
          <Heart className="size-4" aria-hidden="true" />
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
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="outline"
            onClick={addInterest}
            aria-label="Add interest"
          >
            Add
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
