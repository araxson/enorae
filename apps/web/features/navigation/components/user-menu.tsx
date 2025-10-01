import { Button } from '@enorae/ui'
import { Avatar, AvatarFallback } from '@enorae/ui'
import { getCurrentUser, logoutAction } from '@/features/auth'

export async function UserMenu() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" asChild>
          <a href="/login">Login</a>
        </Button>
        <Button asChild>
          <a href="/signup">Sign Up</a>
        </Button>
      </div>
    )
  }

  const initials = user.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user.email?.[0].toUpperCase()

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span className="text-sm">{user.user_metadata?.full_name || user.email}</span>
      <form action={logoutAction}>
        <Button variant="ghost" size="sm" type="submit">
          Logout
        </Button>
      </form>
    </div>
  )
}