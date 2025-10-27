import { Users, Fingerprint } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { FailedLoginSummary } from '@/features/admin/security-monitoring/types'

interface FailedLoginsPanelProps {
  summary: FailedLoginSummary
}

const TopList = ({ title, items }: { title: string; items: FailedLoginSummary['byIp'] }) => (
  <div>
    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2">{title}</h3>
    {items.length === 0 ? (
      <CardDescription>No data</CardDescription>
    ) : (
      <ul className="mt-2 flex flex-col gap-1">
        {items.slice(0, 5).map((item) => (
          <li key={item.label} className="flex items-center justify-between">
            <code>{item.label}</code>
            <Badge variant="outline">{item.attempts}</Badge>
          </li>
        ))}
      </ul>
    )}
  </div>
)

export function FailedLoginsPanel({ summary }: FailedLoginsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Fingerprint className="h-4 w-4" aria-hidden="true" />
          <CardTitle>Failed Login Tracking</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <CardDescription>Total Attempts</CardDescription>
            <strong>{summary.total}</strong>
          </div>
          <div className="flex flex-col gap-1">
            <CardDescription>Last 24 hours</CardDescription>
            <strong>{summary.last24h}</strong>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TopList title="Top IP Addresses" items={summary.byIp} />
          <TopList title="Top Accounts" items={summary.byUser} />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Recent Attempts</h3>
          </div>
          {summary.attempts.length === 0 ? (
            <CardDescription>No failed logins recorded.</CardDescription>
          ) : (
            <div className="flex flex-col gap-2">
              {summary.attempts.slice(0, 6).map((attempt) => (
                <Card key={attempt.id}>
                  <CardHeader>
                    <CardTitle>{attempt.ipAddress ?? 'Unknown IP'}</CardTitle>
                    <CardDescription>User: {attempt.userId ?? 'Anonymous'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      {attempt.userAgent ? (
                        <CardDescription>Agent: {attempt.userAgent}</CardDescription>
                      ) : null}
                      <CardDescription>
                        Occurred at {new Date(attempt.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
