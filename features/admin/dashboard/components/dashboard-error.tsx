import type { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type DashboardErrorProps = {
  title: string
  description: ReactNode
  variant?: 'default' | 'destructive'
}

export function DashboardError({ title, description, variant = 'default' }: DashboardErrorProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Alert variant={variant}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  )
}
