import { getSalonBusinessInfo } from './api/queries'
import { SalonInfoForm } from './components/salon-info-form'
import { Section, Stack } from '@/components/layout'
import { H1, Muted } from '@/components/ui/typography'

export async function SalonBusinessInfo() {
  const salon = await getSalonBusinessInfo()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Salon Information</H1>
          <Muted>Manage your salon&apos;s business details and legal information</Muted>
        </div>

        <SalonInfoForm
          salonId={salon.id!}
          salonName={salon.name}
          businessName={salon.business_name}
          businessType={salon.business_type}
          establishedAt={salon.established_at}
        />
      </Stack>
    </Section>
  )
}
