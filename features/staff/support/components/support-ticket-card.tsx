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
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="ticket-subject">Subject</Label>
            <Input id="ticket-subject" placeholder="Briefly describe the problem" />
          </div>

          <div className="grid gap-2">
            <Label>Priority</Label>
            <RadioGroup defaultValue="standard" className="grid grid-cols-3 gap-3">
              <Card>
                <CardHeader className="space-y-0">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      id="priority-low"
                      value="low"
                      aria-labelledby="priority-low-title"
                      aria-describedby="priority-low-description"
                    />
                    <div className="space-y-1">
                      <CardTitle id="priority-low-title">Low</CardTitle>
                      <CardDescription id="priority-low-description">Informational</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-0">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      id="priority-standard"
                      value="standard"
                      aria-labelledby="priority-standard-title"
                      aria-describedby="priority-standard-description"
                    />
                    <div className="space-y-1">
                      <CardTitle id="priority-standard-title">Standard</CardTitle>
                      <CardDescription id="priority-standard-description">Needs attention</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-0">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      id="priority-urgent"
                      value="urgent"
                      aria-labelledby="priority-urgent-title"
                      aria-describedby="priority-urgent-description"
                    />
                    <div className="space-y-1">
                      <CardTitle id="priority-urgent-title">Urgent</CardTitle>
                      <CardDescription id="priority-urgent-description">Blocking work</CardDescription>
                    </div>
                  </div>
                </CardHeader>
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
            <CardHeader className="space-y-1">
              <CardTitle id="attach-logs-title">Attach logs automatically</CardTitle>
              <CardDescription id="attach-logs-description">
                Include the last 10 events from your activity timeline.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Switch
                id="attach-logs"
                defaultChecked
                aria-labelledby="attach-logs-title"
                aria-describedby="attach-logs-description"
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            <Button type="submit">Submit ticket</Button>
            <Button variant="outline">Save as draft</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
