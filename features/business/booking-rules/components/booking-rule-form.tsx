'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { BookingRuleWithService } from '@/features/business/booking-rules/api/queries'
import { ButtonGroup } from '@/components/ui/button-group'
import { ruleSchema } from '../api/schema'
import { z } from 'zod'
import { useEffect } from 'react'

interface BookingRuleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule?: BookingRuleWithService | null
  services: Array<{ id: string; name: string }>
  onSubmit: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
}

type RuleFormValues = z.infer<typeof ruleSchema>

export function BookingRuleForm({
  open,
  onOpenChange,
  rule,
  services,
  onSubmit,
}: BookingRuleFormProps) {
  const router = useRouter()

  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      serviceId: rule?.service_id || '',
      durationMinutes: rule?.duration_minutes || undefined,
      bufferMinutes: rule?.buffer_minutes || undefined,
      minAdvanceBookingHours: rule?.min_advance_booking_hours || undefined,
      maxAdvanceBookingDays: rule?.max_advance_booking_days || undefined,
    },
  })

  useEffect(() => {
    if (open && rule) {
      form.reset({
        serviceId: rule.service_id ?? '',
        durationMinutes: rule.duration_minutes ?? undefined,
        bufferMinutes: rule.buffer_minutes ?? undefined,
        minAdvanceBookingHours: rule.min_advance_booking_hours ?? undefined,
        maxAdvanceBookingDays: rule.max_advance_booking_days ?? undefined,
      })
    } else if (!open) {
      form.reset()
    }
  }, [open, rule, form])

  async function handleFormSubmit(data: RuleFormValues) {
    const formData = new FormData()
    formData.set('serviceId', data.serviceId)
    if (data.durationMinutes !== undefined) formData.set('durationMinutes', String(data.durationMinutes))
    if (data.bufferMinutes !== undefined) formData.set('bufferMinutes', String(data.bufferMinutes))
    if (data.minAdvanceBookingHours !== undefined) formData.set('minAdvanceBookingHours', String(data.minAdvanceBookingHours))
    if (data.maxAdvanceBookingDays !== undefined) formData.set('maxAdvanceBookingDays', String(data.maxAdvanceBookingDays))

    const result = await onSubmit(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(rule ? 'Rule updated successfully' : 'Rule created successfully')
      onOpenChange(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit' : 'Create'} Booking Rule</DialogTitle>
          <DialogDescription>
            Configure booking constraints for a service
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!!rule}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {rule ? 'Service cannot be changed for existing rules' : 'Choose the service for this booking rule'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Optional override"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Override service duration for booking purposes</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bufferMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buffer (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Optional override"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Buffer time between appointments</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minAdvanceBookingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Advance Booking (hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 24"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Minimum hours in advance customers must book</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxAdvanceBookingDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Advance Booking (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 90"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Maximum days in advance customers can book</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Spinner className="size-4" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <span>{rule ? 'Update' : 'Create'}</span>
                  )}
                </Button>
              </ButtonGroup>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
