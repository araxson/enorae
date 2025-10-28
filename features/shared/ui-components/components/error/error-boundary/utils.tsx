import { AlertCircle, ShieldAlert, ServerCrash, WifiOff } from 'lucide-react'

export type ErrorType = 'network' | 'auth' | 'server' | 'client'

export function detectErrorType(error: Error & { digest?: string }): ErrorType {
  const message = error.message.toLowerCase()

  if (message.includes('unauthorized') || message.includes('auth') || message.includes('permission')) {
    return 'auth'
  }
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network'
  }
  if (message.includes('server') || message.includes('500') || message.includes('internal') || error.digest) {
    return 'server'
  }

  return 'client'
}

export const ERROR_TITLES: Record<ErrorType, string> = {
  network: 'Connection Error',
  auth: 'Authentication Required',
  server: 'Server Error',
  client: 'Something Went Wrong',
}

export const ERROR_DESCRIPTIONS: Record<ErrorType, string> = {
  network: 'Unable to connect to the server. Please check your internet connection and try again.',
  auth: 'You need to be signed in to view this content. Please log in and try again.',
  server: 'Our servers encountered an issue. Our team has been notified and is working on a fix.',
  client: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
}

export function getErrorIcon(type: ErrorType) {
  switch (type) {
    case 'network':
      return <WifiOff className="size-5 text-destructive" />
    case 'auth':
      return <ShieldAlert className="size-5 text-destructive" />
    case 'server':
      return <ServerCrash className="size-5 text-destructive" />
    default:
      return <AlertCircle className="size-5 text-destructive" />
  }
}
