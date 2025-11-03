import Link from 'next/link'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'

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

export function FooterLinks() {
  return (
    <>
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
    </>
  )
}
