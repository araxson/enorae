import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
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

interface SupportContactSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupportContactSheet({ open, onOpenChange }: SupportContactSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Schedule a callback</SheetTitle>
          <SheetDescription>Select availability and preferred channel.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-2 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="callback-day">Preferred day</Label>
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="callback-window">Time window</Label>
              <Input id="callback-window" placeholder="e.g. 2:00 – 3:00 PM" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="callback-notes">Notes for the specialist</Label>
              <Textarea
                id="callback-notes"
                rows={3}
                placeholder="Optional context helps us prepare."
              />
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Schedule</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

