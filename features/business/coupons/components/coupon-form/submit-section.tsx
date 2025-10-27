import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface CouponSubmitSectionProps {
  isLoading: boolean
  isEditing: boolean
}

export function CouponSubmitSection({ isLoading, isEditing }: CouponSubmitSectionProps) {
  return (
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Spinner className="size-4" />
          <span>{isEditing ? 'Saving...' : 'Creating...'}</span>
        </>
      ) : (
        <span>{isEditing ? 'Save Changes' : 'Create Coupon'}</span>
      )}
    </Button>
  )
}
