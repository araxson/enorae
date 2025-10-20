import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section, Stack } from '@/components/layout'
import { FileQuestion, LayoutDashboard, ArrowLeft } from 'lucide-react'

export default function BusinessNotFound() {
  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center text-center py-16">
        <div className="rounded-full bg-destructive/10 p-6">
          <FileQuestion className="h-16 w-16 text-destructive" />
        </div>

        <Stack gap="md" className="items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Page Not Found</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            The business page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </Stack>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/business/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </Stack>
    </Section>
  )
}
