'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface AlertsFiltersProps {
  unresolvedCount: number
  criticalCount: number
  warningCount: number
  children: React.ReactNode
}

export function AlertsFilters({
  unresolvedCount,
  criticalCount,
  warningCount,
  children,
}: AlertsFiltersProps) {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="all">
          All Alerts
        </TabsTrigger>
        <TabsTrigger value="unresolved">
          <div className="flex gap-2 items-center">
            Unresolved
            {unresolvedCount > 0 && (
              <Badge variant="destructive">
                {unresolvedCount}
              </Badge>
            )}
          </div>
        </TabsTrigger>
        <TabsTrigger value="critical">
          <div className="flex gap-2 items-center">
            Critical
            {criticalCount > 0 && (
              <Badge variant="destructive">
                {criticalCount}
              </Badge>
            )}
          </div>
        </TabsTrigger>
        <TabsTrigger value="warning">
          <div className="flex gap-2 items-center">
            Warning
            {warningCount > 0 && (
              <Badge variant="default">
                {warningCount}
              </Badge>
            )}
          </div>
        </TabsTrigger>
        <TabsTrigger value="resolved">
          Resolved
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  )
}
