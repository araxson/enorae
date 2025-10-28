import { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'
import { getUserProfile } from './api/queries'
import { AccountSettingsContent } from './components/account-settings-content'

export async function AccountSettings() {
  const profile = await getUserProfile()
  const metadata = await getCurrentUserMetadata()

  return <AccountSettingsContent profile={profile} metadata={metadata} />
}
