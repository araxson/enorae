import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

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
          <FieldSet className="space-y-4">
            <Field>
              <FieldLabel htmlFor="bookmark-name">Bookmark name</FieldLabel>
              <FieldContent>
                <Input id="bookmark-name" placeholder="e.g. Morning scheduling tips" />
              </FieldContent>
            </Field>

            <Card>
              <CardHeader>
                <ItemGroup>
                  <Item variant="muted" size="sm">
                    <ItemContent>
                      <CardTitle>Notify me when</CardTitle>
                      <CardDescription>Select the updates you would like to keep.</CardDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent className="space-y-2">
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="notify-added">New resources are added</FieldLabel>
                  <FieldContent>
                    <Checkbox defaultChecked id="notify-added" />
                  </FieldContent>
                </Field>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="notify-updated">Content is updated</FieldLabel>
                  <FieldContent>
                    <Checkbox id="notify-updated" />
                  </FieldContent>
                </Field>
              </CardContent>
            </Card>

            <Field>
              <FieldLabel htmlFor="feedback-notes">Feedback</FieldLabel>
              <FieldContent>
                <Textarea
                  id="feedback-notes"
                  rows={4}
                  placeholder="What worked well? Anything missing or confusing?"
                />
              </FieldContent>
            </Field>

            <Card>
              <CardHeader>
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <CardTitle>Share anonymously</CardTitle>
                      <CardDescription>We will only record the feedback message.</CardDescription>
                    </ItemContent>
                    <ItemActions>
                      <Switch defaultChecked />
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardHeader>
            </Card>
          </FieldSet>
        </ScrollArea>

        <DrawerFooter>
          <ButtonGroup className="justify-end">
            <Button onClick={() => onOpenChange(false)}>Save view</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </ButtonGroup>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
