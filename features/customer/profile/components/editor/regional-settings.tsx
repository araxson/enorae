import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, DollarSign } from 'lucide-react'

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
    <div>
      <Label className="flex items-center gap-2 mb-4">
        <Globe className="h-4 w-4" />
        Regional Settings
      </Label>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="timezone" className="text-sm mb-2 block">
            Timezone
          </Label>
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
        </div>

        <div>
          <Label htmlFor="locale" className="text-sm mb-2 block">
            Language
          </Label>
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
        </div>

        <div>
          <Label htmlFor="currency" className="text-sm mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Currency
          </Label>
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
       </div>
      </div>
    </div>
  )
}
