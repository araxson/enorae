import type { Dispatch, SetStateAction } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { segmentOptions } from './constants'
import type { PricingRuleFormState } from './types'

type FormStateSetter = Dispatch<SetStateAction<PricingRuleFormState>>

type ValidityFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  selectedServiceName: string
}

export function ValidityFields({
  formData,
  setFormData,
  selectedServiceName,
}: ValidityFieldsProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="valid_from">Valid From</Label>
          <Input
            id="valid_from"
            type="date"
            value={formData.valid_from}
            onChange={(event) =>
              setFormData((current) => ({ ...current, valid_from: event.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="valid_until">Valid Until</Label>
          <Input
            id="valid_until"
            type="date"
            value={formData.valid_until}
            onChange={(event) =>
              setFormData((current) => ({ ...current, valid_until: event.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="customer_segment">Customer Segment</Label>
        <Select
          value={formData.customer_segment}
          onValueChange={(value) =>
            setFormData((current) => ({ ...current, customer_segment: value }))
          }
        >
          <SelectTrigger id="customer_segment">
            <SelectValue placeholder="All customers" />
          </SelectTrigger>
          <SelectContent>
            {segmentOptions.map((segment) => (
              <SelectItem key={segment.value} value={segment.value}>
                {segment.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid items-end gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Input
            id="priority"
            type="number"
            min="1"
            max="100"
            value={formData.priority}
            onChange={(event) =>
              setFormData((current) => ({ ...current, priority: Number(event.target.value) }))
            }
          />
          <p className="text-xs mt-1 text-muted-foreground">
            Lower numbers execute first when multiple rules apply (current target: {selectedServiceName}).
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="is_active">Active Rule</Label>
              <p className="text-sm text-muted-foreground">Deactivate to save rule for later use.</p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData((current) => ({ ...current, is_active: checked }))
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
