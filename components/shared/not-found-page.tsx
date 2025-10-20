import Link from 'next/link'
import { ArrowLeft, FileQuestion, Home } from 'lucide-react'
import { Section, Stack } from '@/components/layout'
import { Button } from '@/components/ui/button'
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
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-md">{description}</p>
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
