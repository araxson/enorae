import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface HelpFeedbackDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpFeedbackDrawer({ open, onOpenChange }: HelpFeedbackDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col md:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Save view & share feedback</DrawerTitle>
          <DrawerDescription>Bookmark this combination and tell us how we can improve it.</DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4 pb-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="bookmark-name">Bookmark name</Label>
              <Input id="bookmark-name" placeholder="e.g. Morning scheduling tips" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Notify me when</CardTitle>
                <CardDescription>Select the updates you would like to keep.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Checkbox defaultChecked /> New resources are added
                </Label>
                <Label className="flex items-center gap-2">
                  <Checkbox /> Content is updated
                </Label>
              </CardContent>
            </Card>

            <div className="grid gap-2">
              <Label htmlFor="feedback-notes">Feedback</Label>
              <Textarea
                id="feedback-notes"
                rows={4}
                placeholder="What worked well? Anything missing or confusing?"
              />
            </div>

            <Card>
              <CardHeader className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle>Share anonymously</CardTitle>
                  <CardDescription>We will only record the feedback message.</CardDescription>
                </div>
                <Switch defaultChecked />
              </CardHeader>
            </Card>
          </div>
        </ScrollArea>

        <DrawerFooter>
          <Button onClick={() => onOpenChange(false)}>Save view</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
