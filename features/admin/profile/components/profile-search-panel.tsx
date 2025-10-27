'use client'

import { ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2, Search } from 'lucide-react'
import type { ProfileSearchResult } from '@/features/admin/profile/types'
import { ScrollArea } from '@/components/ui/scroll-area'

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
        <CardTitle>User Directory</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search by name, email, or username"
            className="pl-9"
            aria-label="Search profiles"
          />
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        {isSearching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching profiles…
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {results.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No profiles found.</p>
              ) : (
                <ul className="divide-y">
                  {results.map((profile) => {
                    const isActive = selectedId === profile.id
                    return (
                      <li key={profile.id}>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => onSelect(profile.id)}
                          className={cn(
                            'w-full justify-start px-4 py-3 text-left transition hover:bg-muted/60',
                            isActive && 'bg-muted/80',
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-tight">
                                {profile.fullName || profile.email || 'Unknown user'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {profile.email ?? 'No email on file'}
                              </p>
                              {profile.username && (
                                <p className="text-xs text-muted-foreground">@{profile.username}</p>
                              )}
                            </div>
                            <div className="space-y-1 text-right">
                              {profile.primaryRole && (
                                <div className="text-xs">
                                  <Badge variant="outline">
                                    {profile.primaryRole.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                                  </Badge>
                                </div>
                              )}
                              {profile.status && (
                                <p className="text-xs text-muted-foreground">{profile.status}</p>
                              )}
                            </div>
                          </div>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
