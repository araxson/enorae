'use client'

import { Bell, Settings, User, LogOut, CreditCard, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserNavProps {
  showNotifications?: boolean
  portal?: 'customer' | 'business' | 'staff' | 'admin'
}

export function UserNav({ showNotifications = true, portal = 'customer' }: UserNavProps) {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)

      // Get avatar from user metadata or profile
      if (user) {
        const metaAvatar = user.user_metadata?.avatar_url
        if (metaAvatar) {
          setAvatarUrl(metaAvatar)
        } else {
          // Fetch from profiles_metadata
          supabase
            .from('profiles_metadata')
            .select('avatar_url')
            .eq('profile_id', user.id)
            .single()
            .then(({ data }) => {
              if (data?.avatar_url) {
                setAvatarUrl(data.avatar_url)
              }
            })
        }
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return 'U'
    const name = user.user_metadata?.full_name || user.email || ''
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get portal-specific settings route
  const settingsRoute = `/${portal}/settings/preferences`
  const profileRoute = `/${portal}/profile`

  return (
    <div className="flex items-center gap-2">
      {showNotifications && (
        <Button variant="ghost" size="icon" title="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl || undefined} alt={user?.email || 'User'} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href={profileRoute} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={settingsRoute} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </a>
          </DropdownMenuItem>
          {portal === 'customer' && (
            <DropdownMenuItem asChild>
              <a href="/customer/appointments" className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                Appointments
              </a>
            </DropdownMenuItem>
          )}
          {(portal === 'admin' || portal === 'business') && (
            <DropdownMenuItem asChild>
              <a href={`/${portal}/security`} className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
