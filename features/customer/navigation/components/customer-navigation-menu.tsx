'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const NAV_ITEMS: Array<{ label: string; href: string; match: (pathname: string) => boolean }> = [
  { label: 'Overview', href: '/customer', match: (pathname) => pathname === '/customer' },
  { label: 'Appointments', href: '/customer/appointments', match: (pathname) => pathname.startsWith('/customer/appointments') },
  { label: 'Favorites', href: '/customer/favorites', match: (pathname) => pathname.startsWith('/customer/favorites') },
  { label: 'Analytics', href: '/customer/analytics', match: (pathname) => pathname.startsWith('/customer/analytics') },
  { label: 'Transactions', href: '/customer/transactions', match: (pathname) => pathname.startsWith('/customer/transactions') },
  { label: 'Profile', href: '/customer/profile', match: (pathname) => pathname.startsWith('/customer/profile') },
  { label: 'Notifications', href: '/customer/notifications', match: (pathname) => pathname.startsWith('/customer/notifications') },
]

export function CustomerNavigationMenu() {
  const pathname = usePathname()

  return (
    <NavigationMenu className="justify-start">
      <NavigationMenuList className="flex-wrap gap-2">
        {NAV_ITEMS.map(({ label, href, match }) => {
          const isActive = match(pathname)

          return (
            <NavigationMenuItem key={href}>
              <NavigationMenuLink asChild>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'min-w-[8rem] justify-start',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                >
                  {label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
