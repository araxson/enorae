import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMessageThreadsByUser } from './dal/messaging.queries'
import { ThreadList } from './components/thread-list'
import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

export async function Messaging() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const threads = await getMessageThreadsByUser(user.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Messages</H1>
          <P className="text-muted-foreground">
            Communicate with salons about your appointments
          </P>
        </div>

        <Separator />

        <ThreadList threads={threads} />
      </Stack>
    </Section>
  )
}
