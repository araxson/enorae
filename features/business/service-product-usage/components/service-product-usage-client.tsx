'use client'

import { Plus } from 'lucide-react'
import { H2, Muted } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { UsageTable } from './usage-table'
import type { ServiceProductUsageWithDetails } from '../api/queries'

type ServiceProductUsageClientProps = {
  initialUsage: ServiceProductUsageWithDetails[]
}

export function ServiceProductUsageClient({ initialUsage }: ServiceProductUsageClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H2>Service Product Usage</H2>
          <Muted className="mt-1">
            Map products to services for automatic cost tracking
          </Muted>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      <UsageTable usage={initialUsage} />
    </div>
  )
}
