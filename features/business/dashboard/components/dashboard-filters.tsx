'use client'

import { useMemo, useState } from 'react'
import { Filter, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Badge } from '@/components/ui/badge'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { DateRangePicker } from './filters/date-range-picker'
import { TeamFocusFilter } from './filters/team-focus-filter'
import { ServiceTierFilter } from './filters/service-tier-filter'
import { StaffAssignmentsFilter } from './filters/staff-assignments-filter'

const STYLIST_OPTIONS = ['Any stylist', 'Color specialists', 'Front desk', 'Senior stylists']

export function DashboardFilters() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedStylist, setSelectedStylist] = useState(STYLIST_OPTIONS[0])
  const [serviceTier, setServiceTier] = useState<'all' | 'premium' | 'standard'>('all')

  const formattedRange = useMemo(() => {
    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} – ${dateRange.to.toLocaleDateString()}`
    }
    if (dateRange.from) {
      return dateRange.from.toLocaleDateString()
    }
    return 'Pick a range'
  }, [dateRange])

  const handleReset = () => {
    setDateRange({})
    setSelectedStylist(STYLIST_OPTIONS[0])
    setServiceTier('all')
  }

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Smart filters</ItemTitle>
        <ItemDescription>Fine tune the data you see today.</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-4">
          <ItemGroup>
            <Item className="items-stretch gap-4">
              <ItemContent className="flex items-center gap-3">
                <Badge variant="outline">
                  <span className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    Smart filters
                  </span>
                </Badge>
              </ItemContent>
              <ItemActions className="flex-col items-end gap-2 text-xs text-muted-foreground">
                <span>{formattedRange}</span>
                <span>{selectedStylist}</span>
              </ItemActions>
            </Item>
          </ItemGroup>

          <Separator />

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <DateRangePicker dateRange={dateRange} onChange={setDateRange} />

            <InputGroup className="md:max-w-xs">
              <InputGroupAddon>
                <Users className="h-4 w-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search clients" onFocus={() => undefined} />
              <InputGroupButton size="icon-xs" variant="outline">
                Go
              </InputGroupButton>
            </InputGroup>

            <Select
              value={serviceTier}
              onValueChange={(value: 'all' | 'premium' | 'standard') => setServiceTier(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Service tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                <SelectItem value="premium">Premium only</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <FieldSet className="flex flex-col gap-4">
            <TeamFocusFilter selectedStylist={selectedStylist} onSelect={setSelectedStylist} />

            <FieldGroup className="flex flex-wrap items-start gap-6">
              <ServiceTierFilter value={serviceTier} onChange={setServiceTier} />

              <Field className="w-full max-w-xs">
                <FieldLabel>Booking load threshold</FieldLabel>
                <FieldContent>
                  <Slider defaultValue={[75]} aria-label="Booking load threshold" />
                  <FieldDescription>Alerts when booking load exceeds 75% capacity.</FieldDescription>
                </FieldContent>
              </Field>

              <StaffAssignmentsFilter />
            </FieldGroup>

            <ItemGroup>
              <Item className="items-center justify-between gap-4">
                <ItemContent>
                  <Field orientation="horizontal" className="items-center gap-3">
                    <Switch id="include-cancellations" />
                    <FieldLabel htmlFor="include-cancellations">Include cancellations</FieldLabel>
                  </Field>
                </ItemContent>
                <ItemActions>
                  <ButtonGroup>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      Reset
                    </Button>
                    <Button size="sm">Apply filters</Button>
                  </ButtonGroup>
                </ItemActions>
              </Item>
            </ItemGroup>
          </FieldSet>
        </div>
      </ItemContent>
    </Item>
  )
}
