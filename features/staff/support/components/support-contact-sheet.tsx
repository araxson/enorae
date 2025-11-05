'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
interface SupportContactSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupportContactSheet({ open, onOpenChange }: SupportContactSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>Schedule a callback</SheetTitle>
          <SheetDescription>Select availability and preferred channel.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <FieldSet className="space-y-4 pr-2 pt-4">
            <FieldLegend>Callback preferences</FieldLegend>
            <Field>
              <FieldLabel htmlFor="callback-day">Preferred day</FieldLabel>
              <FieldContent>
                <Select defaultValue="today">
                  <SelectTrigger id="callback-day">
                    <SelectValue placeholder="Choose a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="later">Later this week</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="callback-window">Time window</FieldLabel>
              <FieldContent>
                <Input id="callback-window" placeholder="e.g. 2:00 – 3:00 PM" />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="callback-notes">Notes for the specialist</FieldLabel>
              <FieldContent>
                <Textarea
                  id="callback-notes"
                  rows={3}
                  placeholder="Optional context helps us prepare."
                />
              </FieldContent>
            </Field>
          </FieldSet>
        </ScrollArea>

        <SheetFooter>
          <ButtonGroup aria-label="Actions">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button>Schedule</Button>
          </ButtonGroup>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
