import { useMemo } from 'react'

export interface VirtualizedItem<T> {
  index: number
  item: T
  style: React.CSSProperties
}

export interface VirtualizationResult<T> {
  virtualItems: Array<VirtualizedItem<T>>
  totalHeight: number
}

export interface UseVirtualizationOptions<T> {
  items: T[]
  containerHeight: number
  itemHeight: number
  scrollTop: number
  overscan?: number
}

export function useVirtualization<T>({
  items,
  containerHeight,
  itemHeight,
  scrollTop,
  overscan = 3,
}: UseVirtualizationOptions<T>): VirtualizationResult<T> {
  return useMemo(() => {
    const totalHeight = items.length * itemHeight
    const visibleStart = Math.floor(scrollTop / itemHeight)
    const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight)

    const start = Math.max(0, visibleStart - overscan)
    const end = Math.min(items.length, visibleEnd + overscan)

    const virtualItems = []
    for (let index = start; index < end; index += 1) {
      virtualItems.push({
        index,
        item: items[index],
        style: {
          position: 'absolute',
          top: index * itemHeight,
          height: itemHeight,
          width: '100%',
        } as React.CSSProperties,
      })
    }

    return { virtualItems, totalHeight }
  }, [items, containerHeight, itemHeight, scrollTop, overscan])
}
