import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { Database } from '@/lib/types/database.types'

type StaffProfile = Database['public']['Views']['staff_enriched_view']['Row']
type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row'] | null

interface ProfileSidebarProps {
  profile: StaffProfile
  metadata: ProfileMetadata
}

export function ProfileSidebar({ profile, metadata }: ProfileSidebarProps) {
  const initials = profile.name
    ? profile.name
        .split(' ')
        .map((part: string) => part[0])
        .join('')
        .toUpperCase()
    : profile.email?.[0]?.toUpperCase() || '?'

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center gap-6 py-6 text-center">
          <Avatar className="size-24">
            <AvatarImage src={metadata?.avatar_url || profile.avatar || undefined} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <p className="text-xl font-semibold leading-tight">
              {profile.name || 'Staff member'}
            </p>
            {profile.title ? <CardDescription>{profile.title}</CardDescription> : null}
            {profile.email ? <CardDescription>{profile.email}</CardDescription> : null}
          </div>

          {profile.salon_name && (
            <>
              <Separator />
              <div className="space-y-1">
                <Badge variant="outline">Salon</Badge>
                <CardDescription>{profile.salon_name}</CardDescription>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
