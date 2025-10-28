'use client'

import { Badge } from '@/components/ui/badge'
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
import type { RateLimitRulesSnapshot } from '@/features/admin/rate-limit-rules/api/queries'
import { Activity, Shield, Zap } from 'lucide-react'
import { RateLimitRulesTable } from './rate-limit-rules-table'

interface RateLimitRulesClientProps {
  snapshot: RateLimitRulesSnapshot
}

export function RateLimitRulesClient({ snapshot }: RateLimitRulesClientProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Total Rules</ItemTitle>
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
                  <ItemDescription>Rate limit policies</ItemDescription>
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
                  <Activity className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Active</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.activeCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">Active</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Enforced policies</ItemDescription>
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
                  <Zap className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Violations Today</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.violationsTodayCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="destructive">Violations</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Rate limit hits</ItemDescription>
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
                <ItemTitle>Policy Enforcement Overview</ItemTitle>
                <ItemDescription>
                  Manage rate limiting rules and review enforcement status
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <RateLimitRulesTable rules={snapshot.rules} />
        </CardContent>
      </Card>
    </div>
  )
}
