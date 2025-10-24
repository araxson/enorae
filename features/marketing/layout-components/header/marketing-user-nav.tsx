'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'
import { UserDropdown } from './user-dropdown'

type RoleType = Database['public']['Enums']['role_type']

interface MarketingUserNavProps {
  user: SupabaseUser
  role: RoleType
}

function getInitials(user: SupabaseUser): string {
  const name = user.user_metadata?.full_name || user.email || ''
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getPortalFromRole(role: RoleType): 'admin' | 'business' | 'staff' | 'customer' {
  const roleToPortal: Record<RoleType, 'admin' | 'business' | 'staff' | 'customer'> = {
    super_admin: 'admin',
    platform_admin: 'admin',
    tenant_owner: 'business',
    salon_owner: 'business',
    salon_manager: 'business',
    senior_staff: 'staff',
    staff: 'staff',
    junior_staff: 'staff',
    vip_customer: 'customer',
    customer: 'customer',
    guest: 'customer',
  }

  return roleToPortal[role] || 'customer'
}

export function MarketingUserNav({ user, role }: MarketingUserNavProps) {
  const portal = getPortalFromRole(role)
  const userData = {
    name: user.user_metadata?.full_name || 'User',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url || null,
  }

  const trigger = (
    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
      <Avatar className="h-9 w-9">
        <AvatarImage src={userData.avatar || undefined} alt={user.email || 'User'} />
        <AvatarFallback>{getInitials(user)}</AvatarFallback>
      </Avatar>
    </Button>
  )

  return <UserDropdown user={userData} portal={portal} trigger={trigger} />
}
