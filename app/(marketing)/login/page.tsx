import { Suspense } from 'react'
import { LoginPage } from '@/features/auth'
import { PageLoading } from '@/features/shared/ui-components'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({ title: 'Login', description: 'Login to your Enorae account to manage appointments and bookings.', noIndex: true })

export default function Page() {
  return (
    <Suspense fallback={<PageLoading />}>
      <LoginPage />
    </Suspense>
  )
}
