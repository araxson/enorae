import Link from 'next/link'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface EmptyStateProps {
  categoryName?: string
}

export function EmptyState({ categoryName }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12">
        <Empty>
          <EmptyMedia variant="icon">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No services found</EmptyTitle>
            <EmptyDescription>
              {categoryName
                ? `No services available in the ${categoryName} category`
                : 'Try browsing different categories to find services.'}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline">
              <Link href="/services-directory">Browse all services</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
