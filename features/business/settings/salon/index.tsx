import { getSalonBusinessInfo } from './api/queries'
import { SalonInfoForm } from './components/salon-info-form'
import { Section, Stack } from '@/components/layout'

export async function SalonBusinessInfo() {
  const salon = await getSalonBusinessInfo()

  return (
    <Section size="lg">
      <Stack gap="xl">
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
