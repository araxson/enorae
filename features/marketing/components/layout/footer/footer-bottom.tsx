import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Item, ItemContent, ItemDescription } from '@/components/ui/item'

const socialLinks = [
  { href: 'https://twitter.com', label: 'Twitter' },
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
] as const

interface FooterBottomProps {
  year: number
}

export function FooterBottom({ year }: FooterBottomProps) {
  return (
    <Item variant="muted">
      <ItemContent>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ItemDescription>© {year} Enorae. All rights reserved.</ItemDescription>
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
  )
}
