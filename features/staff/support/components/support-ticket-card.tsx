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
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

export function SupportTicketCard() {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemContent>
              <CardTitle>Start a support ticket</CardTitle>
              <CardDescription>The more detail you share, the faster we can assist.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
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
                <Item variant="outline" size="sm" className="items-start gap-3">
                  <ItemMedia>
                    <RadioGroupItem
                      id="priority-low"
                      value="low"
                      aria-labelledby="priority-low-title"
                      aria-describedby="priority-low-description"
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle id="priority-low-title">Low</ItemTitle>
                    <ItemDescription id="priority-low-description">Informational</ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="outline" size="sm" className="items-start gap-3">
                  <ItemMedia>
                    <RadioGroupItem
                      id="priority-standard"
                      value="standard"
                      aria-labelledby="priority-standard-title"
                      aria-describedby="priority-standard-description"
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle id="priority-standard-title">Standard</ItemTitle>
                    <ItemDescription id="priority-standard-description">Needs attention</ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="outline" size="sm" className="items-start gap-3">
                  <ItemMedia>
                    <RadioGroupItem
                      id="priority-urgent"
                      value="urgent"
                      aria-labelledby="priority-urgent-title"
                      aria-describedby="priority-urgent-description"
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle id="priority-urgent-title">Urgent</ItemTitle>
                    <ItemDescription id="priority-urgent-description">Blocking work</ItemDescription>
                  </ItemContent>
                </Item>
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

          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle id="attach-logs-title">Attach logs automatically</ItemTitle>
                <ItemDescription id="attach-logs-description">
                  Include the last 10 events from your activity timeline.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  id="attach-logs"
                  defaultChecked
                  aria-labelledby="attach-logs-title"
                  aria-describedby="attach-logs-description"
                />
              </ItemActions>
            </Item>
          </ItemGroup>

          <ButtonGroup>
            <Button type="submit">Submit ticket</Button>
            <Button variant="outline">Save as draft</Button>
          </ButtonGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
