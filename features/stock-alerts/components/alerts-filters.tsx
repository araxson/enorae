'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Flex } from '@/components/layout'

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
          <Flex gap="xs" align="center">
            Unresolved
            {unresolvedCount > 0 && (
              <Badge variant="destructive">
                {unresolvedCount}
              </Badge>
            )}
          </Flex>
        </TabsTrigger>
        <TabsTrigger value="critical">
          <Flex gap="xs" align="center">
            Critical
            {criticalCount > 0 && (
              <Badge variant="destructive">
                {criticalCount}
              </Badge>
            )}
          </Flex>
        </TabsTrigger>
        <TabsTrigger value="warning">
          <Flex gap="xs" align="center">
            Warning
            {warningCount > 0 && (
              <Badge variant="default">
                {warningCount}
              </Badge>
            )}
          </Flex>
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
