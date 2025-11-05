'use client'

type CoordinatesFieldsProps = {
  isPending: boolean
  errors?: Record<string, string[]>
  latitude?: number | null
  longitude?: number | null
}

export function CoordinatesFields({
  isPending,
  errors,
  latitude,
  longitude,
}: CoordinatesFieldsProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold mb-4">Coordinates (Optional)</legend>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block font-medium mb-1">
            Latitude
          </label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="0.000001"
            min="-90"
            max="90"
            aria-invalid={!!errors?.['latitude']}
            aria-describedby={errors?.['latitude'] ? 'latitude-error latitude-hint' : 'latitude-hint'}
            disabled={isPending}
            defaultValue={latitude || ''}
            placeholder="37.7749"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['latitude'] ? 'border-destructive' : 'border-input'
            }`}
          />
          <p id="latitude-hint" className="text-sm text-muted-foreground mt-1">
            Between -90 and 90
          </p>
          {errors?.['latitude'] && (
            <p id="latitude-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['latitude'][0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="longitude" className="block font-medium mb-1">
            Longitude
          </label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="0.000001"
            min="-180"
            max="180"
            aria-invalid={!!errors?.['longitude']}
            aria-describedby={errors?.['longitude'] ? 'longitude-error longitude-hint' : 'longitude-hint'}
            disabled={isPending}
            defaultValue={longitude || ''}
            placeholder="-122.4194"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['longitude'] ? 'border-destructive' : 'border-input'
            }`}
          />
          <p id="longitude-hint" className="text-sm text-muted-foreground mt-1">
            Between -180 and 180
          </p>
          {errors?.['longitude'] && (
            <p id="longitude-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['longitude'][0]}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  )
}
