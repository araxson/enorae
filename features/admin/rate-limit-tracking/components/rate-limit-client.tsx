'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { RateLimitSnapshot } from '@/features/admin/rate-limit-tracking/types'
import { AlertTriangle, Gauge, ShieldX } from 'lucide-react'
import { RateLimitTable } from './rate-limit-table'

interface RateLimitClientProps {
  snapshot: RateLimitSnapshot
}

export function RateLimitClient({ snapshot }: RateLimitClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredRecords =
    selectedStatus === null
      ? snapshot.records
      : snapshot.records.filter((r) => r.status === selectedStatus)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <Gauge className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Total Tracked</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.totalCount}</CardTitle>
                </ItemContent>
                <ItemContent>
                  <ItemDescription>Active rate limit entries</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <ShieldX className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Currently Blocked</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.blockedCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="destructive">Blocked</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Identifiers at limit</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Warnings</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.warningCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">Warning</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Approaching limit</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Rate Limit Tracking</ItemTitle>
                <ItemDescription>
                  Monitor rate limit status across identifiers and endpoints
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ButtonGroup className="mb-4">
            <Button
              onClick={() => setSelectedStatus(null)}
              size="sm"
              variant={selectedStatus === null ? 'default' : 'secondary'}
            >
              All
            </Button>
            <Button
              onClick={() => setSelectedStatus('blocked')}
              size="sm"
              variant={selectedStatus === 'blocked' ? 'destructive' : 'secondary'}
            >
              Blocked
            </Button>
            <Button
              onClick={() => setSelectedStatus('warning')}
              size="sm"
              variant={selectedStatus === 'warning' ? 'default' : 'secondary'}
            >
              Warnings
            </Button>
          </ButtonGroup>
          <RateLimitTable records={filteredRecords} />
        </CardContent>
      </Card>
    </div>
  )
}
