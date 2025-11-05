'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

function getPortalBasePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) {
    return '/'
  }
  return `/${segments[0]}`
}

export function PortalQuickNav() {
  const pathname = usePathname()
  const basePath = getPortalBasePath(pathname)

  const quickLinks = [
    { label: 'Overview', href: basePath },
    { label: 'Notifications', href: `${basePath}/notifications` },
    { label: 'Messages', href: `${basePath}/messages` },
    { label: 'Settings', href: `${basePath}/settings` },
  ]

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {quickLinks.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                asChild
                active={isActive}
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
      <NavigationMenuIndicator className="hidden md:flex" />
    </NavigationMenu>
  )
}
