// Barrel export for shared messaging API
export * from './mutations'
export { createMessage, getThread, revalidateMessagePaths } from './operations'
export type { MessageInput, ThreadInfo } from './operations'
export * from './queries'
export * from './schema'
export * from './types'
