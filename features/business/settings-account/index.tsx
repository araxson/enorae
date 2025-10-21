import { getUserProfile } from './api/queries'
import { AccountInfoForm } from './components/account-info-form'
import { PasswordForm } from './components/password-form'
import { BillingSubscriptionForm } from './components/billing-subscription-form'
import { MetadataForm } from '@/features/shared/profile-metadata/components/metadata-form'
import { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'
import { Separator } from '@/components/ui/separator'

export async function AccountSettings() {
  const profile = await getUserProfile()
  const metadata = await getCurrentUserMetadata()

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold">Account Information</h2>
          <div className="flex flex-col gap-6 mt-6">
            <AccountInfoForm profile={profile} />
            <PasswordForm />
            <MetadataForm metadata={metadata} />
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold">Billing & Subscription</h2>
          <div className="mt-6">
            <BillingSubscriptionForm />
          </div>
        </div>
      </div>
    </section>
  )
}
