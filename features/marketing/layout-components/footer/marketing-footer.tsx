import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'
import { Sparkles, Mail, MapPin, Phone } from 'lucide-react'
import { NewsletterForm } from '@/features/marketing/common-components/newsletter-form'

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

export function MarketingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="mx-auto max-w-2xl text-center">
            <NewsletterForm
              title="Stay in the Loop"
              description="Get beauty tips, exclusive offers, and the latest salon updates"
              inline
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-6">
              <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-primary font-bold">
                  Enorae
                </span>
              </Link>
              <p className="text-sm leading-7 text-muted-foreground">
                Your Beauty Appointments, Simplified. The modern platform connecting clients with premier salons.
              </p>
              <ItemGroup className="gap-2">
                <Item variant="muted">
                  <ItemMedia variant="icon">
                    <Mail className="size-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemDescription>support@enorae.com</ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="muted">
                  <ItemMedia variant="icon">
                    <Phone className="size-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemDescription>1-800-ENORAE</ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="muted">
                  <ItemMedia variant="icon">
                    <MapPin className="size-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemDescription>San Francisco, CA</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-semibold">Product</h3>
              <ItemGroup className="gap-2">
                {footerLinks.product.map((link) => (
                  <Item key={link.href} asChild variant="muted">
                    <Link
                      href={link.href}
                      className="no-underline"
                    >
                      <ItemContent>
                        <ItemDescription>{link.label}</ItemDescription>
                      </ItemContent>
                    </Link>
                  </Item>
                ))}
              </ItemGroup>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-semibold">Company</h3>
              <ItemGroup className="gap-2">
                {footerLinks.company.map((link) => (
                  <Item key={link.href} asChild variant="muted">
                    <Link
                      href={link.href}
                      className="no-underline"
                    >
                      <ItemContent>
                        <ItemDescription>{link.label}</ItemDescription>
                      </ItemContent>
                    </Link>
                  </Item>
                ))}
              </ItemGroup>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-semibold">Legal</h3>
              <ItemGroup className="gap-2">
                {footerLinks.legal.map((link) => (
                  <Item key={link.href} asChild variant="muted">
                    <Link
                      href={link.href}
                      className="no-underline"
                    >
                      <ItemContent>
                        <ItemDescription>{link.label}</ItemDescription>
                      </ItemContent>
                    </Link>
                  </Item>
                ))}
              </ItemGroup>
              <ItemGroup className="mt-4 gap-2">
                {footerLinks.resources.map((link) => (
                  <Item key={link.href} asChild variant="muted">
                    <Link
                      href={link.href}
                      className="no-underline"
                    >
                      <ItemContent>
                        <ItemDescription>{link.label}</ItemDescription>
                      </ItemContent>
                    </Link>
                  </Item>
                ))}
              </ItemGroup>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">© {currentYear} Enorae. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <small className="text-sm font-medium leading-none">Twitter</small>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <small className="text-sm font-medium leading-none">Instagram</small>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <small className="text-sm font-medium leading-none">LinkedIn</small>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
