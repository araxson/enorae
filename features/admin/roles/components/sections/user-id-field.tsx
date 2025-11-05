import { Input } from '@/components/ui/input'

type UserIdFieldProps = {
  errors?: Record<string, string[]>
  firstErrorRef: React.RefObject<HTMLInputElement | null>
}

export function UserIdField({ errors, firstErrorRef }: UserIdFieldProps) {
  return (
    <div>
      <label htmlFor="userId" className="block text-sm font-medium mb-2">
        User ID
        <span className="text-destructive" aria-label="required"> *</span>
      </label>
      <Input
        ref={errors?.['userId'] ? firstErrorRef : null}
        id="userId"
        name="userId"
        placeholder="Enter user UUID"
        required
        aria-required="true"
        aria-invalid={!!errors?.['userId']}
        aria-describedby={
          errors?.['userId'] ? 'userId-error userId-hint' : 'userId-hint'
        }
      />
      <p id="userId-hint" className="text-sm text-muted-foreground mt-1">
        The unique ID of the user to assign the role to
      </p>
      {errors?.['userId'] && (
        <p id="userId-error" className="text-sm text-destructive mt-1" role="alert">
          {errors['userId'][0]}
        </p>
      )}
    </div>
  )
}
