export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type MaybeNull<T> = T | null | undefined

export type PickExact<T, K extends keyof T> = Pick<T, K>
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
