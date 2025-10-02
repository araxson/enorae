/**
 * Stack Component
 *
 * Vertical flex layout for stacking elements.
 * Common use cases: forms, card content, navigation lists.
 */

import { forwardRef } from 'react'
import { Flex, type FlexProps } from './flex'

export type StackProps = Omit<FlexProps, 'direction' | 'inline'>

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    return (
      <Flex
        ref={ref}
        direction="col"
        {...props}
      />
    )
  }
)

Stack.displayName = 'Stack'