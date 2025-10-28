'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserDropdownProps {
  user: {
    name: string
    email: string
    avatar: string | null
  }
  portal: 'customer' | 'business' | 'staff' | 'admin'
  trigger: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}

function getInitials(name: string, email: string): string {
  const displayName = name || email || ''
  return displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserDropdown({
  user,
  portal,
  trigger,
  align = 'end',
  side = 'bottom',
}: UserDropdownProps) {
  const router = useRouter()

  async function handleSignOut() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
      // Still navigate to login even if sign out fails
      router.push('/login')
    }
  }

  const profileRoute = `/${portal}/profile`
  const settingsRoute = `/${portal}/settings/preferences`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align={align}
        side={side}
        sideOffset={4}
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={profileRoute}>
              <User className="mr-2 size-4" aria-hidden="true" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={settingsRoute}>
              <Settings className="mr-2 size-4" aria-hidden="true" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 size-4" aria-hidden="true" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
