'use client'

import { useMemo, useState } from 'react'
import { CalendarIcon, Filter, Users } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
const stylistOptions = ['Any stylist', 'Color specialists', 'Front desk', 'Senior stylists']

export function DashboardFilters() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedStylist, setSelectedStylist] = useState(stylistOptions[0])
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart filters</CardTitle>
        <CardDescription>Fine tune the data you see today.</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 md:w-auto">
                  <CalendarIcon className="h-4 w-4" />
                  {formattedRange}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range ?? {})}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <InputGroup className="md:max-w-xs">
              <InputGroupAddon>
                <Users className="h-4 w-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search clients" onFocus={() => undefined} />
              <InputGroupButton size="icon-xs" variant="outline">Go</InputGroupButton>
            </InputGroup>

            <Select value={serviceTier} onValueChange={(value: 'all' | 'premium' | 'standard') => setServiceTier(value)}>
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

          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Team focus</FieldLabel>
              <FieldContent>
                <Command>
                  <CommandInput placeholder="Filter by team group" />
                  <CommandList>
                    <CommandEmpty>No matches.</CommandEmpty>
                    <CommandGroup heading="Groups">
                      {stylistOptions.map((option) => (
                        <CommandItem key={option} onSelect={() => setSelectedStylist(option)}>
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                      <CommandItem onSelect={() => setSelectedStylist('Any stylist')}>
                        Reset selection
                      </CommandItem>
                      <CommandItem onSelect={() => setSelectedStylist('Senior stylists')}>
                        Focus on senior stylists
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </FieldContent>
            </Field>

            <FieldGroup className="flex flex-wrap items-start gap-6">
              <Field className="min-w-[240px]">
                <FieldLabel>Service mix</FieldLabel>
                <FieldContent>
                  <RadioGroup
                    value={serviceTier}
                    onValueChange={(value) => setServiceTier(value as typeof serviceTier)}
                  >
                    <Field orientation="horizontal" className="items-center gap-2">
                      <RadioGroupItem value="all" id="tier-all" />
                      <FieldLabel htmlFor="tier-all">All services</FieldLabel>
                    </Field>
                    <Field orientation="horizontal" className="items-center gap-2">
                      <RadioGroupItem value="premium" id="tier-premium" />
                      <FieldLabel htmlFor="tier-premium">Premium services</FieldLabel>
                    </Field>
                    <Field orientation="horizontal" className="items-center gap-2">
                      <RadioGroupItem value="standard" id="tier-standard" />
                      <FieldLabel htmlFor="tier-standard">Standard services</FieldLabel>
                    </Field>
                  </RadioGroup>
                </FieldContent>
              </Field>

              <Field className="w-full max-w-xs">
                <FieldLabel>Booking load threshold</FieldLabel>
                <FieldContent>
                  <Slider defaultValue={[75]} aria-label="Booking load threshold" />
                  <FieldDescription>Alerts when booking load exceeds 75% capacity.</FieldDescription>
                </FieldContent>
              </Field>

              <Field className="min-w-[240px]">
                <FieldLabel>Staff assignments</FieldLabel>
                <FieldContent className="flex flex-col gap-2">
                  <Field orientation="horizontal" className="items-center gap-2">
                    <Checkbox id="assignment-balanced" defaultChecked />
                    <FieldLabel htmlFor="assignment-balanced">Balanced workload</FieldLabel>
                  </Field>
                  <Field orientation="horizontal" className="items-center gap-2">
                    <Checkbox id="assignment-specialist" />
                    <FieldLabel htmlFor="assignment-specialist">Highlight specialists</FieldLabel>
                  </Field>
                </FieldContent>
              </Field>
            </FieldGroup>

            <ItemGroup>
              <Item className="items-center justify-between gap-4">
                <ItemContent>
                  <Field orientation="horizontal" className="items-center gap-3">
                    <Switch id="include-cancellations" />
                    <FieldLabel htmlFor="include-cancellations">Include cancellations</FieldLabel>
                  </Field>
                </ItemContent>
                <ItemActions className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setDateRange({})
                    setSelectedStylist(stylistOptions[0])
                    setServiceTier('all')
                  }}>
                    Reset
                  </Button>
                  <Button size="sm">Apply filters</Button>
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
