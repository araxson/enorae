import { LoginPage } from '@/features/shared/auth'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Login',
  description: 'Login to your Enorae account to manage appointments and bookings.',
  noIndex: true,
})

export default function Page() {
  return <LoginPage />
}
