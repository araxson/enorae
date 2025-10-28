import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

import { ruleLabels } from './constants'

import type { Dispatch, SetStateAction } from 'react'
import type { RuleType } from './constants'
import type { PricingRuleFormState } from './types'

type FormStateSetter = Dispatch<SetStateAction<PricingRuleFormState>>

type RuleBasicsFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  services: Array<{ id: string; name: string; price?: number }>
}

export function RuleBasicsFields({ formData, setFormData, services }: RuleBasicsFieldsProps) {
  return (
    <FieldSet className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="rule_name">Rule Name</FieldLabel>
        <FieldContent>
          <Input
            id="rule_name"
            value={formData.rule_name}
            onChange={(event) =>
              setFormData((current) => ({ ...current, rule_name: event.target.value }))
            }
            placeholder="e.g., Peak Hours Premium"
            required
          />
        </FieldContent>
        <FieldDescription>Give the pricing rule a descriptive title.</FieldDescription>
      </Field>

      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="rule_type">Rule Type</FieldLabel>
          <FieldContent>
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
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="service_id">Target Service</FieldLabel>
          <FieldContent>
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
          </FieldContent>
          <FieldDescription>Apply the rule broadly or to a specific service.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
