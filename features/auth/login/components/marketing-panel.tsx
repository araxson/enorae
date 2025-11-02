export function MarketingPanel() {
  return (
    <div className="relative hidden bg-muted md:block">
      <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-2xl font-semibold text-primary">Enorae</span>
          </div>
          <p className="text-muted-foreground text-balance">
            Manage your salon business with real-time insights and streamlined scheduling.
          </p>
        </div>
      </div>
    </div>
  )
}
