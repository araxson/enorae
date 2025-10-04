import { LoginForm } from './login-form'
import { Scissors } from 'lucide-react'
import Link from 'next/link'

export function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Scissors className="size-5" />
          </div>
          <span className="text-xl font-semibold">Enorae</span>
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
