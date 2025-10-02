/**
 * Group Component
 *
 * Horizontal flex layout with wrapping for grouping inline elements.
 * Common use cases: button groups, tag lists, chip groups.
 */

import { forwardRef } from 'react'
import { Flex, type FlexProps } from './flex'

export type GroupProps = Omit<FlexProps, 'direction' | 'wrap'>

export const Group = forwardRef<HTMLDivElement, GroupProps>(
  ({ gap = 'sm', align = 'center', ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="row"
        wrap="wrap"
        gap={gap}
        align={align}
        {...props}
      />
    )
  }
)

Group.displayName = 'Group'