'use client'

type PricingDurationSectionProps = {
  errors?: Record<string, string[]>
  isPending: boolean
  basePrice?: number | null
  durationMinutes?: number | null
  bufferMinutes?: number | null
}

export function PricingDurationSection({
  errors,
  isPending,
  basePrice,
  durationMinutes,
  bufferMinutes,
}: PricingDurationSectionProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold mb-4">Pricing & Duration</legend>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="base_price" className="block font-medium mb-1">
            Price
            <span className="text-destructive" aria-label="required"> *</span>
          </label>
          <input
            id="base_price"
            name="base_price"
            type="number"
            step="0.01"
            min="0"
            required
            aria-required="true"
            aria-invalid={!!errors?.['base_price']}
            aria-describedby={errors?.['base_price'] ? 'base_price-error' : undefined}
            disabled={isPending}
            defaultValue={basePrice || ''}
            placeholder="0.00"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['base_price'] ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors?.['base_price'] && (
            <p id="base_price-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['base_price'][0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="duration_minutes" className="block font-medium mb-1">
            Duration (minutes)
            <span className="text-destructive" aria-label="required"> *</span>
          </label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min="5"
            max="480"
            required
            aria-required="true"
            aria-invalid={!!errors?.['duration_minutes']}
            aria-describedby={errors?.['duration_minutes'] ? 'duration_minutes-error' : undefined}
            disabled={isPending}
            defaultValue={durationMinutes || '30'}
            placeholder="30"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['duration_minutes'] ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors?.['duration_minutes'] && (
            <p id="duration_minutes-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['duration_minutes'][0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="buffer_minutes" className="block font-medium mb-1">
          Buffer Time (minutes)
        </label>
        <input
          id="buffer_minutes"
          name="buffer_minutes"
          type="number"
          min="0"
          max="120"
          aria-invalid={!!errors?.['buffer_minutes']}
          aria-describedby={errors?.['buffer_minutes'] ? 'buffer_minutes-error buffer_minutes-hint' : 'buffer_minutes-hint'}
          disabled={isPending}
          defaultValue={bufferMinutes || '0'}
          placeholder="0"
          className={`w-full px-3 py-2 border rounded-md ${
            errors?.['buffer_minutes'] ? 'border-destructive' : 'border-input'
          }`}
        />
        <p id="buffer_minutes-hint" className="text-sm text-muted-foreground mt-1">
          Time between appointments for cleanup or preparation
        </p>
        {errors?.['buffer_minutes'] && (
          <p id="buffer_minutes-error" className="text-sm text-destructive mt-1" role="alert">
            {errors['buffer_minutes'][0]}
          </p>
        )}
      </div>
    </fieldset>
  )
}
