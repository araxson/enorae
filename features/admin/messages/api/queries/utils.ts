import type {
  AdminMessageRow,
  FirstResponseResult,
  MessageRow,
  ThreadPriority,
  ThreadStatus,
} from './types'

export const toTimestamp = (value: string | null | undefined): number | null => {
  if (!value) return null
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

export const computeFirstResponse = (thread: AdminMessageRow, messages: MessageRow[]): FirstResponseResult => {
  const customerId = thread['customer_id']
  const staffId = thread['staff_id']
  if (!customerId || !staffId || !messages.length) {
    return { minutes: null, firstCustomerMessageAt: null }
  }

  const customerMessages = messages.filter((message) => message['from_user_id'] === customerId)
  if (!customerMessages.length) {
    return { minutes: null, firstCustomerMessageAt: null }
  }

  const firstCustomerMessage = customerMessages[0]
  if (!firstCustomerMessage) {
    return { minutes: null, firstCustomerMessageAt: null }
  }

  const firstCustomerTimestamp = toTimestamp(firstCustomerMessage['created_at'])
  if (firstCustomerTimestamp === null) {
    return { minutes: null, firstCustomerMessageAt: null }
  }

  const staffResponse = messages.find((message) => {
    if (message['from_user_id'] !== staffId) return false
    const messageTimestamp = toTimestamp(message['created_at'])
    return messageTimestamp !== null && messageTimestamp > firstCustomerTimestamp
  })

  if (!staffResponse) {
    return { minutes: null, firstCustomerMessageAt: firstCustomerMessage['created_at'] ?? null }
  }

  const staffResponseTimestamp = toTimestamp(staffResponse['created_at'])
  if (staffResponseTimestamp === null) {
    return { minutes: null, firstCustomerMessageAt: firstCustomerMessage['created_at'] ?? null }
  }

  const diffMinutes = (staffResponseTimestamp - firstCustomerTimestamp) / (60 * 1000)

  return {
    minutes: diffMinutes,
    firstCustomerMessageAt: firstCustomerMessage['created_at'] ?? null,
  }
}

export const normaliseStatus = (status: string | null | undefined): ThreadStatus | null => {
  if (!status) return null
  return status.toLowerCase() as ThreadStatus
}

export const normalisePriority = (priority: string | null | undefined): ThreadPriority | null => {
  if (!priority) return null
  return priority.toLowerCase() as ThreadPriority
}
