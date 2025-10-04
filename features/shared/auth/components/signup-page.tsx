import { SignupForm } from './signup-form'
import { Scissors } from 'lucide-react'
import Link from 'next/link'

export function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Scissors className="size-5" />
            </div>
            <span className="text-xl font-semibold">Enorae</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <Scissors className="w-24 h-24 mx-auto text-primary/20" />
            <h2 className="text-3xl font-bold text-muted-foreground">Welcome to Enorae</h2>
            <p className="text-lg text-muted-foreground/80">Your premier salon booking platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}
