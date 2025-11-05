import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Separator } from '@/components/ui/separator'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { MarketingSection, NewsletterForm } from '@/features/marketing/components/common'
import { Sparkles, Mail, MapPin, Phone } from 'lucide-react'

import { FooterBrand } from './footer-brand'
import { FooterLinks } from './footer-links'
import { FooterBottom } from './footer-bottom'

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
          <FooterBrand />
          <FooterLinks />
        </div>

        <Separator />

        <FooterBottom year={currentYear} />
      </MarketingSection>
    </footer>
  )
}
