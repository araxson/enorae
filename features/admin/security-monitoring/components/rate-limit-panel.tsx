import { Ban, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { RateLimitRule, RateLimitViolation } from '@/features/admin/security-monitoring/api/types'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

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
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
          <CardTitle>Rate Limit Monitoring</CardTitle>
        </div>
        <CardDescription>Live snapshot of enforcement activity and rule coverage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-md border border-dashed border-muted p-4">
            <p className="text-sm text-muted-foreground">Active rules</p>
            <p className="text-2xl font-semibold">
              {rules.filter((rule) => rule.isActive).length}
            </p>
            <CardDescription>Rules currently enforcing quotas.</CardDescription>
          </section>
          <section className="rounded-md border border-dashed border-muted p-4">
            <p className="text-sm text-muted-foreground">Current blocks</p>
            <p className="text-2xl font-semibold">{violations.length}</p>
            <CardDescription>Identifiers temporarily rate limited.</CardDescription>
          </section>
        </div>

        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold leading-none tracking-tight">Active blocks</h3>
              <p className="text-sm text-muted-foreground">
                Most recent violations ordered by window start.
              </p>
            </div>
            {violations.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No identifiers blocked</EmptyTitle>
                  <EmptyDescription>
                    Rate limit enforcement will display here when thresholds are exceeded.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline" size="sm">
                    Refresh now
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="space-y-2">
                {violations.slice(0, 6).map((violation) => (
                  <Alert key={`${violation.identifier}-${violation.endpoint}`} variant="destructive">
                    <AlertTitle>{violation.identifier}</AlertTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="destructive">
                        <Ban className="size-3" aria-hidden="true" /> Blocked
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
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold leading-none tracking-tight">Rule configuration</h3>
              <p className="text-sm text-muted-foreground">
                Inspect thresholds and scope for each policy.
              </p>
            </div>
            {rules.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No rate limiting rules configured</EmptyTitle>
                  <EmptyDescription>Define request policies to gate traffic and prevent abuse.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline" size="sm">
                    Create rule
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {rules.slice(0, 6).map((rule) => (
                  <AccordionItem key={rule.id} value={rule.id}>
                    <AccordionTrigger className="text-sm font-medium">
                      {rule.ruleName}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {rule.maxRequests} requests every {formatWindow(rule.windowSeconds)} ({rule.appliesTo})
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={rule.isActive ? 'outline' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </section>
        </div>
      </CardContent>
    </Card>
  )
}
