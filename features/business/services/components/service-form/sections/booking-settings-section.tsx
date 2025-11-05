'use client'

type BookingSettingsSectionProps = {
  errors?: Record<string, string[]>
  isPending: boolean
  isOnlineBookingEnabled?: boolean | null
  requiresDeposit?: boolean | null
  depositAmount?: number | null
}

export function BookingSettingsSection({
  errors,
  isPending,
  isOnlineBookingEnabled,
  requiresDeposit,
  depositAmount,
}: BookingSettingsSectionProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold mb-4">Booking Settings</legend>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label htmlFor="is_online_booking_enabled" className="text-base font-medium">
            Online Booking
          </label>
          <p className="text-sm text-muted-foreground">
            Allow customers to book this service online
          </p>
        </div>
        <input
          type="checkbox"
          id="is_online_booking_enabled"
          name="is_online_booking_enabled"
          value="true"
          defaultChecked={isOnlineBookingEnabled ?? true}
          disabled={isPending}
          className="h-4 w-4"
          aria-describedby="is_online_booking_enabled-description"
        />
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label htmlFor="requires_deposit" className="text-base font-medium">
            Require Deposit
          </label>
          <p className="text-sm text-muted-foreground">
            Require customers to pay a deposit when booking
          </p>
        </div>
        <input
          type="checkbox"
          id="requires_deposit"
          name="requires_deposit"
          value="true"
          defaultChecked={requiresDeposit ?? false}
          disabled={isPending}
          className="h-4 w-4"
        />
      </div>

      <div>
        <label htmlFor="deposit_amount" className="block font-medium mb-1">
          Deposit Amount
        </label>
        <input
          id="deposit_amount"
          name="deposit_amount"
          type="number"
          step="0.01"
          min="0"
          aria-invalid={!!errors?.['deposit_amount']}
          aria-describedby={errors?.['deposit_amount'] ? 'deposit_amount-error deposit_amount-hint' : 'deposit_amount-hint'}
          disabled={isPending}
          defaultValue={depositAmount || ''}
          placeholder="0.00"
          className={`w-full px-3 py-2 border rounded-md ${
            errors?.['deposit_amount'] ? 'border-destructive' : 'border-input'
          }`}
        />
        <p id="deposit_amount-hint" className="text-sm text-muted-foreground mt-1">
          Amount required as deposit (cannot exceed base price)
        </p>
        {errors?.['deposit_amount'] && (
          <p id="deposit_amount-error" className="text-sm text-destructive mt-1" role="alert">
            {errors['deposit_amount'][0]}
          </p>
        )}
      </div>
    </fieldset>
  )
}
