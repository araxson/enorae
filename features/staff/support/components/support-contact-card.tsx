import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Switch } from '@/components/ui/switch'
import { Phone, MessageCircle } from 'lucide-react'

interface SupportContactCardProps {
  onOpenContact: () => void
}

export function SupportContactCard({ onOpenContact }: SupportContactCardProps) {
  return (
    <Card id="contact-options">
      <CardHeader>
        <CardTitle>Contact options</CardTitle>
        <CardDescription>Select the channel that matches the urgency of your request.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" aria-hidden />
                <CardTitle id="contact-hotline-title">Hotline</CardTitle>
              </div>
              <CardDescription id="contact-hotline-description">
                Best for urgent issues that block work.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Badge variant="secondary">15 min avg</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" aria-hidden />
                <CardTitle id="contact-chat-title">Chat</CardTitle>
              </div>
              <CardDescription id="contact-chat-description">
                Great for multi-step troubleshooting.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Badge variant="outline">Live 8a–8p</Badge>
            </CardContent>
          </Card>

          <Separator />

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button className="w-full" variant="outline" onClick={onOpenContact}>
                Schedule a callback
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-64 text-sm">
                Choose a 15-minute window and we will connect you with the next available specialist.
              </div>
            </HoverCardContent>
          </HoverCard>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle id="status-alerts-title">Status alerts</CardTitle>
              <CardDescription id="status-alerts-description">
                Receive mobile and email alerts when ticket status changes or a fix is shipped.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Switch
                defaultChecked
                aria-labelledby="status-alerts-title"
                aria-describedby="status-alerts-description"
              />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
