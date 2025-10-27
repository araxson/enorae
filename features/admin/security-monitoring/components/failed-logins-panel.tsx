import { Users, Fingerprint } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { FailedLoginSummary } from '@/features/admin/security-monitoring/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface FailedLoginsPanelProps {
  summary: FailedLoginSummary
}

const TopList = ({ title, items }: { title: string; items: FailedLoginSummary['byIp'] }) => (
  <div>
    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2">{title}</h3>
    {items.length === 0 ? (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No data available</EmptyTitle>
          <EmptyDescription>{title} will populate once failed attempts are recorded.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    ) : (
      <ItemGroup className="mt-2 space-y-1">
        {items.slice(0, 5).map((item) => (
          <Item key={item.label} variant="outline" size="sm" className="flex-row items-center justify-between">
            <ItemContent>
              <code className="text-sm">{item.label}</code>
            </ItemContent>
            <ItemActions className="flex-none">
              <Badge variant="outline">{item.attempts}</Badge>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    )}
  </div>
)

export function FailedLoginsPanel({ summary }: FailedLoginsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted" className="items-center gap-2">
            <ItemContent className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4" aria-hidden="true" />
              <CardTitle>Failed Login Tracking</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="flex-wrap gap-4">
          <Item variant="muted" className="flex-col gap-1">
            <ItemContent>
              <CardDescription>Total Attempts</CardDescription>
              <strong>{summary.total}</strong>
            </ItemContent>
          </Item>
          <Item variant="muted" className="flex-col gap-1">
            <ItemContent>
              <CardDescription>Last 24 hours</CardDescription>
              <strong>{summary.last24h}</strong>
            </ItemContent>
          </Item>
        </ItemGroup>

        <div className="grid gap-4 sm:grid-cols-2">
          <TopList title="Top IP Addresses" items={summary.byIp} />
          <TopList title="Top Accounts" items={summary.byUser} />
        </div>

        <div>
          <ItemGroup className="mb-2 items-center gap-2">
            <Item variant="muted" className="items-center gap-2">
              <ItemContent className="flex items-center gap-2">
                <Users className="h-4 w-4" aria-hidden="true" />
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Recent Attempts</h3>
              </ItemContent>
            </Item>
          </ItemGroup>
          {summary.attempts.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No failed logins recorded</EmptyTitle>
                <EmptyDescription>Authentication failures will surface here for quick investigation.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="space-y-2">
              {summary.attempts.slice(0, 6).map((attempt) => (
                <Item key={attempt.id} variant="outline" className="flex-col items-start gap-2">
                  <ItemContent className="w-full gap-1">
                    <ItemTitle>{attempt.ipAddress ?? 'Unknown IP'}</ItemTitle>
                    <ItemDescription>User: {attempt.userId ?? 'Anonymous'}</ItemDescription>
                  </ItemContent>
                  <ItemDescription className="flex flex-col gap-1">
                    {attempt.userAgent ? (
                      <span>Agent: {attempt.userAgent}</span>
                    ) : null}
                    <span>
                      Occurred at {new Date(attempt.createdAt).toLocaleString()}
                    </span>
                  </ItemDescription>
                </Item>
              ))}
            </ItemGroup>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
