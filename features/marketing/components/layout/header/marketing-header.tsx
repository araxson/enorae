import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sparkles } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { verifySession } from '@/lib/auth/session'
import { MarketingCommandMenu } from '@/features/marketing/components/common'
import { MobileNav } from './mobile-nav'
import { MarketingUserNav } from './marketing-user-nav'

const navigationItems = [
  { href: '/explore', label: 'Explore' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export async function MarketingHeader() {
  const session = await verifySession()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Sparkles className="size-6" aria-hidden="true" />
            <span className="font-bold text-primary">
              Enorae
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link href={item.href} className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <MarketingCommandMenu />
            {session ? (
              <MarketingUserNav user={session.user} role={session.role} />
            ) : (
              <ButtonGroup aria-label="Marketing auth actions">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </ButtonGroup>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNav
            navigationItems={navigationItems}
            user={session?.user}
            role={session?.role}
          />
        </div>
      </div>
      <Separator />
    </header>
  )
}
