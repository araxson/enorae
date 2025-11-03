'use client'

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { UseFormReturn } from 'react-hook-form'
import type { ServiceSchema, ServiceSchemaInput } from '../../api/schema'
import type { Database } from '@/lib/types/database.types'
import { ButtonGroup } from '@/components/ui/button-group'

type Service = Database['public']['Views']['services_view']['Row']

type ServiceFormContentProps = {
  service: Service | null | undefined
  form: UseFormReturn<ServiceSchemaInput, unknown, ServiceSchema>
  error: string | null
  isEditMode: boolean
  handleSubmit: (data: ServiceSchema) => Promise<void>
  onClose: () => void
}

export function ServiceFormContent({ service, form, error, isEditMode, handleSubmit, onClose }: ServiceFormContentProps) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogDescription>
          {service
            ? 'Update service details, pricing, and booking rules.'
            : 'Create a new service for your salon. Set pricing and duration.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Haircut & Style" {...field} />
                </FormControl>
                <FormDescription>Must be at least 3 characters and contain letters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the service..." rows={3} {...field} value={field.value ?? ''} />
                </FormControl>
                <FormDescription>At least 20 characters to help customers understand the service</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      value={(field.value as string | number | undefined) ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="5"
                      max="480"
                      placeholder="30"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      value={(field.value as string | number | undefined) ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="buffer_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buffer Time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    placeholder="0"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    disabled={field.disabled}
                    value={(field.value as string | number | undefined) ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Time between appointments for cleanup or preparation</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_online_booking_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Online Booking</FormLabel>
                  <FormDescription>Allow customers to book this service online</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requires_deposit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Require Deposit</FormLabel>
                  <FormDescription>Require customers to pay a deposit when booking</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('requires_deposit') && (
            <FormField
              control={form.control}
              name="deposit_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      value={(field.value as string | number | undefined) ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>Amount required as deposit (cannot exceed base price)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <DialogFooter>
            <ButtonGroup>
              <Button type="button" variant="outline" onClick={onClose} disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Spinner className="mr-2" /> : null}
                {service ? 'Update Service' : 'Create Service'}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
