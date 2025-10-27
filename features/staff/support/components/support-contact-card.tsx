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
            <CardContent className="flex flex-col gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-secondary" aria-hidden />
                  <h3 className="font-semibold" id="contact-hotline-title">Hotline</h3>
                </div>
                <p className="text-sm text-muted-foreground" id="contact-hotline-description">
                  Best for urgent issues that block work.
                </p>
              </div>
              <div className="flex justify-end">
                <Badge variant="secondary">15 min avg</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" aria-hidden />
                  <h3 className="font-semibold" id="contact-chat-title">Chat</h3>
                </div>
                <p className="text-sm text-muted-foreground" id="contact-chat-description">
                  Great for multi-step troubleshooting.
                </p>
              </div>
              <div className="flex justify-end">
                <Badge variant="outline">Live 8a–8p</Badge>
              </div>
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
            <CardContent className="flex flex-col gap-3">
              <div className="space-y-1">
                <h3 className="font-semibold" id="status-alerts-title">Status alerts</h3>
                <p className="text-sm text-muted-foreground" id="status-alerts-description">
                  Receive mobile and email alerts when ticket status changes or a fix is shipped.
                </p>
              </div>
              <div className="flex justify-end">
                <Switch
                  defaultChecked
                  aria-labelledby="status-alerts-title"
                  aria-describedby="status-alerts-description"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
