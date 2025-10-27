import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, ShieldQuestion, UserCircle2 } from 'lucide-react'
import type { ProfileDetail } from '@/features/admin/profile/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface ProfileSummaryCardProps {
  profile: ProfileDetail | null
  isLoading: boolean
}

const formatDate = (value: string | null) => {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

const getInitials = (name?: string | null, email?: string | null) => {
  const source = name || email || ''
  const parts = source.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '??'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase()
}

export function ProfileSummaryCard({ profile, isLoading }: ProfileSummaryCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Profile overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Profile overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No profile selected</EmptyTitle>
              <EmptyDescription>Pick a user to view account details and attributes.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const { summary, metadata, roles } = profile

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Profile overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={metadata.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-muted text-lg font-semibold">
              {getInitials(metadata.fullName, summary.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-lg font-semibold leading-tight">
                {metadata.fullName || summary.fullName || 'No name on record'}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                {summary.email ?? 'No email available'}
              </p>
              {summary.username && (
                <p className="text-sm text-muted-foreground">@{summary.username}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.status && (
                <Badge variant="outline">
                  {summary.status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
              )}
              {summary.primaryRole ? (
                <Badge variant="default">
                  {summary.primaryRole.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <ShieldQuestion className="mr-1 h-3 w-3" />
                  Role missing
                </Badge>
              )}
              {summary.emailVerified ? (
                <Badge variant="secondary">
                  Email verified
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Email unverified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Last activity</p>
            <p className="text-sm font-medium">{formatDate(summary.lastActiveAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm font-medium">{formatDate(summary.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Locale &amp; timezone</p>
            <p className="text-sm font-medium">
              {[summary.locale, summary.timezone].filter(Boolean).join(' · ') || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Country</p>
            <p className="text-sm font-medium">{summary.countryCode ?? '—'}</p>
          </div>
        </div>

        {roles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Active roles</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge key={role.id} variant="outline">
                  <UserCircle2 className="mr-1 h-3 w-3" />
                  {role.role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {(metadata.tags.length > 0 || metadata.interests.length > 0) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {metadata.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Tags</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {metadata.interests.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Interests</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {metadata.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
