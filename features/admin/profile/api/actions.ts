'use server'

import { getProfileDetail, searchProfiles } from './queries'

export async function searchProfilesAction(term: string, limit = 20) {
  return searchProfiles(term, limit)
}

export async function getProfileDetailAction(profileId: string) {
  return getProfileDetail(profileId)
}
