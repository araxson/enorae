export function SignupFormHeader(): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="text-muted-foreground text-sm text-balance">
        Enter your details below to get started
      </p>
    </div>
  )
}
