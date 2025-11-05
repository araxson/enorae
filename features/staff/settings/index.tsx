import { SettingsFeature } from './components'

export async function StaffSettingsPage() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <SettingsFeature />
    </section>
  )
}
export type * from './api/types'
