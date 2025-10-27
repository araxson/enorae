import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

export function SupportTicketCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a support ticket</CardTitle>
        <CardDescription>The more detail you share, the faster we can assist.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="ticket-subject">Subject</FieldLabel>
            <FieldContent>
              <Input id="ticket-subject" placeholder="Briefly describe the problem" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Priority</FieldLabel>
            <FieldContent>
              <RadioGroup defaultValue="standard" className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="flex items-start gap-3">
                  <RadioGroupItem
                    id="priority-low"
                    value="low"
                    aria-labelledby="priority-low-title"
                    aria-describedby="priority-low-description"
                  />
                  <div className="space-y-1">
                    <h4 className="font-semibold" id="priority-low-title">Low</h4>
                    <p className="text-sm text-muted-foreground" id="priority-low-description">Informational</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3">
                  <RadioGroupItem
                    id="priority-standard"
                    value="standard"
                    aria-labelledby="priority-standard-title"
                    aria-describedby="priority-standard-description"
                  />
                  <div className="space-y-1">
                    <h4 className="font-semibold" id="priority-standard-title">Standard</h4>
                    <p className="text-sm text-muted-foreground" id="priority-standard-description">Needs attention</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3">
                  <RadioGroupItem
                    id="priority-urgent"
                    value="urgent"
                    aria-labelledby="priority-urgent-title"
                    aria-describedby="priority-urgent-description"
                  />
                  <div className="space-y-1">
                    <h4 className="font-semibold" id="priority-urgent-title">Urgent</h4>
                    <p className="text-sm text-muted-foreground" id="priority-urgent-description">Blocking work</p>
                  </div>
                </CardContent>
              </Card>
              </RadioGroup>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="ticket-area">Area</FieldLabel>
            <FieldContent>
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
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="ticket-details">Details</FieldLabel>
            <FieldContent>
              <Textarea id="ticket-details" rows={4} placeholder="Share the exact error, steps to reproduce, or screenshots." />
            </FieldContent>
          </Field>

          <Card>
            <CardContent className="flex flex-col gap-3">
              <div className="space-y-1">
                <h4 className="font-semibold" id="attach-logs-title">Attach logs automatically</h4>
                <p className="text-sm text-muted-foreground" id="attach-logs-description">
                  Include the last 10 events from your activity timeline.
                </p>
              </div>
              <div className="flex justify-end">
                <Switch
                  id="attach-logs"
                  defaultChecked
                  aria-labelledby="attach-logs-title"
                  aria-describedby="attach-logs-description"
                />
              </div>
            </CardContent>
          </Card>

          <ButtonGroup>
            <Button type="submit">Submit ticket</Button>
            <Button variant="outline">Save as draft</Button>
          </ButtonGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
