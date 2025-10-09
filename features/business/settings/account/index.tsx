import { getUserProfile } from './api/queries'
import { AccountInfoForm } from './components/account-info-form'
import { PasswordForm } from './components/password-form'
import { MetadataForm } from '@/features/shared/profile-metadata'
import { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'
import { Section, Stack } from '@/components/layout'

export async function AccountSettings() {
  const profile = await getUserProfile()
  const metadata = await getCurrentUserMetadata()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="lg">
          <AccountInfoForm profile={profile} />
          <PasswordForm />
          <MetadataForm metadata={metadata} />
        </Stack>
      </Stack>
    </Section>
  )
}
