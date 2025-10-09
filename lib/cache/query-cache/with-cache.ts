import { unstable_cache } from 'next/cache'

export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {},
) {
  return unstable_cache(fn, keyParts, options)
}

export function createCachedQuery<T extends (...args: never[]) => Promise<unknown>>(
  queryFn: T,
  config: { keyPrefix: string; revalidate?: number; tags?: string[] },
): T {
  const { keyPrefix, revalidate = 60, tags = [] } = config

  return (async (...args: Parameters<T>) => {
    const cacheKey = [keyPrefix, ...args.map((arg) => JSON.stringify(arg))]

    return unstable_cache(
      async () => queryFn(...args),
      cacheKey,
      {
        revalidate,
        tags: [keyPrefix, ...tags],
      },
    )()
  }) as T
}
