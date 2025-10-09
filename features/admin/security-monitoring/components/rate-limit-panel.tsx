import { Ban, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RateLimitRule, RateLimitViolation } from '../api/types'

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
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Lock className="h-4 w-4 text-muted-foreground" />
          Rate Limit Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Active rules: <strong className="text-foreground">{rules.filter((rule) => rule.isActive).length}</strong>
          </span>
          <span>
            Current blocks: <strong className="text-foreground">{violations.length}</strong>
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Active Blocks</h3>
            {violations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No identifiers are currently blocked.</p>
            ) : (
              <ul className="space-y-2">
                {violations.slice(0, 6).map((violation) => (
                  <li key={`${violation.identifier}-${violation.endpoint}`} className="rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground">{violation.identifier}</span>
                      <Badge variant="destructive" className="gap-1 text-xs">
                        <Ban className="h-3 w-3" />
                        Blocked
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Endpoint {violation.endpoint}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Requests: {violation.requestCount} · Window start {new Date(violation.windowStartAt).toLocaleTimeString()}
                    </div>
                    {violation.blockedUntil && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Unblocks at {new Date(violation.blockedUntil).toLocaleTimeString()}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Rule Configuration</h3>
            {rules.length === 0 ? (
              <p className="text-sm text-muted-foreground">No rate limiting rules configured.</p>
            ) : (
              <ul className="space-y-2">
                {rules.slice(0, 6).map((rule) => (
                  <li key={rule.id} className="rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{rule.ruleName}</span>
                      <Badge variant={rule.isActive ? 'outline' : 'secondary'} className="text-xs">
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {rule.maxRequests} requests / {formatWindow(rule.windowSeconds)} ({rule.appliesTo})
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
