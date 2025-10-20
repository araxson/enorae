import { getUserProfile } from './api/queries'
import { AccountInfoForm } from './components/account-info-form'
import { PasswordForm } from './components/password-form'
import { BillingSubscriptionForm } from './components/billing-subscription-form'
import { MetadataForm } from '@/features/shared/profile-metadata/components/metadata-form'
import { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'
import { Section, Stack } from '@/components/layout'
import { Separator } from '@/components/ui/separator'

export async function AccountSettings() {
  const profile = await getUserProfile()
  const metadata = await getCurrentUserMetadata()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Account Information</h2>
          <Stack gap="lg" className="mt-6">
            <AccountInfoForm profile={profile} />
            <PasswordForm />
            <MetadataForm metadata={metadata} />
          </Stack>
        </div>

        <Separator className="my-4" />

        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Billing & Subscription</h2>
          <div className="mt-6">
            <BillingSubscriptionForm />
          </div>
        </div>
      </Stack>
    </Section>
  )
}
