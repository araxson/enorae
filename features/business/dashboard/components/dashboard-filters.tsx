'use client'

import { useMemo, useState } from 'react'
import { CalendarIcon, Filter, Users } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Stack, Group } from '@/components/layout'
import { Small } from '@/components/ui/typography'

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
    <Stack gap="md" className="rounded-xl border bg-muted/20 p-4 shadow-sm">
      <Group className="items-center justify-between">
        <Group gap="sm" className="items-center">
          <Badge variant="outline" className="gap-1">
            <Filter className="h-3.5 w-3.5" />
            Smart filters
          </Badge>
          <Small className="text-muted-foreground">Fine tune the data you see today.</Small>
        </Group>
        <Stack gap="xs" className="items-end text-xs text-muted-foreground">
          <span>{formattedRange}</span>
          <span>{selectedStylist}</span>
        </Stack>
      </Group>

      <Separator />

      <Stack gap="md" className="md:flex-row md:items-end md:justify-between">
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
      </Stack>

      <Separator />

      <Stack gap="md">
        <Stack gap="xs">
          <Small className="font-medium text-muted-foreground">Team focus</Small>
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
                <CommandItem onSelect={() => setSelectedStylist('Any stylist')}>Reset selection</CommandItem>
                <CommandItem onSelect={() => setSelectedStylist('Senior stylists')}>Focus on senior stylists</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Stack>

        <Group className="flex-wrap items-center gap-6">
          <Stack gap="xs">
            <Small className="font-medium text-muted-foreground">Service mix</Small>
            <RadioGroup value={serviceTier} onValueChange={(value) => setServiceTier(value as typeof serviceTier)}>
              <Group className="items-center gap-2"><RadioGroupItem value="all" id="tier-all" /><label htmlFor="tier-all" className="text-sm text-muted-foreground">All services</label></Group>
              <Group className="items-center gap-2"><RadioGroupItem value="premium" id="tier-premium" /><label htmlFor="tier-premium" className="text-sm text-muted-foreground">Premium services</label></Group>
              <Group className="items-center gap-2"><RadioGroupItem value="standard" id="tier-standard" /><label htmlFor="tier-standard" className="text-sm text-muted-foreground">Standard services</label></Group>
            </RadioGroup>
          </Stack>

          <Stack gap="xs" className="w-full max-w-xs">
            <Small className="font-medium text-muted-foreground">Booking load threshold</Small>
            <Slider defaultValue={[75]} aria-label="Booking load threshold" />
            <Small className="text-xs text-muted-foreground">Alerts when booking load exceeds 75% capacity.</Small>
          </Stack>

          <Stack gap="xs">
            <Small className="font-medium text-muted-foreground">Staff assignments</Small>
            <Group className="items-center gap-2"><Checkbox id="assignment-balanced" defaultChecked /><label htmlFor="assignment-balanced" className="text-sm text-muted-foreground">Balanced workload</label></Group>
            <Group className="items-center gap-2"><Checkbox id="assignment-specialist" /><label htmlFor="assignment-specialist" className="text-sm text-muted-foreground">Highlight specialists</label></Group>
          </Stack>
        </Group>

        <Group className="items-center justify-between">
          <Group className="items-center gap-3">
            <Switch id="include-cancellations" />
            <label htmlFor="include-cancellations" className="text-sm text-muted-foreground">
              Include cancellations
            </label>
          </Group>
          <Group className="items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => {
              setDateRange({})
              setSelectedStylist(stylistOptions[0])
              setServiceTier('all')
            }}>
              Reset
            </Button>
            <Button size="sm">Apply filters</Button>
          </Group>
        </Group>
      </Stack>
    </Stack>
  )
}
