'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { H2, Muted } from '@/components/ui/typography'
import { PreferencesList } from './components/preferences-list'
import type { Database } from '@/lib/types/database.types'

type ProfilePreference = Database['identity']['Tables']['profiles_preferences']['Row']

type UserPreferencesProps = {
  initialPreferences: ProfilePreference[]
}

export function UserPreferences({ initialPreferences }: UserPreferencesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H2>User Preferences</H2>
          <Muted className="mt-1">
            Manage your personal preferences and settings
          </Muted>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Preference
        </Button>
      </div>

      <PreferencesList preferences={initialPreferences} />
    </div>
  )
}
