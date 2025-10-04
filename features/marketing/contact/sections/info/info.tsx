import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { Mail, Briefcase, Headphones } from 'lucide-react'
import { infoData } from './info.data'

const iconMap = {
  mail: Mail,
  briefcase: Briefcase,
  headphones: Headphones,
} as const

export function Info() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{infoData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="lg">
          {infoData.channels.map((channel) => {
            const Icon = iconMap[channel.icon as keyof typeof iconMap]
            return (
              <Stack gap="sm" key={channel.title}>
                <Icon className="h-6 w-6" />
                <Stack gap="xs">
                  <H3>{channel.title}</H3>
                  <CardDescription>{channel.value}</CardDescription>
                  <Muted>{channel.description}</Muted>
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}
