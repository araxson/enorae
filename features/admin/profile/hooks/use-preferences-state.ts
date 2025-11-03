'use client'

import { useEffect, useState } from 'react'
import type { ProfileDetail } from '@/features/admin/profile/api/types'
import type { PreferencesFormState } from '../components/profile-preferences-form/types'

/**
 * Hook to manage profile preferences form state
 */
export function usePreferencesState(profile: ProfileDetail | null) {
  const [state, setState] = useState<PreferencesFormState>({
    timezone: '',
    locale: '',
    countryCode: '',
    marketingEmails: false,
    smsAlerts: false,
  })

  useEffect(() => {
    if (!profile) return

    setState({
      timezone: profile['preferences']['timezone'] ?? profile.summary['timezone'] ?? '',
      locale: profile['preferences']['locale'] ?? profile.summary['locale'] ?? '',
      countryCode: profile['preferences'].countryCode ?? profile.summary.countryCode ?? '',
      marketingEmails: Boolean(profile['preferences'].preferences?.['marketingEmails']),
      smsAlerts: Boolean(profile['preferences'].preferences?.['smsAlerts']),
    })
  }, [profile])

  return [state, setState] as const
}
