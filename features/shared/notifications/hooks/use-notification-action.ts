import { useToast } from '@/lib/hooks/use-toast'

export function useNotificationAction<T extends unknown[] = []>(
  action: (...args: T) => Promise<unknown>,
  successTitle: string,
  successDescription: string,
  errorDescription: string
) {
  const { toast } = useToast()

  return async (...args: T) => {
    try {
      await action(...args)
      toast({
        title: successTitle,
        description: successDescription,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: errorDescription,
        variant: 'destructive',
      })
    }
  }
}
