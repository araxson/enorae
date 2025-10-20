'use client'

import { Plus } from 'lucide-react'
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
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Service Product Usage</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Map products to services for automatic cost tracking
          </p>
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
