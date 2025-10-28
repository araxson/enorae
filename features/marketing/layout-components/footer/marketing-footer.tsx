import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
        <Item className="flex-col items-center text-center" variant="muted">
          <ItemContent className="w-full max-w-2xl">
            <NewsletterForm
              title="Stay in the Loop"
              description="Get beauty tips, exclusive offers, and the latest salon updates"
              inline
            />
          </ItemContent>
        </Item>

        <Separator />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Item className="flex-col gap-6" variant="outline">
            <ItemHeader className="items-start gap-2">
              <ItemMedia variant="icon">
                <Sparkles className="size-6" aria-hidden="true" />
              </ItemMedia>
              <ItemTitle>Enorae</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>
                Your Beauty Appointments, Simplified. The modern platform connecting clients with premier salons.
              </ItemDescription>
            </ItemContent>
            <ItemGroup className="gap-2">
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
            </ItemGroup>
          </Item>

          <Item className="flex-col gap-6" variant="outline">
            <ItemHeader>
              <ItemTitle>Product</ItemTitle>
            </ItemHeader>
            <ItemGroup className="gap-2">
              {footerLinks.product.map((link) => (
                <Item key={link.href} asChild variant="muted">
                  <Link href={link.href}>
                    <ItemContent>
                      <ItemDescription>{link.label}</ItemDescription>
                    </ItemContent>
                  </Link>
                </Item>
              ))}
            </ItemGroup>
          </Item>

          <Item className="flex-col gap-6" variant="outline">
            <ItemHeader>
              <ItemTitle>Company</ItemTitle>
            </ItemHeader>
            <ItemGroup className="gap-2">
              {footerLinks.company.map((link) => (
                <Item key={link.href} asChild variant="muted">
                  <Link href={link.href}>
                    <ItemContent>
                      <ItemDescription>{link.label}</ItemDescription>
                    </ItemContent>
                  </Link>
                </Item>
              ))}
            </ItemGroup>
          </Item>

          <Item className="flex-col gap-6" variant="outline">
            <ItemHeader>
              <ItemTitle>Legal</ItemTitle>
            </ItemHeader>
            <ItemGroup className="gap-2">
              {footerLinks.legal.map((link) => (
                <Item key={link.href} asChild variant="muted">
                  <Link href={link.href}>
                    <ItemContent>
                      <ItemDescription>{link.label}</ItemDescription>
                    </ItemContent>
                  </Link>
                </Item>
              ))}
            </ItemGroup>
            <ItemGroup className="gap-2">
              {footerLinks.resources.map((link) => (
                <Item key={link.href} asChild variant="muted">
                  <Link href={link.href}>
                    <ItemContent>
                      <ItemDescription>{link.label}</ItemDescription>
                    </ItemContent>
                  </Link>
                </Item>
              ))}
            </ItemGroup>
          </Item>
        </div>

        <Separator />

        <Item
          className="flex flex-wrap items-center justify-between gap-4"
          variant="muted"
        >
          <ItemContent>
            <ItemDescription>© {currentYear} Enorae. All rights reserved.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ButtonGroup
              aria-label="Follow Enorae on social media"
              className="flex flex-wrap justify-end gap-3"
            >
              {socialLinks.map((link) => (
                <Button key={link.href} asChild variant="ghost" size="sm">
                  <Link href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </Link>
                </Button>
              ))}
            </ButtonGroup>
          </ItemActions>
        </Item>
      </MarketingSection>
    </footer>
  )
}
