'use client'

import { MessageSquare, Users, Activity, TrendingUp, Building2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack } from '@/components/layout'
import { Muted } from '@/components/ui/typography'
import type {
  MessageSummary,
  ThreadActivity,
  UserActivity,
  SalonMessageStats,
} from '../api/queries'
import { formatDistanceToNow } from 'date-fns'

type Props = {
  summary: MessageSummary
  activeThreads: ThreadActivity[]
  activeUsers: UserActivity[]
  salonStats: SalonMessageStats[]
}

export function MessagesOverview({ summary, activeThreads, activeUsers, salonStats }: Props) {
  const formatDate = (date: string | null) => {
    if (!date) return 'N/A'
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return 'N/A'
    }
  }

  return (
    <Stack gap="xl">
      {/* Summary Cards */}
      <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalThreads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.activeThreadsToday} active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.avgMessagesPerThread} avg per thread
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.mostActiveUsers}</div>
            <p className="text-xs text-muted-foreground">Platform-wide</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeThreadsToday}</div>
            <p className="text-xs text-muted-foreground">Threads updated</p>
          </CardContent>
        </Card>
      </Grid>

      {/* Active Threads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Thread Activity</CardTitle>
          <CardDescription>Most recently active conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon</TableHead>
                <TableHead className="text-right">Participants</TableHead>
                <TableHead className="text-right">Messages</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead className="text-right">Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeThreads.map((thread) => (
                <TableRow key={thread.threadId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {thread.salonName ? (
                        <>
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{thread.salonName}</span>
                        </>
                      ) : (
                        <Muted>General</Muted>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{thread.participantCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{thread.messageCount}</TableCell>
                  <TableCell>
                    <Muted className="text-xs line-clamp-2">
                      {thread.lastMessagePreview || 'No messages'}
                    </Muted>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {formatDate(thread.lastMessageAt)}
                  </TableCell>
                </TableRow>
              ))}
              {activeThreads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Muted>No threads found</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle>Most Active Users</CardTitle>
          <CardDescription>Users by message volume</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Threads</TableHead>
                <TableHead className="text-right">Messages</TableHead>
                <TableHead className="text-right">Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-medium">
                    {user.userName || <Muted>Unknown</Muted>}
                  </TableCell>
                  <TableCell>
                    <Muted className="text-xs">{user.userEmail || 'N/A'}</Muted>
                  </TableCell>
                  <TableCell className="text-right">{user.threadCount}</TableCell>
                  <TableCell className="text-right font-semibold">{user.messageCount}</TableCell>
                  <TableCell className="text-right text-sm">
                    {formatDate(user.lastActiveAt)}
                  </TableCell>
                </TableRow>
              ))}
              {activeUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Muted>No user data available</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Salon Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Message Activity by Salon</CardTitle>
          <CardDescription>Thread and message counts per salon</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon</TableHead>
                <TableHead className="text-right">Threads</TableHead>
                <TableHead className="text-right">Messages</TableHead>
                <TableHead className="text-right">Avg Messages/Thread</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salonStats.map((salon) => (
                <TableRow key={salon.salonId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {salon.salonName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{salon.totalThreads}</TableCell>
                  <TableCell className="text-right font-semibold">{salon.totalMessages}</TableCell>
                  <TableCell className="text-right">
                    {salon.totalThreads > 0
                      ? (salon.totalMessages / salon.totalThreads).toFixed(1)
                      : '0'}
                  </TableCell>
                </TableRow>
              ))}
              {salonStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Muted>No salon data available</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  )
}
