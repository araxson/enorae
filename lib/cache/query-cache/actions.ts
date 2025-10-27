'use server'

import { revalidateTag as nextRevalidateTag } from 'next/cache'

export function revalidateCacheTags(tags: string[]): void {
  tags.forEach((tag: string) => {
    // Next.js 16 requires a second parameter for cache lifecycle
    nextRevalidateTag(tag, 'auto')
  })
}

export function withRevalidation<T extends (...args: never[]) => Promise<unknown>>(
  mutationFn: T,
  tagsToRevalidate: string[],
): T {
  return (async (...args: Parameters<T>) => {
    const result = await mutationFn(...args)
    revalidateCacheTags(tagsToRevalidate)
    return result
  }) as T
}

export const cacheUtils = {
  clearDashboard: () => revalidateCacheTags(['dashboard']),
  clearMetrics: () => revalidateCacheTags(['metrics']),
  clearUserData: () => revalidateCacheTags(['user-data']),
  clearSalonData: () => revalidateCacheTags(['salon-data']),
  clearAll: () => revalidateCacheTags(['dashboard', 'metrics', 'user-data', 'salon-data', 'static']),
}
