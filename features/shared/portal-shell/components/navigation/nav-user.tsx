'use client'

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  User,
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/sonner'
import { createClient } from '@/lib/supabase/client'

function getInitials(name: string, email: string): string {
  const displayName = name || email || ''
  return displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function NavUser({
  user,
  portal,
}: {
  user: {
    name: string
    email: string
    avatar: string | null
    role?: string
  }
  portal: 'customer' | 'business' | 'staff' | 'admin'
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) {
      return
    }

    setIsSigningOut(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast.error('Sign out failed', {
          description: error.message || 'Please try again.',
        })
        return
      }

      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Failed to sign out:', error)
      toast.error('Sign out failed', {
        description: 'Please try again.',
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  // Portal-specific menu items
  const portalMenuItems = {
    customer: [
      { icon: User, label: 'Profile', href: '/customer/profile' },
      { icon: Bell, label: 'Notifications', href: '/customer/notifications' },
      { icon: Settings, label: 'Settings', href: '/customer/settings' },
    ],
    business: [
      { icon: User, label: 'Profile', href: '/business/profile' },
      { icon: CreditCard, label: 'Billing', href: '/business/billing' },
      { icon: Settings, label: 'Settings', href: '/business/settings' },
    ],
    staff: [
      { icon: User, label: 'Profile', href: '/staff/profile' },
      { icon: Bell, label: 'Notifications', href: '/staff/notifications' },
      { icon: Settings, label: 'Settings', href: '/staff/settings' },
    ],
    admin: [
      { icon: User, label: 'Profile', href: '/admin/profile' },
      { icon: BadgeCheck, label: 'Account', href: '/admin/settings/account' },
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ],
  }

  const menuItems = portalMenuItems[portal] || []

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
            >
              <Avatar>
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback>
                  {getInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name || 'User'}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <div className="ml-auto flex items-center">
                <ChevronsUpDown className="size-4" aria-hidden="true" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel>
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar>
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback>
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name || 'User'}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  {user.role && (
                    <span className="truncate text-xs text-muted-foreground capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isSigningOut}
              aria-busy={isSigningOut}
            >
              <LogOut className="size-4" aria-hidden="true" />
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
