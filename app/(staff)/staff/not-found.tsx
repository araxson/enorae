import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { FileQuestion, LayoutDashboard, ArrowLeft } from 'lucide-react'

export default function StaffNotFound() {
  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center text-center py-16">
        <div className="rounded-full bg-destructive/10 p-6">
          <FileQuestion className="h-16 w-16 text-destructive" />
        </div>

        <Stack gap="md" className="items-center">
          <H1>Page Not Found</H1>
          <Lead className="max-w-md">
            The staff page you're looking for doesn't exist or you don't have access to it.
          </Lead>
        </Stack>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/staff">
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
