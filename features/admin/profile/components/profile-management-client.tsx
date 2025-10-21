'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'

import { getProfileDetailAction, searchProfilesAction } from '../api/actions'
import type { ProfileDetail, ProfileSearchResult } from '../api/types'
import { useDebouncedCallback } from '@/lib/performance'
import { ProfileSearchPanel } from './profile-search-panel'
import { ProfileSummaryCard } from './profile-summary-card'
import { ProfileBasicsForm } from './profile-basics-form'
import { ProfileMetadataForm } from './profile-metadata-form'
import { ProfilePreferencesForm } from './profile-preferences-form'
import { ProfileActivityCard } from './profile-activity-card'
import { ProfileActions } from './profile-actions'

interface ProfileManagementClientProps {
  initialProfiles: ProfileSearchResult[]
  initialProfile: ProfileDetail | null
}

export function ProfileManagementClient({
  initialProfiles,
  initialProfile,
}: ProfileManagementClientProps) {
  const [profiles, setProfiles] = useState<ProfileSearchResult[]>(initialProfiles)
  const [selectedProfile, setSelectedProfile] = useState<ProfileDetail | null>(initialProfile)
  const [selectedId, setSelectedId] = useState<string | null>(initialProfile?.summary.id ?? null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [, startTransition] = useTransition()

  const loadProfile = useCallback(async (profileId: string) => {
    setSelectedId(profileId)
    setIsLoadingProfile(true)
    try {
      const detail = await getProfileDetailAction(profileId)
      setSelectedProfile(detail)
    } finally {
      setIsLoadingProfile(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!selectedId) return
    setIsLoadingProfile(true)
    try {
      const detail = await getProfileDetailAction(selectedId)
      setSelectedProfile(detail)
    } finally {
      setIsLoadingProfile(false)
    }
  }, [selectedId])

  const runSearch = useCallback(async (value: string) => {
    setIsSearching(true)
    try {
      const results = await searchProfilesAction(value.trim())
      setProfiles(results)
      return results
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleSearch = useCallback(
    (value: string) => {
      startTransition(async () => {
        const results = await runSearch(value)

        if (results.length === 0) {
          setSelectedId(null)
          setSelectedProfile(null)
          return
        }

        if (!selectedId || !results.some((item) => item.id === selectedId)) {
          await loadProfile(results[0].id)
        }
      })
    },
    [loadProfile, runSearch, selectedId, startTransition],
  )

  const debouncedSearch = useDebouncedCallback((raw: unknown) => {
    if (typeof raw === 'string') {
      handleSearch(raw)
    }
  }, 350)

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value)
      debouncedSearch(value.trim())
    },
    [debouncedSearch],
  )

  const handleSelect = useCallback(
    (profileId: string) => {
      if (!profileId || profileId === selectedId) return
      startTransition(async () => {
        await loadProfile(profileId)
      })
    },
    [loadProfile, selectedId, startTransition],
  )

  const handleAnonymized = useCallback(
    async (profileId: string | null) => {
      const results = await runSearch(searchTerm)
      if (results.length === 0) {
        setSelectedProfile(null)
        setSelectedId(null)
        return
      }

      if (profileId && results.some((item) => item.id === profileId)) {
        await loadProfile(profileId)
        return
      }

      await loadProfile(results[0].id)
    },
    [loadProfile, runSearch, searchTerm],
  )

  useEffect(() => {
    if (!initialProfile && initialProfiles.length > 0) {
      loadProfile(initialProfiles[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-80">
          <ProfileSearchPanel
            isSearching={isSearching}
            onSearchChange={handleSearchChange}
            onSelect={handleSelect}
            results={profiles}
            searchTerm={searchTerm}
            selectedId={selectedId}
          />
        </div>
        <div className="flex flex-col gap-8">
          <ProfileSummaryCard profile={selectedProfile} isLoading={isLoadingProfile} />
          <ProfileActions
            profile={selectedProfile}
            onAnonymized={handleAnonymized}
            isLoading={isLoadingProfile}
          />
          <ProfileBasicsForm profile={selectedProfile} onUpdated={refreshProfile} />
          <ProfileMetadataForm profile={selectedProfile} onUpdated={refreshProfile} />
          <ProfilePreferencesForm profile={selectedProfile} onUpdated={refreshProfile} />
          <ProfileActivityCard profile={selectedProfile} isLoading={isLoadingProfile} />
        </div>
      </div>
    </div>
  )
}
