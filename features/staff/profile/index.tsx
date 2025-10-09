import { Alert, AlertDescription } from '@/components/ui/alert'
import { getMyStaffProfile } from './api/queries'
import { ProfileClient } from './components/profile-client'
import { createClient } from '@/lib/supabase/server'

export async function StaffProfile() {
  let profile
  try {
    profile = await getMyStaffProfile()
  } catch (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view your profile'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: metadata } = profile.user_id
    ? await supabase
        .from('profiles_metadata')
        .select('*')
        .eq('profile_id', profile.user_id)
        .single()
    : { data: null }

  const { data: userProfile } = profile.user_id
    ? await supabase
        .from('profiles')
        .select('username')
        .eq('id', profile.user_id)
        .single<{ username: string | null }>()
    : { data: null }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ProfileClient
        profile={profile}
        metadata={metadata || null}
        username={userProfile?.username || null}
      />
    </div>
  )
}
