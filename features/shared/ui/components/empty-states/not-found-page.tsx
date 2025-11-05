import Link from 'next/link'
import { ArrowLeft, FileQuestion, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type NotFoundPageProps = {
  title: string
  description: string
  backHref: string
  backLabel: string
  homeHref?: string
  homeLabel?: string
}

export function NotFoundPage({
  title,
  description,
  backHref,
  backLabel,
  homeHref = '/',
  homeLabel = 'Go Home',
}: NotFoundPageProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Item variant="outline">
            <ItemHeader>
              <div className="flex flex-col items-center gap-6">
                <FileQuestion className="size-16 text-destructive" />
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>{description}</ItemDescription>
              </div>
            </ItemHeader>

            <ItemContent>
              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <Link href={backHref}>
                    <ArrowLeft className="size-4" />
                    {backLabel}
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={homeHref}>
                    <Home className="size-4" />
                    {homeLabel}
                  </Link>
                </Button>
              </div>
            </ItemContent>
          </Item>
        </div>
      </div>
    </section>
  )
}
