import Link from 'next/link'
import { ArrowLeft, FileQuestion, Home } from 'lucide-react'
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
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-full bg-destructive/10 p-6">
          <FileQuestion className="h-16 w-16 text-destructive" />
        </div>

        <div className="flex max-w-md flex-col gap-6">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>

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
      </div>
    </section>
  )
}
