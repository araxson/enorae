import { Ban, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RateLimitRule, RateLimitViolation } from '@/features/admin/security-monitoring/types'

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
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" aria-hidden="true" />
          <CardTitle>Rate Limit Monitoring</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <CardDescription>
            Active rules: <strong>{rules.filter((rule) => rule.isActive).length}</strong>
          </CardDescription>
          <CardDescription>
            Current blocks: <strong>{violations.length}</strong>
          </CardDescription>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3>Active Blocks</h3>
            {violations.length === 0 ? (
              <CardDescription>No identifiers are currently blocked.</CardDescription>
            ) : (
              <div className="flex flex-col gap-2">
                {violations.slice(0, 6).map((violation) => (
                  <Card key={`${violation.identifier}-${violation.endpoint}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle>{violation.identifier}</CardTitle>
                        <Badge variant="destructive">
                          <Ban className="h-3 w-3" aria-hidden="true" />
                          {' '}
                          Blocked
                        </Badge>
                      </div>
                      <CardDescription>Endpoint {violation.endpoint}</CardDescription>
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
              </div>
            )}
          </div>

          <div>
            <h3>Rule Configuration</h3>
            {rules.length === 0 ? (
              <CardDescription>No rate limiting rules configured.</CardDescription>
            ) : (
              <div className="flex flex-col gap-2">
                {rules.slice(0, 6).map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{rule.ruleName}</CardTitle>
                        <Badge variant={rule.isActive ? 'outline' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        {rule.maxRequests} requests / {formatWindow(rule.windowSeconds)} ({rule.appliesTo})
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
