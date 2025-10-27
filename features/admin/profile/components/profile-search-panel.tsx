'use client'

import { ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import type { ProfileSearchResult } from '@/features/admin/profile/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface ProfileSearchPanelProps {
  results: ProfileSearchResult[]
  searchTerm: string
  selectedId: string | null
  isSearching: boolean
  onSearchChange: (value: string) => void
  onSelect: (profileId: string) => void
}

export function ProfileSearchPanel({
  results,
  searchTerm,
  selectedId,
  isSearching,
  onSearchChange,
  onSelect,
}: ProfileSearchPanelProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <ItemGroup className="gap-4">
          <Item variant="muted">
            <ItemContent>
              <CardTitle>User Directory</CardTitle>
            </ItemContent>
          </Item>
          <Item variant="muted" className="flex-1">
            <ItemContent>
              <InputGroup aria-label="Search profiles">
                <InputGroupAddon>
                  <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  value={searchTerm}
                  onChange={handleChange}
                  placeholder="Search by name, email, or username"
                />
                <InputGroupAddon align="inline-end">
                  {searchTerm ? (
                    <InputGroupButton
                      onClick={() => onSearchChange('')}
                      aria-label="Clear search"
                      size="icon-sm"
                      variant="ghost"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </InputGroupButton>
                  ) : null}
                </InputGroupAddon>
              </InputGroup>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        {isSearching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            Searching profiles…
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {results.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No profiles found</EmptyTitle>
                    <EmptyDescription>Try adjusting the search query or filters to locate a user.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ItemGroup className="divide-y">
                  {results.map((profile) => {
                    const isActive = selectedId === profile.id
                    return (
                      <Item
                        key={profile.id}
                        asChild
                        variant={isActive ? 'muted' : 'default'}
                        size="sm"
                        className="px-0"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => onSelect(profile.id)}
                          className="w-full justify-start px-4 py-3 text-left"
                        >
                          <ItemContent className="items-start gap-1">
                            <ItemTitle>
                              {profile.fullName || profile.email || 'Unknown user'}
                            </ItemTitle>
                            <ItemDescription>
                              {profile.email ?? 'No email on file'}
                            </ItemDescription>
                            {profile.username ? (
                              <ItemDescription>@{profile.username}</ItemDescription>
                            ) : null}
                          </ItemContent>
                          <ItemActions className="flex-col items-end gap-1 text-right text-xs">
                            {profile.primaryRole ? (
                              <Badge variant="outline">
                                {profile.primaryRole
                                  .replace(/_/g, ' ')
                                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                              </Badge>
                            ) : null}
                            {profile.status ? (
                              <span className="text-muted-foreground">{profile.status}</span>
                            ) : null}
                          </ItemActions>
                        </Button>
                      </Item>
                    )
                  })}
                </ItemGroup>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
