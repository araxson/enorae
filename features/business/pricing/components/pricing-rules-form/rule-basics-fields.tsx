import type { Dispatch, SetStateAction } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ruleLabels, type RuleType } from './constants'
import type { PricingRuleFormState } from './types'

type FormStateSetter = Dispatch<SetStateAction<PricingRuleFormState>>

type RuleBasicsFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  services: Array<{ id: string; name: string; price?: number }>
}

export function RuleBasicsFields({ formData, setFormData, services }: RuleBasicsFieldsProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Label htmlFor="rule_name">Rule Name</Label>
        <Input
          id="rule_name"
          value={formData.rule_name}
          onChange={(event) =>
            setFormData((current) => ({ ...current, rule_name: event.target.value }))
          }
          placeholder="e.g., Peak Hours Premium"
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="rule_type">Rule Type</Label>
          <Select
            value={formData.rule_type}
            onValueChange={(value: RuleType) =>
              setFormData((current) => ({ ...current, rule_type: value }))
            }
          >
            <SelectTrigger id="rule_type">
              <SelectValue placeholder="Select rule type" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ruleLabels) as RuleType[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {ruleLabels[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="service_id">Target Service</Label>
          <Select
            value={formData.service_id}
            onValueChange={(value) =>
              setFormData((current) => ({ ...current, service_id: value }))
            }
          >
            <SelectTrigger id="service_id">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                  {typeof service.price === 'number' ? ` • $${service.price.toFixed(2)}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
