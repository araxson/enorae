'use client'

import { ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Loader2, Search } from 'lucide-react'
import type { ProfileSearchResult } from '../api/types'

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

        <div className="max-h-[520px] flex-1 overflow-y-auto rounded-md border bg-muted/10">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No profiles found.</p>
          ) : (
            <ul className="divide-y">
              {results.map((profile) => {
                const isActive = selectedId === profile.id
                return (
                  <li key={profile.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(profile.id)}
                      className={cn(
                        'w-full px-4 py-3 text-left transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
                            <Badge variant="outline" className="text-xs capitalize">
                              {profile.primaryRole.replace(/_/g, ' ')}
                            </Badge>
                          )}
                          {profile.status && (
                            <p className="text-xs text-muted-foreground">{profile.status}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
