import { Ban, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { RateLimitRule, RateLimitViolation } from '@/features/admin/security-monitoring/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'

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
                  <Alert key={`${violation.identifier}-${violation.endpoint}`} variant="destructive">
                    <AlertTitle>{violation.identifier}</AlertTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="destructive">
                        <Ban className="h-3 w-3" aria-hidden="true" />
                        {' '}
                        Blocked
                      </Badge>
                      <AlertDescription>Endpoint {violation.endpoint}</AlertDescription>
                    </div>
                    <AlertDescription>
                      Requests: {violation.requestCount} · Window start{' '}
                      {new Date(violation.windowStartAt).toLocaleTimeString()}
                    </AlertDescription>
                    {violation.blockedUntil ? (
                      <AlertDescription>
                        Unblocks at {new Date(violation.blockedUntil).toLocaleTimeString()}
                      </AlertDescription>
                    ) : null}
                  </Alert>
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
                  <Alert key={rule.id}>
                    <AlertTitle>{rule.ruleName}</AlertTitle>
                    <AlertDescription>Rate limit policy</AlertDescription>
                    <AlertDescription>
                      {rule.maxRequests} requests / {formatWindow(rule.windowSeconds)} ({rule.appliesTo})
                    </AlertDescription>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={rule.isActive ? 'outline' : 'secondary'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </Alert>
                ))}
              </ItemGroup>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
