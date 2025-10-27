'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
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
          <Item variant="muted">
            <ItemContent>
              <ItemDescription>Browse Enorae sections and manage your account.</ItemDescription>
            </ItemContent>
          </Item>
          {/* Navigation Links */}
          <ItemGroup className="gap-2">
            {navigationItems.map((item) => (
              <Item key={item.href} asChild variant="muted">
                <Link href={item.href} onClick={() => setOpen(false)} className="no-underline">
                  <ItemContent>
                    <ItemTitle>
                      <span className="text-lg font-medium">{item.label}</span>
                    </ItemTitle>
                  </ItemContent>
                </Link>
              </Item>
            ))}
          </ItemGroup>

          {/* Auth Section */}
          <Separator className="my-2" />
          <div className="flex flex-col gap-2 pt-4">
            {user && role ? (
              <MarketingUserNav user={user} role={role} />
            ) : (
              <ButtonGroup className="flex w-full flex-col gap-2">
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
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
