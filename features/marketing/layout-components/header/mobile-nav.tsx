'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Item, ItemContent, ItemTitle } from '@/components/ui/item'
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
      <div className="md:hidden">
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-5" aria-hidden="true" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent side="right">
        <div className="w-full sm:w-80">
          <SheetHeader>
            <div className="text-left">
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>Browse Enorae sections and manage your account.</SheetDescription>
            </div>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-4">
            {/* Navigation Links */}
            <div
              className="group/item-group flex flex-col gap-2"
              data-slot="item-group"
              role="list"
            >
              {navigationItems.map((item) => (
                <Item key={item.href} asChild variant="muted">
                  <Link href={item.href} onClick={() => setOpen(false)} className="no-underline">
                    <ItemContent>
                      <ItemTitle>{item.label}</ItemTitle>
                    </ItemContent>
                  </Link>
                </Item>
              ))}
            </div>

            {/* Auth Section */}
            <div className="my-2">
              <Separator />
            </div>
            <div className="flex flex-col gap-2 pt-4">
              {user && role ? (
                <MarketingUserNav user={user} role={role} />
              ) : (
                <div className="flex w-full flex-col gap-2">
                  <ButtonGroup aria-label="Marketing mobile auth actions">
                    <Button variant="outline" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </ButtonGroup>
                </div>
              )}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
