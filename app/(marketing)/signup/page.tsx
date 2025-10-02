import { SignupForm } from '@/features/auth'
import { Center } from '@/components/layout'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Sign Up',
  description: 'Create your Enorae account to start booking salon appointments.',
  noIndex: true,
})

export default function SignupPage() {
  return (
    <Center className="min-h-screen">
      <SignupForm />
    </Center>
  )
}
