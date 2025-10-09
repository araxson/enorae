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
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="h-4 w-4 text-sky-500" />
              Hotline
            </div>
            <p className="text-xs text-muted-foreground">Best for urgent issues that block work.</p>
          </div>
          <Badge variant="secondary">15 min avg</Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              Chat
            </div>
            <p className="text-xs text-muted-foreground">Great for multi-step troubleshooting.</p>
          </div>
          <Badge variant="outline">Live 8a–8p</Badge>
        </div>

        <Separator />

        <HoverCard>
          <HoverCardTrigger asChild>
            <Button className="w-full" variant="outline" onClick={onOpenContact}>
              Schedule a callback
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64 text-sm">
            Choose a 15-minute window and we will connect you with the next available specialist.
          </HoverCardContent>
        </HoverCard>

        <div className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Status alerts</span>
            <Switch defaultChecked aria-label="Toggle status alerts" />
          </div>
          <p className="text-xs text-muted-foreground">
            Receive mobile and email alerts when ticket status changes or a fix is shipped.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

