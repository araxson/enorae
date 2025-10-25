import Link from 'next/link'
import { ArrowLeft, FileQuestion, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

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
        <Card className="max-w-md">
          <CardHeader className="flex flex-col items-center gap-6">
            <FileQuestion className="h-16 w-16 text-destructive" />
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center gap-4">
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
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
