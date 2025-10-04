import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
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
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view your profile'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  if (!profile) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </Section>
    )
  }

  // Fetch profile metadata and username
  const supabase = await createClient()
  const { data: metadata } = profile.user_id
    ? await supabase
        .from('profiles_metadata')
        .select('*')
        .eq('profile_id', profile.user_id)
        .single()
    : { data: null }

  const { data: userProfile } = profile.user_id
    ? await supabase.from('profiles').select('username').eq('id', profile.user_id).single<{ username: string | null }>()
    : { data: null }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>My Profile</H1>
          <Lead>Your professional profile and information</Lead>
        </div>

        <ProfileClient profile={profile} metadata={metadata || null} username={userProfile?.username || null} />
      </Stack>
    </Section>
  )
}
