'use server'

import { revalidateTag as nextRevalidateTag } from 'next/cache'

export async function revalidateCacheTags(tags: string[]) {
  tags.forEach((tag) => nextRevalidateTag(tag))
}

export function withRevalidation<T extends (...args: never[]) => Promise<unknown>>(
  mutationFn: T,
  tagsToRevalidate: string[],
): T {
  return (async (...args: Parameters<T>) => {
    const result = await mutationFn(...args)
    await revalidateCacheTags(tagsToRevalidate)
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
