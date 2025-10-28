import { Globe } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface RegionalSettingsProps {
  timezone: string
  onTimezoneChange: (value: string) => void
  locale: string
  onLocaleChange: (value: string) => void
  currencyCode: string
  onCurrencyCodeChange: (value: string) => void
}

export function RegionalSettings({
  timezone,
  onTimezoneChange,
  locale,
  onLocaleChange,
  currencyCode,
  onCurrencyCodeChange,
}: RegionalSettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      <ItemGroup>
        <Item variant="muted" size="sm">
          <ItemMedia variant="icon">
            <Globe className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Regional settings</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>
      <FieldSet>
        <FieldLegend className="sr-only">Regional settings</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
            <FieldContent>
              <Select value={timezone} onValueChange={onTimezoneChange}>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
            <FieldDescription>Select the timezone used for appointment reminders.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="locale">Language</FieldLabel>
            <FieldContent>
              <Select value={locale} onValueChange={onLocaleChange}>
                <SelectTrigger id="locale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                  <SelectItem value="ja-JP">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
            <FieldDescription>Controls notification language and locale formatting.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="currency">Currency</FieldLabel>
            <FieldContent>
              <Select value={currencyCode} onValueChange={onCurrencyCodeChange}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
            <FieldDescription>Displayed in pricing and receipts across the app.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
