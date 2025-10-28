import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, LayoutDashboard, ArrowLeft } from 'lucide-react'

export default function BusinessNotFound() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-full bg-destructive/10 p-6">
          <FileQuestion className="size-16 text-destructive" />
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Page Not Found</h1>
          <p className="mx-auto max-w-md text-xl text-muted-foreground">
            The business page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/business/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <LayoutDashboard className="mr-2 size-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
