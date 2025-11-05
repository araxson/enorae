import { getSalonBusinessInfo } from './api/queries'
import { SalonInfoForm } from './components'

export async function SalonBusinessInfo() {
  const salon = await getSalonBusinessInfo()

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <SalonInfoForm
          salonId={salon.id ?? ''}
          salonName={salon.name ?? ''}
          businessName={null}
          businessType={null}
          establishedAt={null}
        />
      </div>
    </section>
  )
}
export type * from './api/types'
