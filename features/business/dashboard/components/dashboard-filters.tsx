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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline">
                <span className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Smart filters
                </span>
              </Badge>
            </div>
            <div className="flex flex-col gap-2 items-end text-xs text-muted-foreground">
              <span>{formattedRange}</span>
              <span>{selectedStylist}</span>
            </div>
          </div>

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
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">Team focus</p>
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
            </div>

            <div className="flex flex-wrap items-start gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Service mix</p>
                <RadioGroup value={serviceTier} onValueChange={(value) => setServiceTier(value as typeof serviceTier)}>
                  <div className="flex items-center gap-2"><RadioGroupItem value="all" id="tier-all" /><label htmlFor="tier-all" className="text-sm text-muted-foreground">All services</label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="premium" id="tier-premium" /><label htmlFor="tier-premium" className="text-sm text-muted-foreground">Premium services</label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="standard" id="tier-standard" /><label htmlFor="tier-standard" className="text-sm text-muted-foreground">Standard services</label></div>
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-xs">
                <p className="text-sm font-medium text-muted-foreground">Booking load threshold</p>
                <Slider defaultValue={[75]} aria-label="Booking load threshold" />
                <p className="text-xs text-muted-foreground">Alerts when booking load exceeds 75% capacity.</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Staff assignments</p>
                <div className="flex items-center gap-2"><Checkbox id="assignment-balanced" defaultChecked /><label htmlFor="assignment-balanced" className="text-sm text-muted-foreground">Balanced workload</label></div>
                <div className="flex items-center gap-2"><Checkbox id="assignment-specialist" /><label htmlFor="assignment-specialist" className="text-sm text-muted-foreground">Highlight specialists</label></div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Switch id="include-cancellations" />
                <label htmlFor="include-cancellations" className="text-sm text-muted-foreground">
                  Include cancellations
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => {
                  setDateRange({})
                  setSelectedStylist(stylistOptions[0])
                  setServiceTier('all')
                }}>
                  Reset
                </Button>
                <Button size="sm">Apply filters</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
