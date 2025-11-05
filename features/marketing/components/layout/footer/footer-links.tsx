import Link from 'next/link'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
      <FooterColumn title="Product" links={footerLinks.product} />
      <FooterColumn title="Company" links={footerLinks.company} />
      <FooterColumn
        title="Legal"
        links={[...footerLinks.legal, ...footerLinks.resources]}
      />
    </>
  )
}

type FooterColumnProps = {
  title: string
  links: Array<{ href: string; label: string }>
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <div className="flex flex-col gap-6">
          <ItemTitle>{title}</ItemTitle>
          <ItemGroup className="gap-2">
            {links.map((link) => (
              <Item key={link.href} asChild variant="muted">
                <Link href={link.href}>
                  <ItemContent>
                    <ItemDescription>{link.label}</ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </ItemContent>
    </Item>
  )
}
