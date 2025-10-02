import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Aspect ratio as number (width / height) or preset
   * @example 16/9, 4/3, 1, "square", "video", "portrait"
   */
  ratio?: number | 'square' | 'video' | 'portrait' | 'wide' | 'ultrawide'
}

const ratioPresets = {
  square: 1,        // 1:1
  video: 16 / 9,    // 16:9
  portrait: 3 / 4,  // 3:4
  wide: 21 / 9,     // 21:9
  ultrawide: 32 / 9 // 32:9
} as const

/**
 * AspectRatio Component
 * Maintains aspect ratio for content (images, videos, etc.)
 *
 * @example
 * <AspectRatio ratio={16/9}>
 *   <img src="..." alt="..." className="object-cover" />
 * </AspectRatio>
 *
 * @example
 * <AspectRatio ratio="video">
 *   <iframe src="..." />
 * </AspectRatio>
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  (
    {
      className,
      ratio = 'video',
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Resolve ratio
    const resolvedRatio = typeof ratio === 'string' ? ratioPresets[ratio] : ratio

    // Calculate padding-bottom percentage
    const paddingBottom = `${(1 / resolvedRatio) * 100}%`

    return (
      <div
        ref={ref}
        className={cn('relative w-full', className)}
        style={{
          ...style,
          paddingBottom
        }}
        {...props}
      >
        <div className="absolute inset-0">
          {children}
        </div>
      </div>
    )
  }
)

AspectRatio.displayName = 'AspectRatio'