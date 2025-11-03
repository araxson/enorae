'use client'

import { UseFormReturn } from 'react-hook-form'
import { AddressSchema } from '@/features/business/locations/api/schema'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type Props = {
  form: UseFormReturn<AddressSchema>
}

export function StreetAddressSection({ form }: Props) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Street Address</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-6">
          <Separator />

          <FormField
            control={form.control}
            name="street_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Street Address <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="123 Main Street"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address_line_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment, Suite, etc.</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Suite 100"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    City <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="San Francisco"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    State/Province <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="CA"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Postal Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="94102"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="US"
                    maxLength={2}
                  />
                </FormControl>
                <FormDescription>2-letter country code (e.g., US, CA, UK).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </ItemContent>
    </Item>
  )
}
