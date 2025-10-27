import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
} from '@/components/ui/item'
import { ctaData } from './cta.data'

export function CTA() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ItemGroup className="gap-6 text-center">
          <Item className="flex-col items-center text-center" variant="muted">
            <ItemHeader>
              <h2 className="scroll-m-20">{ctaData.title}</h2>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>{ctaData.description}</ItemDescription>
            </ItemContent>
          </Item>
          <ButtonGroup className="flex flex-wrap items-center justify-center gap-3">
            {ctaData.buttons.map((button) => (
              <Button key={button.text} asChild variant={button.variant} size="lg" className="px-6">
                <Link href={button.href}>{button.text}</Link>
              </Button>
            ))}
          </ButtonGroup>
        </ItemGroup>
      </div>
    </section>
  )
}
