import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { FileQuestion, Home, Store, ArrowLeft } from 'lucide-react'

export default function CustomerNotFound() {
  return (
    <Section size="lg">
      <Stack gap="xl" className="items-center text-center py-16">
        <div className="rounded-full bg-destructive/10 p-6">
          <FileQuestion className="h-16 w-16 text-destructive" />
        </div>

        <Stack gap="md" className="items-center">
          <H1>Page Not Found</H1>
          <Lead className="max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </Lead>
        </Stack>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/customer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/customer/salons">
              <Store className="mr-2 h-4 w-4" />
              Browse Salons
            </Link>
          </Button>
        </div>
      </Stack>
    </Section>
  )
}
