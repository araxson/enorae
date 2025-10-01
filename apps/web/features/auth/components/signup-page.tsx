import { SignupForm } from './signup-form'

export function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Enorae</h1>
          <p className="text-muted-foreground mt-2">
            Join the best salon booking platform
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}