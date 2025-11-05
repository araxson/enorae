import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'
import { MetadataForm } from '@/features/shared/profile-metadata/components'
import { BillingSubscriptionForm, AccountInfoForm, PasswordForm } from '.'
import type { getUserProfile } from '../api/queries'
import type { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'

type AccountSettingsContentProps = {
  profile: Awaited<ReturnType<typeof getUserProfile>>
  metadata: Awaited<ReturnType<typeof getCurrentUserMetadata>>
}

export function AccountSettingsContent({ profile, metadata }: AccountSettingsContentProps) {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <ItemGroup className="gap-6">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Account Information</ItemTitle>
              <ItemDescription>Manage personal details, security, and profile metadata</ItemDescription>
            </ItemContent>
          </Item>
          <ItemContent className="flex flex-col gap-6">
            <AccountInfoForm profile={profile} />
            <PasswordForm />
            <MetadataForm metadata={metadata} />
          </ItemContent>
        </ItemGroup>

        <Separator className="my-4" />

        <ItemGroup className="gap-6">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Billing & Subscription</ItemTitle>
              <ItemDescription>Update payment methods and plan details</ItemDescription>
            </ItemContent>
          </Item>
          <ItemContent className="mt-2">
            <BillingSubscriptionForm />
          </ItemContent>
        </ItemGroup>
      </div>
    </section>
  )
}
