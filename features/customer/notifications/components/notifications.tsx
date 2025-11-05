import { Notifications as SharedNotifications } from '@/features/shared/notifications'
import { Bell } from 'lucide-react'

export async function Notifications() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Bell className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Stay connected with real-time updates from your salons.
          </p>
        </div>
      </header>
      <SharedNotifications />
    </div>
  )
}
