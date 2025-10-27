import { Ban, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RateLimitRule, RateLimitViolation } from '@/features/admin/security-monitoring/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'

interface RateLimitPanelProps {
  violations: RateLimitViolation[]
  rules: RateLimitRule[]
}

const formatWindow = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${Math.round(seconds / 3600)}h`
}

export function RateLimitPanel({ violations, rules }: RateLimitPanelProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="items-center gap-2">
            <ItemContent className="flex items-center gap-2">
              <Lock className="h-4 w-4" aria-hidden="true" />
              <CardTitle>Rate Limit Monitoring</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="flex flex-wrap items-center gap-4">
          <Item>
            <ItemContent>
              <ItemDescription>
                Active rules: <strong>{rules.filter((rule) => rule.isActive).length}</strong>
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item>
            <ItemContent>
              <ItemDescription>
                Current blocks: <strong>{violations.length}</strong>
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2">Active Blocks</h3>
            {violations.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No identifiers blocked</EmptyTitle>
                  <EmptyDescription>Rate limit enforcement will display here when thresholds are exceeded.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup className="flex flex-col gap-2">
                {violations.slice(0, 6).map((violation) => (
                  <Card key={`${violation.identifier}-${violation.endpoint}`}>
                    <CardHeader>
                      <ItemGroup>
                        <Item className="items-start justify-between gap-2">
                          <ItemContent>
                            <CardTitle>{violation.identifier}</CardTitle>
                            <CardDescription>Endpoint {violation.endpoint}</CardDescription>
                          </ItemContent>
                          <ItemActions className="flex-none gap-1">
                            <Badge variant="destructive">
                              <Ban className="h-3 w-3" aria-hidden="true" />
                              {' '}
                              Blocked
                            </Badge>
                          </ItemActions>
                        </Item>
                      </ItemGroup>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-1">
                        <CardDescription>
                          Requests: {violation.requestCount} · Window start {new Date(violation.windowStartAt).toLocaleTimeString()}
                        </CardDescription>
                        {violation.blockedUntil ? (
                          <CardDescription>
                            Unblocks at {new Date(violation.blockedUntil).toLocaleTimeString()}
                          </CardDescription>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ItemGroup>
            )}
          </div>

          <div>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2">Rule Configuration</h3>
            {rules.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No rate limiting rules configured</EmptyTitle>
                  <EmptyDescription>Define request policies to gate traffic and prevent abuse.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup className="flex flex-col gap-2">
                {rules.slice(0, 6).map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader>
                      <ItemGroup>
                        <Item className="items-start justify-between gap-2">
                          <ItemContent>
                            <CardTitle>{rule.ruleName}</CardTitle>
                            <CardDescription>Rate limit policy</CardDescription>
                          </ItemContent>
                          <ItemActions className="flex-none">
                            <Badge variant={rule.isActive ? 'outline' : 'secondary'}>
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </ItemActions>
                        </Item>
                      </ItemGroup>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        {rule.maxRequests} requests / {formatWindow(rule.windowSeconds)} ({rule.appliesTo})
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </ItemGroup>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
