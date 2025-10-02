import { LoginForm } from '@/features/auth'
import { Center } from '@/components/layout'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Login',
  description: 'Login to your Enorae account to manage appointments and bookings.',
  noIndex: true,
})

export default function LoginPage() {
  return (
    <Center className="min-h-screen">
      <LoginForm />
    </Center>
  )
}
