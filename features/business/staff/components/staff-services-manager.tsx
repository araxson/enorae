'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Stack, Group } from '@/components/layout'
import { H4, P, Muted } from '@/components/ui/typography'
import { EmptyState } from '@/components/shared/empty-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, X, Scissors, Star, TrendingUp } from 'lucide-react'
import {
  assignServiceToStaff,
  unassignServiceFromStaff,
  bulkAssignServices,
} from '../api/staff-services-mutations'
import type { StaffWithServices } from '../api/staff-services-queries'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']

interface StaffServicesManagerProps {
  staff: StaffWithServices[]
  availableServices: Service[]
}

export function StaffServicesManager({ staff, availableServices }: StaffServicesManagerProps) {
  const [selectedStaff, setSelectedStaff] = useState<StaffWithServices | null>(null)
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())

  if (staff.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No staff members"
        description="Add staff members to your team to manage their services"
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Staff Services Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            {staff.map((member) => (
              <Group
                key={member.id}
                gap="md"
                className="pb-4 border-b last:border-0 last:pb-0"
              >
                <Avatar>
                  {member.avatar_url && (
                    <AvatarImage src={member.avatar_url} alt={member.full_name || 'Staff'} />
                  )}
                  <AvatarFallback>
                    {member.full_name?.slice(0, 2).toUpperCase() || 'ST'}
                  </AvatarFallback>
                </Avatar>

                <Stack gap="xs" className="flex-1">
                  <H4 className="text-base">{member.full_name || 'Staff Member'}</H4>
                  {member.title && <Muted className="text-sm">{member.title}</Muted>}

                  <div className="flex flex-wrap gap-2 mt-2">
                    {member.services.length === 0 ? (
                      <Muted className="text-xs">No services assigned</Muted>
                    ) : (
                      member.services.map((service) => (
                        <div key={service.id} className="flex flex-col gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {service.service_name}
                            {service.proficiency_level && (
                              <span className="ml-1 opacity-70">({service.proficiency_level})</span>
                            )}
                          </Badge>

                          {/* Performance Metrics */}
                          {(service.performed_count || service.rating_average) && (
                            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                              {service.performed_count && service.performed_count > 0 && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {service.performed_count} performed
                                </span>
                              )}
                              {service.rating_average && service.rating_average > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {Number(service.rating_average).toFixed(1)} ({service.rating_count || 0} reviews)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Stack>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedStaff(member)
                    setSelectedServices(new Set(member.services.map((s) => s.service_id!)))
                  }}
                >
                  <Scissors className="h-4 w-4 mr-2" />
                  Manage Services
                </Button>
              </Group>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <AssignServicesDialog
        staff={selectedStaff}
        availableServices={availableServices}
        assignedServices={selectedStaff?.services || []}
        open={!!selectedStaff}
        onOpenChange={(open) => !open && setSelectedStaff(null)}
        selectedServices={selectedServices}
        onSelectedServicesChange={setSelectedServices}
      />
    </>
  )
}

interface AssignServicesDialogProps {
  staff: StaffWithServices | null
  availableServices: Service[]
  assignedServices: Array<{ id: string | null; service_id: string | null; service_name: string | null }>
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedServices: Set<string>
  onSelectedServicesChange: (services: Set<string>) => void
}

function AssignServicesDialog({
  staff,
  availableServices,
  assignedServices,
  open,
  onOpenChange,
  // isBulkMode parameter removed
  selectedServices,
  onSelectedServicesChange,
}: AssignServicesDialogProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('bulk')
  const [selectedService, setSelectedService] = useState<string>('')
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('')
  const [priceOverride, setPriceOverride] = useState<string>('')
  const [durationOverride, setDurationOverride] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const assignedServiceIds = new Set(assignedServices.map((s) => s.service_id))

  const handleSingleAssign = async () => {
    if (!staff || !selectedService) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('staffId', staff.id)
    formData.append('serviceId', selectedService)
    if (proficiencyLevel) formData.append('proficiencyLevel', proficiencyLevel)
    if (priceOverride) formData.append('priceOverride', priceOverride)
    if (durationOverride) formData.append('durationOverride', durationOverride)
    if (notes) formData.append('notes', notes)

    const result = await assignServiceToStaff(formData)

    if (result.error) {
      alert(result.error)
    } else {
      setSelectedService('')
      setProficiencyLevel('')
      setPriceOverride('')
      setDurationOverride('')
      setNotes('')
      onOpenChange(false)
    }

    setIsSubmitting(false)
  }

  const handleBulkAssign = async () => {
    if (!staff || selectedServices.size === 0) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('staffId', staff.id)
    formData.append('serviceIds', JSON.stringify(Array.from(selectedServices)))

    const result = await bulkAssignServices(formData)

    if (result.error) {
      alert(result.error)
    } else {
      onOpenChange(false)
    }

    setIsSubmitting(false)
  }

  const handleUnassign = async (serviceId: string) => {
    if (!staff) return

    const formData = new FormData()
    formData.append('staffId', staff.id)
    formData.append('serviceId', serviceId)

    const result = await unassignServiceFromStaff(formData)

    if (result.error) {
      alert(result.error)
    }
  }

  const handleToggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices)
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId)
    } else {
      newSelected.add(serviceId)
    }
    onSelectedServicesChange(newSelected)
  }

  if (!staff) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Services for {staff.full_name}</DialogTitle>
          <DialogDescription>
            Assign services this staff member can perform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Selector */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'bulk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('bulk')}
            >
              Bulk Assign
            </Button>
            <Button
              variant={mode === 'single' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('single')}
            >
              Single Assign
            </Button>
          </div>

          {mode === 'bulk' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <P className="text-sm font-medium">
                  Select services ({selectedServices.size} selected)
                </P>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onSelectedServicesChange(new Set(availableServices.map((s) => s.id!)))
                    }}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectedServicesChange(new Set())}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto border rounded-md p-4">
                {availableServices.map((service) => (
                  <div key={service.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={selectedServices.has(service.id!)}
                      onCheckedChange={() => handleToggleService(service.id!)}
                    />
                    <Label
                      htmlFor={`service-${service.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {service.name}
                      {assignedServiceIds.has(service.id) && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Assigned
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Service</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices
                      .filter((s) => !assignedServiceIds.has(s.id))
                      .map((service) => (
                        <SelectItem key={service.id} value={service.id!}>
                          {service.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="proficiency">Proficiency Level</Label>
                <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price Override ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Leave empty for default"
                    value={priceOverride}
                    onChange={(e) => setPriceOverride(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration Override (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    placeholder="Leave empty for default"
                    value={durationOverride}
                    onChange={(e) => setDurationOverride(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Optional notes about this assignment"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                />
              </div>
            </div>
          )}

          {/* Currently Assigned Services */}
          {assignedServices.length > 0 && (
            <div>
              <P className="text-sm font-medium mb-2">Currently Assigned</P>
              <div className="flex flex-wrap gap-2">
                {assignedServices.map((service) => (
                  <Badge key={service.id} variant="secondary">
                    {service.service_name}
                    <button
                      onClick={() => handleUnassign(service.service_id!)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={mode === 'bulk' ? handleBulkAssign : handleSingleAssign}
            disabled={
              isSubmitting ||
              (mode === 'bulk' ? selectedServices.size === 0 : !selectedService)
            }
          >
            {isSubmitting
              ? 'Assigning...'
              : mode === 'bulk'
              ? `Assign ${selectedServices.size} Services`
              : 'Assign Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
