import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/components/common'
import { ctaData } from './cta.data'

export function CTA() {
  return (
    <MarketingSection
      className="bg-background"
      containerClassName="max-w-3xl"
      groupClassName="gap-6 text-center"
    >
      <Item variant="muted">
        <ItemContent>
          <div className="flex flex-col items-center gap-2 text-center">
            <ItemTitle>{ctaData.title}</ItemTitle>
            <ItemDescription>{ctaData.description}</ItemDescription>
          </div>
        </ItemContent>
      </Item>
      <ButtonGroup aria-label="How Enorae works call to action buttons">
        {ctaData.buttons.map((button) => (
          <Button key={button.text} asChild variant={button.variant} size="lg">
            <Link href={button.href}>{button.text}</Link>
          </Button>
        ))}
      </ButtonGroup>
    </MarketingSection>
  )
}
