'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'
import { MarketingUserNav } from './marketing-user-nav'

type RoleType = Database['public']['Enums']['role_type']

interface MobileNavProps {
  navigationItems: Array<{ href: string; label: string }>
  user?: SupabaseUser | null
  role?: RoleType | null
}

export function MobileNav({ navigationItems, user, role }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80">
        <nav className="mt-8 flex flex-col gap-4">
          {/* Navigation Links */}
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'py-2 text-lg font-medium transition-colors hover:text-primary'
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Auth Section */}
          <Separator className="my-2" />
          <div className="flex flex-col gap-2 pt-4">
            {user && role ? (
              <MarketingUserNav user={user} role={role} />
            ) : (
              <>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
