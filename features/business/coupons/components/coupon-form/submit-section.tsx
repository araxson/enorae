import { Button } from '@/components/ui/button'

interface CouponSubmitSectionProps {
  isLoading: boolean
  isEditing: boolean
}

export function CouponSubmitSection({ isLoading, isEditing }: CouponSubmitSectionProps) {
  return (
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading
        ? isEditing
          ? 'Saving...'
          : 'Creating...'
        : isEditing
          ? 'Save Changes'
          : 'Create Coupon'}
    </Button>
  )
}
