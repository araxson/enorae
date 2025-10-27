import { Shield, Lock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

export function PrivacyNotice() {
  return (
    <Alert>
      <Shield className="h-4 w-4" />
      <AlertTitle>Privacy & Data</AlertTitle>
      <AlertDescription>
        Your preferences are stored securely and only used to improve your experience. You can update
        these settings at any time.
        <ItemGroup className="mt-3 gap-2">
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Secure storage</ItemTitle>
              <ItemDescription>We encrypt your notification choices before saving them.</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Full control</ItemTitle>
              <ItemDescription>Adjust or remove your preferences whenever you like.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </AlertDescription>
    </Alert>
  )
}
