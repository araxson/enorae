'use client'

import { ReactNode } from 'react'

interface NotificationSectionProps {
  icon: ReactNode
  title: string
  children: ReactNode
}

export function NotificationSection({ icon, title, children }: NotificationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {children}
    </div>
  )
}
