import Link from 'next/link'
import { ArrowLeft, FileQuestion, Home } from 'lucide-react'
import { Section, Stack } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { H1, Lead } from '@/components/ui/typography'

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
    <Section size="lg">
      <Stack gap="xl" className="items-center text-center py-16">
        <div className="rounded-full bg-destructive/10 p-6">
          <FileQuestion className="h-16 w-16 text-destructive" />
        </div>

        <Stack gap="md" className="items-center">
          <H1>{title}</H1>
          <Lead className="max-w-md">{description}</Lead>
        </Stack>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href={backHref}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
          <Button asChild>
            <Link href={homeHref}>
              <Home className="mr-2 h-4 w-4" />
              {homeLabel}
            </Link>
          </Button>
        </div>
      </Stack>
    </Section>
  )
}
