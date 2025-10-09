import { Users, Fingerprint } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { FailedLoginSummary } from '../api/types'

interface FailedLoginsPanelProps {
  summary: FailedLoginSummary
}

const TopList = ({
  title,
  items,
}: {
  title: string
  items: FailedLoginSummary['byIp']
}) => (
  <div>
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    {items.length === 0 ? (
      <p className="text-xs text-muted-foreground">No data</p>
    ) : (
      <ul className="mt-2 space-y-1">
        {items.slice(0, 5).map((item) => (
          <li key={item.label} className="flex items-center justify-between text-sm">
            <span className="font-mono text-muted-foreground">{item.label}</span>
            <Badge variant="outline" className="text-xs">{item.attempts}</Badge>
          </li>
        ))}
      </ul>
    )}
  </div>
)

export function FailedLoginsPanel({ summary }: FailedLoginsPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Fingerprint className="h-4 w-4 text-muted-foreground" />
          Failed Login Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm font-semibold text-muted-foreground">Total Attempts</div>
            <div className="text-2xl font-bold text-foreground">{summary.total}</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-muted-foreground">Last 24 hours</div>
            <div className="text-2xl font-bold text-foreground">{summary.last24h}</div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TopList title="Top IP Addresses" items={summary.byIp} />
          <TopList title="Top Accounts" items={summary.byUser} />
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Users className="h-4 w-4 text-muted-foreground" />
            Recent Attempts
          </h3>
          {summary.attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No failed logins recorded.</p>
          ) : (
            <ul className="space-y-2">
              {summary.attempts.slice(0, 6).map((attempt) => (
                <li key={attempt.id} className="rounded-md border p-2 text-sm text-muted-foreground">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>IP: {attempt.ipAddress ?? 'Unknown'}</span>
                    <span>User: {attempt.userId ?? 'Anonymous'}</span>
                  </div>
                  {attempt.userAgent && (
                    <div className="mt-1 truncate text-xs">Agent: {attempt.userAgent}</div>
                  )}
                  <div className="mt-1 text-xs">
                    Occurred at {new Date(attempt.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
