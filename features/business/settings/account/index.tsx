import { getUserProfile } from './api/queries'
import { AccountInfoForm } from './components/account-info-form'
import { PasswordForm } from './components/password-form'
import { BillingSubscriptionForm } from './components/billing-subscription-form'
import { MetadataForm } from '@/features/shared/profile-metadata'
import { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'
import { Section, Stack } from '@/components/layout'
import { H2 } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

export async function AccountSettings() {
  const profile = await getUserProfile()
  const metadata = await getCurrentUserMetadata()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H2>Account Information</H2>
          <Stack gap="lg" className="mt-6">
            <AccountInfoForm profile={profile} />
            <PasswordForm />
            <MetadataForm metadata={metadata} />
          </Stack>
        </div>

        <Separator className="my-4" />

        <div>
          <H2>Billing & Subscription</H2>
          <div className="mt-6">
            <BillingSubscriptionForm />
          </div>
        </div>
      </Stack>
    </Section>
  )
}
