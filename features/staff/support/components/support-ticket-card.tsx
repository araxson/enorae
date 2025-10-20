import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

export function SupportTicketCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a support ticket</CardTitle>
        <CardDescription>The more detail you share, the faster we can assist.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="ticket-subject">Subject</Label>
          <Input id="ticket-subject" placeholder="Briefly describe the problem" />
        </div>

        <div className="grid gap-2">
          <Label>Priority</Label>
          <RadioGroup defaultValue="standard" className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="space-y-2 p-4 text-xs">
                <div className="flex items-start gap-2">
                  <RadioGroupItem id="priority-low" value="low" />
                  <div className="space-y-1">
                    <Label htmlFor="priority-low" className="font-semibold text-sm">
                      Low
                    </Label>
                    <span className="text-muted-foreground">Informational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-4 text-xs">
                <div className="flex items-start gap-2">
                  <RadioGroupItem id="priority-standard" value="standard" />
                  <div className="space-y-1">
                    <Label htmlFor="priority-standard" className="font-semibold text-sm">
                      Standard
                    </Label>
                    <span className="text-muted-foreground">Needs attention</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-4 text-xs">
                <div className="flex items-start gap-2">
                  <RadioGroupItem id="priority-urgent" value="urgent" />
                  <div className="space-y-1">
                    <Label htmlFor="priority-urgent" className="font-semibold text-sm text-destructive">
                      Urgent
                    </Label>
                    <span className="text-muted-foreground">Blocking work</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ticket-area">Area</Label>
          <Select defaultValue="appointments">
            <SelectTrigger id="ticket-area">
              <SelectValue placeholder="Select an area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointments">Appointments</SelectItem>
              <SelectItem value="clients">Clients</SelectItem>
              <SelectItem value="profile">Profile & availability</SelectItem>
              <SelectItem value="other">Something else</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ticket-details">Details</Label>
          <Textarea id="ticket-details" rows={4} placeholder="Share the exact error, steps to reproduce, or screenshots." />
        </div>

        <Card>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium" htmlFor="attach-logs">
                Attach logs automatically
              </Label>
              <p className="text-xs text-muted-foreground">Include the last 10 events from your activity timeline.</p>
            </div>
            <Switch id="attach-logs" defaultChecked />
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Button type="submit">Submit ticket</Button>
          <Button variant="outline">Save as draft</Button>
        </div>
      </CardContent>
    </Card>
  )
}
