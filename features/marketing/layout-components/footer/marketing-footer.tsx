import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Separator } from '@/components/ui/separator'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { MarketingSection, NewsletterForm } from '@/features/marketing/common-components'
import { Sparkles, Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = {
  product: [
    { href: '/explore', label: 'Explore Salons' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
  resources: [
    { href: '/signup', label: 'Get Started' },
    { href: '/login', label: 'Sign In' },
  ],
}

const socialLinks = [
  { href: 'https://twitter.com', label: 'Twitter' },
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
] as const

export function MarketingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40">
      <MarketingSection
        spacing="compact"
        containerClassName="py-12"
        groupClassName="gap-10"
      >
        <div className="flex flex-col items-center text-center">
          <Item variant="muted">
            <ItemContent>
              <div className="w-full max-w-2xl">
                <NewsletterForm
                  title="Stay in the Loop"
                  description="Get beauty tips, exclusive offers, and the latest salon updates"
                  inline
                />
              </div>
            </ItemContent>
          </Item>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <Item variant="outline">
              <ItemMedia variant="icon">
                <Sparkles className="size-6" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Enorae</ItemTitle>
                <ItemDescription>
                  Your Beauty Appointments, Simplified. The modern platform connecting clients with premier salons.
                </ItemDescription>
              </ItemContent>
            </Item>
            <div
              className="group/item-group flex flex-col gap-2"
              data-slot="item-group"
              role="list"
            >
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <Mail className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>support@enorae.com</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <Phone className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>1-800-ENORAE</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <MapPin className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>San Francisco, CA</ItemDescription>
                </ItemContent>
              </Item>
            </div>
          </div>

          <Item variant="outline">
            <ItemContent>
              <div className="flex flex-col gap-6">
                <div>
                  <ItemTitle>Product</ItemTitle>
                </div>
                <div
                  className="group/item-group flex flex-col gap-2"
                  data-slot="item-group"
                  role="list"
                >
                  {footerLinks.product.map((link) => (
                    <Item key={link.href} asChild variant="muted">
                      <Link href={link.href}>
                        <ItemContent>
                          <ItemDescription>{link.label}</ItemDescription>
                        </ItemContent>
                      </Link>
                    </Item>
                  ))}
                </div>
              </div>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <div className="flex flex-col gap-6">
                <div>
                  <ItemTitle>Company</ItemTitle>
                </div>
                <div
                  className="group/item-group flex flex-col gap-2"
                  data-slot="item-group"
                  role="list"
                >
                  {footerLinks.company.map((link) => (
                    <Item key={link.href} asChild variant="muted">
                      <Link href={link.href}>
                        <ItemContent>
                          <ItemDescription>{link.label}</ItemDescription>
                        </ItemContent>
                      </Link>
                    </Item>
                  ))}
                </div>
              </div>
            </ItemContent>
          </Item>

          <Item variant="outline">
            <ItemContent>
              <div className="flex flex-col gap-6">
                <div>
                  <ItemTitle>Legal</ItemTitle>
                </div>
                <div
                  className="group/item-group flex flex-col gap-2"
                  data-slot="item-group"
                  role="list"
                >
                  {footerLinks.legal.map((link) => (
                    <Item key={link.href} asChild variant="muted">
                      <Link href={link.href}>
                        <ItemContent>
                          <ItemDescription>{link.label}</ItemDescription>
                        </ItemContent>
                      </Link>
                    </Item>
                  ))}
                </div>
                <div
                  className="group/item-group flex flex-col gap-2"
                  data-slot="item-group"
                  role="list"
                >
                  {footerLinks.resources.map((link) => (
                    <Item key={link.href} asChild variant="muted">
                      <Link href={link.href}>
                        <ItemContent>
                          <ItemDescription>{link.label}</ItemDescription>
                        </ItemContent>
                      </Link>
                    </Item>
                  ))}
                </div>
              </div>
            </ItemContent>
          </Item>
        </div>

        <Separator />

        <Item variant="muted">
          <ItemContent>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ItemDescription>© {currentYear} Enorae. All rights reserved.</ItemDescription>
              <ButtonGroup aria-label="Follow Enorae on social media">
                {socialLinks.map((link) => (
                  <Button key={link.href} asChild variant="ghost" size="sm">
                    <Link href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </Link>
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </ItemContent>
        </Item>
      </MarketingSection>
    </footer>
  )
}
