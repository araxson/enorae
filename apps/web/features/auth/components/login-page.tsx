import { LoginForm } from './login-form'

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Enorae</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back to your salon booking platform
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}