import { Suspense } from 'react'
import { AccountSettings } from '@/features/business/settings/account'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { PageLoading } from '@/components/shared'

export const metadata = genMeta({ title: 'Account Settings', description: 'Manage your account information and security settings', noIndex: true })

export default async function AccountSettingsPage() {
  return <Suspense fallback={<PageLoading />}><AccountSettings /></Suspense>
}
